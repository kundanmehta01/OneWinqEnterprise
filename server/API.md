# OneWinq Enterprise API Documentation

Base URL: `http://localhost:5000/api/v1`  
Interactive Swagger UI: `http://localhost:5000/api-docs`

---

## 1. Authentication & Session Management (`/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Authenticate with email & password, returns JWT tokens and user | No |
| `POST` | `/auth/refresh-token` | Rotate refresh token and obtain new access token | No |
| `POST` | `/auth/forgot-password` | Request password reset email | No |
| `POST` | `/auth/reset-password` | Reset password using cryptographically secure token | No |
| `POST` | `/auth/logout` | Revoke active refresh token and clear cookies | Yes |
| `GET` | `/auth/me` | Fetch authenticated user, team member, role, and permissions | Yes |
| `POST` | `/auth/change-password` | Update account password | Yes |

---

## 2. Public Gateway (`/public`)

*Designed for unauthenticated public visitors, QR scanners, and mobile profile viewers.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/public/company` | Retrieve published OneWinq company profile, branding, and dynamic sections |
| `GET` | `/public/profiles/:slug` | Retrieve public employee profile by slug with QR code Data URL |
| `GET` | `/public/profiles/:slug/qr` | Retrieve QR code SVG or PNG directly for download or embedding |
| `POST` | `/public/events` | Record public interaction telemetry (`QR_SCAN`, `CONTACT_CLICK`, `PROFILE_LINK_CLICK`) |

---

## 3. Employee Self-Service (`/me`)

*Endpoints for authenticated employees to manage their own digital presence and account.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/me/profile` | Retrieve own profile (returns both `draft` and `published` states) |
| `PATCH` | `/me/profile` | Update draft profile (headline, bio, skills, experience, projects, social links) |
| `POST` | `/me/profile/submit` | Submit draft profile for administrator review & approval |
| `GET` | `/me/profile/status` | Retrieve current approval status, diff summary, and reviewer notes |
| `GET` | `/me/notifications` | Fetch in-app notifications with pagination |
| `GET` | `/me/notifications/unread-count` | Get count of unread notifications |
| `PATCH` | `/me/notifications/:id/read` | Mark individual notification as read |
| `POST` | `/me/notifications/mark-all-read` | Mark all user notifications as read |

---

## 4. Admin Management (`/admin`)

*Endpoints requiring specific RBAC permissions (`requirePermission`).*

### Dashboard & Analytics
- `GET /admin/dashboard`: Executive overview KPIs, member counts, approval queue summary, weekly view trends. (`dashboard.read`)
- `GET /admin/analytics`: Aggregated organization-wide analytics with time-range filtering (`today`, `7d`, `30d`, `custom`). (`analytics.read`)
- `GET /admin/audit-logs`: Search and filter comprehensive immutable audit trail records. (`audit_log.read`)

### Team Members & Departments
- `GET /admin/team`: Paginated team member directory with search and filtering by department/role/status. (`team.read`)
- `GET /admin/team/:id`: Retrieve single team member details. (`team.read`)
- `POST /admin/team`: Create new team member directly. (`team.create`)
- `PATCH /admin/team/:id`: Update team member designation, department, role, or status. (`team.update`)
- `DELETE /admin/team/:id`: Soft delete / archive team member. (`team.delete`)
- `POST /admin/team/:id/restore`: Restore archived team member. (`team.update`)
- `GET /admin/departments`: List all departments with active member counts. (`department.read`)
- `POST /admin/departments`: Create department. (`department.create`)
- `PATCH /admin/departments/:id`: Update department. (`department.update`)
- `DELETE /admin/departments/:id`: Archive department (verifies no active members exist). (`department.delete`)

### Invitations
- `GET /admin/invitations`: List all invitations with status filter. (`invitation.read`)
- `POST /admin/invitations`: Invite new employee via email. (`invitation.create`)
- `POST /admin/invitations/:id/resend`: Resend invitation email with refreshed token. (`invitation.resend`)
- `POST /admin/invitations/:id/cancel`: Cancel pending invitation. (`invitation.cancel`)
- `GET /invitations/verify?token=...`: Validate invitation token for onboarding view (Public).
- `POST /invitations/accept`: Accept invitation and activate account (Public).

### Profile Approvals & Templates
- `GET /admin/approvals`: List pending or historical profile review requests with diff previews. (`profile_approval.read`)
- `POST /admin/approvals/:id/review`: Approve, reject, or request changes on employee draft submission. (`profile_approval.approve`)
- `GET /admin/templates`: List profile templates. (`template.read`)
- `POST /admin/templates`: Create new profile template. (`template.create`)
- `PATCH /admin/templates/:id`: Update template layout and snapshot version history. (`template.update`)
- `POST /admin/templates/:id/duplicate`: Clone an existing template. (`template.create`)
- `DELETE /admin/templates/:id`: Archive template. (`template.delete`)

### Company Profile & Settings
- `GET /admin/company-profile`: Retrieve company profile, branding, and dynamic sections. (`company_profile.read`)
- `PATCH /admin/company-profile`: Update company information, branding, dynamic sections, and navigation. (`company_profile.update`)
- `GET /admin/settings`: Retrieve organization settings and security policies. (`settings.read`)
- `PATCH /admin/settings`: Update organization settings. (`settings.update`)

### Roles & Permissions
- `GET /admin/roles`: List all system and custom roles with associated permissions. (`role.read`)
- `POST /admin/roles`: Create custom role. (`role.create`)
- `PATCH /admin/roles/:id`: Update role permissions. (`role.update`)
- `DELETE /admin/roles/:id`: Delete custom role (system roles are protected). (`role.delete`)
- `GET /admin/permissions`: List all available granular permissions. (`role.read`)
- `GET /admin/permissions/by-module`: List permissions grouped by module. (`role.read`)

### Media Management
- `POST /admin/media/upload`: Upload asset (logo, avatar, cover image, PDF) via multipart form (`media.upload`)
- `GET /admin/media`: List uploaded assets with pagination. (`media.read`)
- `DELETE /admin/media/:id`: Delete media asset. (`media.delete`)

---

## 5. Standard Response Format

### Success:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": {
    "totalItems": 42,
    "itemsPerPage": 20,
    "totalPages": 3,
    "currentPage": 1,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error:
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "You do not have permission to perform this action.",
    "details": null
  }
}
```
