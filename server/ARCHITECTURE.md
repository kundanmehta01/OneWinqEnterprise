# OneWinq Enterprise Backend Architecture

## 1. Executive Summary

OneWinq is an enterprise-grade digital identity, verified workforce credentials, smart NFC hardware integration, and employee networking platform built as a **Modular Monolith** in modern Node.js (`ESM`) and MongoDB (`Mongoose`). 

The backend powers four distinct client gateways:
1. **Admin & Organization Management Console** (`/api/v1/admin/*`): Executive dashboard, employee directory, departments, granular RBAC permissions, smart NFC card inventory & linking, template builder, profile change review queue, enterprise events management, audit logs, visitor analytics, media storage, and organization security policies.
2. **Employee User Portal & Experience** (`/api/v1/me/*`): Personalized home dashboard (`/me/home`), state-isolated draft profile editor, profile review submission, privacy matrix, active device session management, in-app notification feed, and personal analytics.
3. **Professional Networking, Events & Helpdesk** (`/api/v1/network/*`, `/api/v1/events/*`, `/api/v1/user/*`, `/api/v1/support/*`): Colleague discovery with live connection badges, connection request dispatching, department/role-scoped event RSVP passes, read-only organization explorer, enterprise FAQs, and helpdesk ticketing.
4. **Public Verified Profiles & Smart NFC Tap Gateway** (`/api/v1/public/*`): Public company branding profile, live employee digital profiles by vanity slug, dynamic QR code generator (SVG / Data URL), contactless NFC smart card tap resolver (`/public/cards/:cardUid`), and anonymous interaction telemetry.

---

## 2. High-Level Architectural Diagram

```text
                                         HTTP Client Requests
                    (Admin Panel, Employee Mobile/Web App, Public Visitors, NFC Card Taps)
                                                   │
                                                   ▼
                               Express Application Layer (App.js)
        ┌──────────────────────────────────────────┬──────────────────────────────────────────┐
        │  Security & Request Pipeline:            │  Observability & Diagnostics:            │
        │  - Helmet (Security Headers & CSP)       │  - Structured Winston Logger             │
        │  - CORS Policy Engine                    │  - Morgan HTTP Telemetry                 │
        │  - Request Correlation ID (x-request-id) │  - Centralized AppError Hierarchy        │
        │  - Rate Limiters (Global / Auth / Public)│  - Audit Context Capturer Middleware     │
        └──────────────────────────────────────────┴──────────────────────────────────────────┘
                                                   │
                                                   ▼
                                        Routing Gateway (v1)
        ┌───────────────────┬───────────────────┬───────────────────┬───────────────────┐
        ▼                   ▼                   ▼                   ▼                   ▼
  /api/v1/auth/*      /api/v1/public/*    /api/v1/me/*        /api/v1/network/*   /api/v1/admin/*
  - Login / Logout    - Company Profile   - /home & /dashboard- Colleague Search  - Dashboard
  - Token Rotation    - Member Profiles   - Profile Editor    - Connection Req.   - Team Directory
  - Password Reset    - Dynamic QR Code   - Settings & Privacy- Mutual Network    - Departments
  - Invite Accept     - NFC Tap Resolver  - Device Sessions   /api/v1/events/*    - Roles & RBAC
                      - Telemetry Events  - Notifications     - Event Directory   - NFC Card Stock
                                                              - Ticket RSVP       - Approvals Queue
                                                              /api/v1/user/*      - Templates
                                                              - Org Directory     - Events Admin
                                                              /api/v1/support/*   - Analytics
                                                              - FAQs & Tickets    - Audit Logs
                                                   │
                                                   ▼
                                       Modular Domain Services
  ┌───────────────────────────────────────────────────────────────────────────────────────────┐
  │  authService           ├── companyProfileService   ├── cardService        ├── eventService
  │  teamMemberService     ├── employeeProfileService  ├── connectionService  ├── supportService
  │  departmentService     ├── templateService         ├── userDashboardService ├── auditLogService
  │  roleService           ├── publicProfileService    ├── userSettingsService  ├── notificationService
  │  invitationService     ├── analyticsService        ├── userDirectoryService └── mediaService
  └───────────────────────────────────────────────────────────────────────────────────────────┘
                                                   │
                                                   ▼
                                  Cross-Cutting Event & I/O Layer
        ┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
        │                         │                         │                         │
        ▼                         ▼                         ▼                         ▼
   AppEventBus               EmailService              StorageService            Mongoose ODM
   - Event Dispatcher        - SMTP Provider           - Local Disk Storage      - Schema Validation
   - Notification Listener   - Mock / Console Mode     - Cloudinary Provider     - Compound Indexes
   - Audit Log Listener                                - S3 / R2 Interface       - State Isolation
```

---

## 3. Separation of Concerns: Identity vs Member vs Profile vs Card

OneWinq enforces strict separation between authentication credentials, organizational affiliation, presentation layer, and physical NFC hardware:

```text
       User (Identity & Credentials)
       ├── email: 'rajat@onewinq.in'
       ├── passwordHash: string (Argon2id / bcrypt)
       ├── status: 'active' | 'suspended' | 'inactive'
       ├── failedLoginAttempts, lockUntil
       └── refreshTokens: [{ tokenHash, familyId, expiresAt, ipAddress, isRevoked }]
                    │ (1-to-1)
                    ▼
       TeamMember (Organizational Affiliation)
       ├── employeeId: 'OWQ-001'
       ├── name: 'Rajat Chaturvedi'
       ├── designation: 'Founder & CEO'
       ├── departmentId ──► Department ('Executive Leadership')
       ├── roleId ────────► Role & Permissions ('Super Admin')
       ├── status: 'active' | 'archived'
       └── profileCompletionScore: 0-100%
                    │ (1-to-1)
                    ├──────────────────────────────────────────────────┐
                    ▼                                                  ▼
       EmployeeProfile (Digital Card / Identity)             Card (Physical NFC Hardware)
       ├── slug: 'rajat-chaturvedi'                          ├── cardUid: 'OWQ-NFC-89421'
       ├── templateId ────► Template (Founder Layout)        ├── serialNumber: 'SN-2026-00101'
       ├── visibility: 'public' | 'internal' | 'private'     ├── cardType: 'metal_black'
       ├── approvalStatus: 'draft'|'pending_review'|'approved'├── status: 'linked'|'unassigned'|'blocked'
       ├── isLocked: boolean (Frozen during review)          ├── linkedAt, linkedBy, unlinkedAt, unlinkedBy
       ├── published: { headline, bio, experience[], ... }   ├── tapCount: 142, lastTappedAt: Date
       └── draft:     { headline, bio, experience[], ... }   └── notes: 'Matte Black Metal NFC Card'
```

---

## 4. Smart NFC Card Lifecycle & Public Resolver

Physical NFC cards represent physical hardware stock that seamlessly links to an employee's live digital profile:

```text
                                  SMART NFC CARD LIFECYCLE
                                             │
            ┌────────────────────────────────┴────────────────────────────────┐
            ▼                                                                 ▼
   📦 INVENTORY & LINKING (Admin)                                    📲 PHYSICAL TAP RESOLVER (Public)
   1. Admin adds card stock to inventory                             1. Mobile phone taps NFC chip
      (POST /api/v1/admin/cards)                                        (GET /api/v1/public/cards/:cardUid)
   2. Status = 'unassigned'                                          2. System resolves Card by cardUid:
   3. Admin links card to employee                                      ├── If 'linked':
      (POST /api/v1/admin/cards/link)                                   │   ├── Increments tapCount & lastTappedAt
      ├── Binds card.memberId & card.profileId                          │   ├── Ingests QR_SCAN / CARD_TAP telemetry
      └── Status transitions to 'linked'                                │   └── Returns { slug, redirectUrl: '/p/:slug' }
   4. If employee leaves or returns card:                               ├── If 'unassigned':
      Admin unlinks (POST /api/v1/admin/cards/unlink)                   │   └── Returns activation pending message
      └── Resets status to 'unassigned' for reissue                     └── If 'blocked' / 'lost':
   5. If reported lost:                                                     └── Returns security deactivation notice
      Admin marks as 'lost' / 'blocked' (PATCH status)
```

---

## 5. Profile Approval & State Isolation Workflow

When organization profile moderation is enabled (`requireApprovalForProfileChanges = true`), employee profile edits do not overwrite the live public card directly:

```text
   Employee Edits Profile in /me/profile
                 │
                 ▼
          Saves to 'draft'
                 │
                 ▼
       Submits for Approval (POST /me/profile/submit)
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
        Admin Reviews Request (POST /admin/approvals/:id/review)
                 │
       ┌─────────┼─────────────────────────┐
       │         │                         │
       ▼         ▼                         ▼
    Approve    Reject               Request Changes
       │         │                         │
       │         ├─► Status='rejected'     ├─► Status='changes_requested'
       │         ├─► Unlocks draft         ├─► Stores reviewer feedback
       │         └─► Notifies employee     └─► Notifies employee
       │
       ├─► Copies draft to published
       ├─► Status = 'approved'
       ├─► Unlocks profile
       ├─► Recalculates completion score (0-100%)
       └─► Notifies employee & records audit log entry
```

---

## 6. Enterprise Events & Access Control

```text
   Admin Creates Event (POST /admin/events)
   ├── Details: title, category, coverImageUrl, date range, venue / virtual URL
   └── Access Eligibility:
       ├── type: 'all' (Open to all employees)
       ├── type: 'departments' (Restricted to specific department IDs)
       └── type: 'roles' (Restricted to specific role IDs)
                 │
                 ▼
   Employee Views Events Feed (GET /events)
   ├── System automatically filters events matching employee's department & role
   └── Employee Registers RSVP (POST /events/:id/register)
       ├── Verifies capacity limit & deadline
       ├── Issues unique ticket pass (ticketCode: 'OWQ-EVT-XXXXXX')
       └── Returns pass in GET /events/my-events
```

---

## 7. Security, RBAC & Authentication Architecture

1. **Password Hashing**: `Argon2id` (and `bcryptjs`) cryptographic hashing with high memory cost and constant-time string comparisons.
2. **Refresh Token Rotation with Token Family Reuse Detection**:
   - Each login session creates a distinct `familyId`.
   - Refreshing a token generates a new pair and revokes the old refresh token.
   - If an already-revoked refresh token is replayed (indicating token theft), the backend revokes the **entire token family**, immediately invalidating all associated sessions.
3. **Granular RBAC**:
   - 48 distinct permissions across 16 functional domains (e.g. `team.read`, `card.link`, `event.create`, `profile_approval.approve`).
   - Super Admin bypasses all checks via system role authorization.
4. **Active Session Management**:
   - Employees can inspect all active device sessions (`/me/settings`) and terminate suspicious or old devices remotely.
5. **Brute Force & Lockout Protection**:
   - 5 consecutive failed login attempts lock the account for 15 minutes.

---

## 8. Immutable Audit Logging & Observability

- **Centralized Event Dispatch**: Business operations emit events through `AppEventBus`.
- **Automatic Audit Capture**: The audit listener captures `actorId`, `action`, `module`, `resourceId`, `previousValue`, `newValue`, `ipAddress`, `userAgent`, and `requestId`.
- **Zero Sensitive Data Leakage**: Passwords, raw tokens, and secret keys are automatically stripped before writing to audit collections or logs.
