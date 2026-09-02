# OneWinq Enterprise Backend Architecture

## 1. Executive Summary

OneWinq is a single-organization digital identity and verified workforce platform designed as a **Modular Monolith** in modern Node.js and MongoDB. It powers three distinct client experiences:
1. **Admin & Organization Management** (`/api/v1/admin/*`)
2. **Employee Profile & Account Portal** (`/api/v1/me/*`)
3. **Public Verified Profiles & Brand Gateway** (`/api/v1/public/*`)

The architecture cleanly decouples identity, membership, and presentation data, preventing architectural debt and ensuring that multi-tenancy can be seamlessly introduced in the future without rewriting core domain models.

---

## 2. High-Level Architectural Diagram

```text
                                 HTTP Client Requests
                 (Admin Console, Employee App, Public Visitors)
                                          │
                                          ▼
                       Express Application Layer (App.js)
        ┌─────────────────────────────────┬─────────────────────────────────┐
        │  Security & Request Pipeline:   │  Observability:                 │
        │  - Helmet (CSP & Headers)       │  - Structured Logger (Winston)  │
        │  - CORS Policy Engine           │  - Morgan HTTP Telemetry        │
        │  - Request ID Correlation       │  - Error Handler Middleware     │
        │  - Rate Limiters (Global/Auth)  │  - Audit Context Capturer       │
        └─────────────────────────────────┴─────────────────────────────────┘
                                          │
                                          ▼
                                Routing Gateway (v1)
        ┌─────────────────────────┬─────────────────────────┬───────────────┐
        │                         │                         │               │
        ▼                         ▼                         ▼               ▼
  /api/v1/auth/*           /api/v1/public/*           /api/v1/me/*     /api/v1/admin/*
  - Login / Logout         - Company Profile          - My Profile     - Dashboard
  - Token Rotation         - Public Member Profile    - Draft Editor   - Team Members
  - Password Recovery      - Dynamic QR Code Gen      - Submit Review  - Departments
  - Invitation Activation  - Public Telemetry Events  - Notifications  - Roles & RBAC
                                                                       - Approvals
                                                                       - Templates
                                                                       - Analytics
                                                                       - Audit Logs
                                                                       - Settings
                                                                       - Media Assets
                                          │
                                          ▼
                                Modular Domain Services
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  authService           ├── companyProfileService   ├── profileApprovalService
  │  teamMemberService     ├── employeeProfileService  ├── auditLogService
  │  departmentService     ├── templateService         ├── notificationService
  │  roleService           ├── publicProfileService    ├── settingsService
  │  invitationService     ├── analyticsService        └── mediaService
  └─────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
                         Cross-Cutting Event & I/O Layer
        ┌─────────────────────────┬─────────────────────────┬───────────────┐
        │                         │                         │               │
        ▼                         ▼                         ▼               ▼
   AppEventBus               EmailService              StorageService     Mongoose ODM
   - Async Dispatcher        - SMTP Provider           - Local Disk       - Schema Validation
   - Notification Listeners  - Mock / Console          - S3/R2 Interface  - Compound Indexes
   - Audit Log Listeners                                                  - Session Transactions
```

---

## 3. Separation of Concerns: Identity vs Member vs Profile

A core design tenet of OneWinq is avoiding monolithic user documents that conflate credentials, organizational affiliation, and presentation data.

```text
        User (Identity & Auth)
        ├── email: string
        ├── passwordHash: string (Argon2id)
        ├── status: 'active' | 'suspended' | 'inactive'
        ├── emailVerified: boolean
        └── refreshTokens: [{ tokenHash, familyId, expiresAt, isRevoked }]
                     │ (1-to-1)
                     ▼
        TeamMember (Organization Affiliation)
        ├── employeeId: 'OWQ-001'
        ├── name: string
        ├── designation: string
        ├── departmentId ──► Department
        ├── roleId ────────► Role & Permissions
        ├── status: 'active' | 'archived'
        └── profileCompletionScore: 0-100%
                     │ (1-to-1)
                     ▼
        EmployeeProfile (Presentation & Digital Card)
        ├── slug: 'alex-morgan'
        ├── templateId ────► Template (Versioned Visual Layout)
        ├── visibility: 'public' | 'private' | 'internal'
        ├── approvalStatus: 'draft' | 'pending_review' | 'approved' | 'rejected'
        ├── isLocked: boolean (Frozen during active admin review)
        ├── published: { headline, bio, experience[], skills[], projects[], achievements[], socialLinks[] }
        └── draft:     { headline, bio, experience[], skills[], projects[], achievements[], socialLinks[] }
```

---

## 4. Profile Approval & State Isolation Workflow

When profile approval is enabled (`requireApprovalForProfileChanges = true`), employee modifications do not overwrite the live public profile directly:

```text
   Employee Edits Profile
             │
             ▼
      Saves to 'draft'
             │
             ▼
   Submits for Approval
             │
             ├─────────────────────────────────────────────────┐
             ▼                                                 ▼
   Calculates Deep Diff                        Locks Draft (isLocked = true)
   (calculateObjectDiff)                       Status = 'pending_review'
             │                                                 │
             ▼                                                 ▼
   Creates ProfileApproval Record              Dispatches Notification to Admins
   (diffSummary, draftSnapshot)
             │
             ▼
    Admin Reviews Request
             │
   ┌─────────┼─────────────────────────┐
   │         │                         │
   ▼         ▼                         ▼
Approve    Reject               Request Changes
   │         │                         │
   │         ├─► Status='rejected'     ├─► Status='changes_requested'
   │         ├─► Unlocks draft         ├─► Stores requested changes
   │         └─► Notifies employee     └─► Notifies employee
   │
   ├─► Copies draft to published
   ├─► Status = 'approved'
   ├─► Unlocks profile
   ├─► Recalculates completion score
   └─► Notifies employee & logs audit event
```

---

## 5. Security & Authentication Architecture

1. **Password Security**: Argon2id cryptographic hashing with high memory cost and timing-safe verification, with automatic fallback support for bcrypt.
2. **Refresh Token Rotation with Family Reuse Detection**:
   - Each login generates a unique `familyId`.
   - Refreshing a token generates a new token pair and revokes the previous refresh token.
   - If an already-revoked refresh token is presented (indicating token interception or replay attack), the system automatically revokes the **entire token family**, immediately terminating all compromised sessions.
3. **Granular RBAC**:
   - Every administrative action requires explicit permission verification (e.g., `team.create`, `profile_approval.approve`, `settings.update`).
   - Super Admin bypasses all checks via system role authorization.
4. **Brute Force & Lockout Protection**:
   - 5 consecutive failed login attempts lock the user account for 15 minutes.
   - Dedicated authentication rate limiters prevent credential stuffing attacks.

---

## 6. Audit Logging & Observability

- **Centralized Event Dispatch**: Business operations emit events through `AppEventBus`.
- **Automatic Audit Capture**: The audit listener captures `actorId`, `action`, `module`, `resourceId`, `previousValue`, `newValue`, `ipAddress`, `userAgent`, and `requestId`.
- **Zero Sensitive Data Leakage**: Hashed passwords, raw tokens, and API secrets are automatically redacted before reaching log stores or database audit records.
