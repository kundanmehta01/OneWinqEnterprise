# OneWinq Enterprise Backend API Documentation

**Base API URL**: `http://localhost:5000/api/v1`  
**Interactive Swagger UI**: `http://localhost:5000/api-docs`  
**OpenAPI Specification JSON**: `http://localhost:5000/api-docs.json`  
**Health Check**: `GET http://localhost:5000/api/v1/health`

---

## 📑 Quick Navigation
1. [Authentication & Session Management (`/auth`)](#1-authentication--session-management-auth)
2. [Public Gateway & Tap Resolver (`/public`)](#2-public-gateway--tap-resolver-public)
3. [Employee User Experience (`/me`)](#3-employee-user-experience-me)
4. [Professional Networking & Connections (`/network`)](#4-professional-networking--connections-network)
5. [Enterprise Events & Ticketing (`/events`)](#5-enterprise-events--ticketing-events)
6. [Read-Only Organization Explorer (`/user`)](#6-read-only-organization-explorer-user)
7. [Support & Helpdesk (`/support`)](#7-support--helpdesk-support)
8. [Admin Control Panel (`/admin`)](#8-admin-control-panel-admin)
   - [Dashboard & Analytics](#dashboard--analytics)
   - [Smart NFC Cards](#smart-nfc-cards)
   - [Team Members & Departments](#team-members--departments)
   - [Roles & Permissions](#roles--permissions)
   - [Invitations & Onboarding](#invitations--onboarding)
   - [Profile Approvals & Templates](#profile-approvals--templates)
   - [Enterprise Events Management](#enterprise-events-management)
   - [Company Profile & Global Settings](#company-profile--global-settings)
   - [Media & Asset Uploads](#media--asset-uploads)
9. [Standard Response Envelopes](#9-standard-response-envelopes)

---

## 1. Authentication & Session Management (`/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/auth/login` | Authenticate with email & password. Issues JWT access and refresh token. | No |
| `POST` | `/auth/refresh-token` | Rotate refresh token and issue new access token (with family replay protection). | No |
| `POST` | `/auth/forgot-password` | Request password reset email with temporary secure token. | No |
| `POST` | `/auth/reset-password` | Reset password using verified reset token. | No |
| `POST` | `/auth/logout` | Revoke active refresh token and clear cookies. | Yes |
| `GET` | `/auth/me` | Fetch authenticated user, team member record, active role, and permission array. | Yes |
| `POST` | `/auth/change-password` | Update current account password. | Yes |

---

## 2. Public Gateway & Tap Resolver (`/public`)

*Designed for unauthenticated mobile NFC taps, QR code scanners, and web visitors.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/public/company` | Retrieve published 8-section company brand profile, vision, mission, and products. |
| `GET` | `/public/profiles/:slug` | Retrieve live employee digital profile by vanity slug with QR code Data URL. |
| `GET` | `/public/profiles/:slug/qr` | Retrieve dynamic QR code in SVG or PNG format. |
| `GET` | `/public/cards/:cardUid` | **Smart NFC Tap Resolver**: Resolves physical chip UID to employee profile or activation notice. |
| `GET` | `/public/c/:cardUid` | Short redirect alias for contactless NFC taps. |
| `POST` | `/public/events` | Record anonymous visitor interaction telemetry (`PROFILE_VIEW`, `QR_SCAN`, `CARD_TAP`). |

---

## 3. Employee User Experience (`/me`)

*Endpoints for authenticated employees to manage their daily workspace, profile, and security.*

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/me/home` | Personalized home dashboard: hero section, 4-stat KPIs, department widget, company snapshot, upcoming events, notifications. |
| `GET` | `/me/dashboard` | Alias for employee home dashboard. |
| `GET` | `/me/profile` | Retrieve own profile with isolated `draft` and `published` states. |
| `PATCH` | `/me/profile` | Edit draft profile (headline, bio, skills, experience, projects, achievements, social links). |
| `POST` | `/me/profile/submit` | Submit draft profile for administrator review and approval. |
| `GET` | `/me/profile/status` | Retrieve current approval status, diff summary, and reviewer feedback. |
| `GET` | `/me/settings` | Retrieve user privacy matrix, notification preferences, and active device sessions. |
| `PATCH` | `/me/settings` | Update privacy toggles (phone/email/experience visibility) and search engine indexing. |
| `DELETE` | `/me/settings/sessions/:sessionId` | Terminate a specific active device login session. |
| `POST` | `/me/settings/sessions/terminate-others`| Terminate all other active device login sessions. |
| `GET` | `/me/notifications` | Fetch paginated in-app notifications. |
| `GET` | `/me/notifications/unread-count` | Get total count of unread notifications. |
| `PATCH` | `/me/notifications/:id/read` | Mark individual notification as read. |
| `POST` | `/me/notifications/mark-all-read` | Mark all user notifications as read. |

---

## 4. Professional Networking & Connections (`/network`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/network/people` | Discover colleagues with search, department filter, and real-time connection badges (`none`, `pending_sent`, `pending_received`, `connected`). |
| `POST` | `/network/requests` | Send connection request to a colleague with an optional personal note. |
| `PATCH` | `/network/requests/:id/respond` | Accept (`status: 'accepted'`) or decline (`status: 'declined'`) an incoming connection request. |
| `GET` | `/network/connections` | Retrieve user's established mutual connection directory. |
| `DELETE` | `/network/connections/:userId` | Remove an established connection. |

---

## 5. Enterprise Events & Ticketing (`/events`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/events` | List upcoming enterprise events filtered by employee's department and role eligibility. |
| `GET` | `/events/:id` | Retrieve event details, schedule, location/virtual link, and registration status. |
| `POST` | `/events/:id/register` | RSVP register for an event; generates a unique digital ticket code (`OWQ-EVT-XXXXXX`). |
| `GET` | `/events/my-events` | Retrieve all events the employee is registered for with digital ticket passes. |

---

## 6. Read-Only Organization Explorer (`/user`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/user/departments` | View all company departments with member counts and assigned department heads. |
| `GET` | `/user/departments/:id` | View specific department details and active team members. |
| `GET` | `/user/team` | Read-only directory of company colleagues with designation and profile slugs. |
| `GET` | `/user/company` | View official company brand profile, contact info, vision, and products. |

---

## 7. Support & Helpdesk (`/support`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/support/faqs` | Retrieve categorized enterprise FAQs (Card issues, profile approvals, privacy). |
| `POST` | `/support/tickets` | Submit a helpdesk inquiry; generates a support ticket tracking code (`OWQ-TCK-XXXXXX`). |
| `GET` | `/support/tickets/my-tickets` | List all support tickets submitted by the authenticated user with status tracking. |

---

## 8. Admin Control Panel (`/admin`)

*All administrative endpoints enforce RBAC permissions via `requirePermission(...)`.*

### Dashboard & Analytics
- `GET /admin/dashboard`: Executive overview, total members, approval queue count, completion metrics, and department breakdown. (`dashboard.read`)
- `GET /admin/analytics`: Aggregated organization-wide telemetry with range filters (`today`, `7d`, `30d`, `custom`). (`analytics.read`)
- `GET /admin/audit-logs`: Paginated, filterable immutable security audit trail. (`audit_log.read`)

### Smart NFC Cards
- `GET /admin/cards`: Inventory list with search (`cardUid`, `serialNumber`, member name) and filters (`status`, `cardType`). (`card.read`)
- `GET /admin/cards/stats`: Inventory metrics: total cards, linked stock, unassigned count, tap KPIs, and material breakdown. (`card.read`)
- `GET /admin/cards/:id`: Single card details with populated `TeamMember` and `EmployeeProfile`. (`card.read`)
- `POST /admin/cards`: Register new card into inventory (`cardUid`, `serialNumber`, `cardType`, `notes`). (`card.create`)
- `POST /admin/cards/bulk`: Bulk register multiple physical NFC cards into inventory. (`card.create`)
- `POST /admin/cards/link`: **Link Card**: Binds physical card to team member and activates profile link. (`card.link`)
- `POST /admin/cards/unlink`: **Unlink Card**: Detaches card from member and frees it back to inventory as `unassigned`. (`card.unlink`)
- `PATCH /admin/cards/:id/status`: Update status (e.g. mark as `blocked`, `lost`, `active`). (`card.update`)
- `DELETE /admin/cards/:id`: Delete unassigned card from inventory. (`card.delete`)

### Team Members & Departments
- `GET /admin/team`: Paginated team directory with search and filters by department, role, or status. (`team.read`)
- `GET /admin/team/:id`: Retrieve single team member details. (`team.read`)
- `POST /admin/team`: Create new team member directly. (`team.create`)
- `PATCH /admin/team/:id`: Update team member designation, department, role, or status. (`team.update`)
- `DELETE /admin/team/:id`: Soft-delete / archive team member. (`team.delete`)
- `POST /admin/team/:id/restore`: Restore archived team member. (`team.update`)
- `GET /admin/departments`: List all departments with member counts and heads. (`department.read`)
- `POST /admin/departments`: Create department. (`department.create`)
- `PATCH /admin/departments/:id`: Update department info or assigned head. (`department.update`)
- `DELETE /admin/departments/:id`: Archive department (verifies no active members exist). (`department.delete`)

### Roles & Permissions
- `GET /admin/roles`: List all system and custom RBAC roles with assigned permissions. (`role.read`)
- `POST /admin/roles`: Create custom role. (`role.create`)
- `PATCH /admin/roles/:id`: Update role permissions. (`role.update`)
- `DELETE /admin/roles/:id`: Delete custom role (system roles are protected). (`role.delete`)
- `GET /admin/permissions`: List all 48 granular system permissions. (`role.read`)
- `GET /admin/permissions/by-module`: List permissions grouped by domain module. (`role.read`)

### Invitations & Onboarding
- `GET /admin/invitations`: List all invitations with status filters. (`invitation.read`)
- `POST /admin/invitations`: Invite new employee via email. (`invitation.create`)
- `POST /admin/invitations/:id/resend`: Resend invitation email with new token. (`invitation.resend`)
- `POST /admin/invitations/:id/cancel`: Cancel pending invitation. (`invitation.cancel`)
- `GET /invitations/verify?token=...`: Validate onboarding token (Public).
- `POST /invitations/accept`: Accept invitation and create user account (Public).

### Profile Approvals & Templates
- `GET /admin/approvals`: List pending profile change review requests with deep diff previews. (`profile_approval.read`)
- `POST /admin/approvals/:id/review`: Approve (`'approved'`), reject (`'rejected'`), or request changes (`'changes_requested'`). (`profile_approval.approve`)
- `GET /admin/templates`: List profile visual templates. (`template.read`)
- `POST /admin/templates`: Create new profile template. (`template.create`)
- `PATCH /admin/templates/:id`: Update template layout and version snapshot. (`template.update`)
- `POST /admin/templates/:id/duplicate`: Clone existing template. (`template.create`)
- `DELETE /admin/templates/:id`: Archive template. (`template.delete`)

### Enterprise Events Management
- `GET /admin/events`: List all company events with registration counts. (`event.read`)
- `POST /admin/events`: Create enterprise event with department/role eligibility rules. (`event.create`)
- `PATCH /admin/events/:id`: Update event schedule, venue, or eligibility. (`event.update`)
- `DELETE /admin/events/:id`: Cancel / delete event. (`event.delete`)

### Company Profile & Global Settings
- `GET /admin/company-profile`: Retrieve company profile, branding, and dynamic sections. (`company_profile.read`)
- `PATCH /admin/company-profile`: Update company information, branding, and dynamic sections. (`company_profile.update`)
- `GET /admin/settings`: Retrieve organization settings and security policies. (`settings.read`)
- `PATCH /admin/settings`: Update organization security policies and defaults. (`settings.update`)

### Media & Asset Uploads
- `POST /admin/media/upload`: Upload asset (logo, avatar, cover image, PDF) via multipart form (`media.upload`).
- `GET /admin/media`: List uploaded assets with pagination. (`media.read`)
- `DELETE /admin/media/:id`: Delete media asset. (`media.delete`)

---

## 9. Standard Response Envelopes

### Success Response:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Paginated Response:
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [ ... ],
  "pagination": {
    "totalItems": 48,
    "itemsPerPage": 15,
    "totalPages": 4,
    "currentPage": 1,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Response:
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
