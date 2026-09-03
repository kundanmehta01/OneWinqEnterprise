# OneWinq Enterprise — Frontend Client

> React-based admin dashboard and employee portal for the OneWinq Digital Identity & People Platform.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Authentication & Admin Access](#authentication--admin-access)
- [API Endpoints Reference](#api-endpoints-reference)
- [Admin Modules](#admin-modules)
- [Environment & Configuration](#environment--configuration)
- [Available Scripts](#available-scripts)
- [Coding Standards](#coding-standards)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Bundler | Vite 6 |
| Routing | React Router DOM v6 |
| Styling | Tailwind CSS v3 |
| Icons | Lucide React |
| Charts | Recharts |
| HTTP Client | Axios (via `services/api.js`) |
| State | React Context + Custom Hooks |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- Backend server running on `http://localhost:5000`
- MongoDB running on `mongodb://localhost:27017/onewinq_db`

### Installation

```bash
cd client
npm install
```

### Database Seeding (Run Once)

The backend database must be seeded before the frontend can log in.

```bash
cd server
npm run seed
```

This seeds: **Permissions -> Roles -> Departments -> Templates -> Company Profile -> Super Admin**.

### Start Development Server

```bash
cd client
npm run dev
```

Frontend runs on **`http://localhost:3000`** (proxied to backend at `http://localhost:5000`).

---

## Project Structure

```
client/src/
├── app/
│   ├── providers/          # AuthProvider, context setup
│   └── router/             # Route definitions
├── components/
│   ├── admin/              # AdminLayout, Header, Sidebar
│   ├── analytics/          # AnalyticsKpiCards, Charts, TrafficSourceCard
│   ├── approvals/          # ProfileApprovalTable, ReviewModal
│   ├── audit-logs/         # AuditLogTable, Filters
│   ├── common/             # StatCard, Pagination, Modal, EmptyState
│   ├── company-profile/    # CompanyProfileForm
│   ├── dashboard/          # DashboardStats, ProfileCompletionDonut
│   ├── departments/        # DepartmentsTable, DepartmentStats
│   ├── invitations/        # InvitationsTable, InviteModal
│   ├── media/              # MediaGrid, UploadZone
│   ├── notifications/      # NotificationsList
│   ├── permissions/        # PermissionMatrixPane
│   ├── roles/              # RolesTable, RolesStats
│   ├── settings/           # SettingsForm
│   ├── team-members/       # TeamMembersTable, Filters, Stats
│   └── templates/          # TemplatesTable, TemplatesStats
├── constants/
│   └── navigation.js       # Sidebar navigation config (all 15 modules)
├── hooks/                  # useAnalytics, useDashboard, useMembers, etc.
├── pages/
│   ├── admin/              # One page per admin module
│   └── auth/               # LoginPage
├── services/
│   ├── api.js              # Axios instance with auth interceptors
│   ├── authService.js
│   ├── analyticsService.js
│   ├── departmentService.js
│   ├── invitationService.js
│   ├── mediaService.js
│   ├── roleService.js
│   ├── settingsService.js
│   ├── teamMemberService.js
│   └── templateService.js
└── utils/
    ├── storage.js          # localStorage token helpers
    └── formatNumber.js
```

---

## Authentication & Admin Access

### How Authentication Works

1. Frontend sends `POST /api/v1/auth/login` with `{ email, password }`.
2. Backend returns `{ accessToken, refreshToken, user, member }`.
3. Tokens are stored in `localStorage` via `utils/storage.js`.
4. All requests send `Authorization: Bearer <accessToken>` header (auto-attached in `services/api.js`).
5. On 401, interceptor attempts token refresh via `POST /api/v1/auth/refresh`.

### Dev Auto-Login

In development, `AuthProvider.jsx` automatically logs in using seeded Super Admin credentials if no session exists — so the dashboard opens immediately without manual login.

### Super Admin Credentials (Seeded)

| Field | Value |
|---|---|
| Email | `superadmin@onewinq.com` |
| Password | `OneWinq@Admin2026!` |
| Role | Super Admin (all permissions) |

A **Quick Fill** button is available on the Login page for easy access during testing.

### Role-Based Access

| Role | Description |
|---|---|
| **Super Admin** | Full unrestricted access to all modules |
| **Admin** | Comprehensive organization management |
| **HR Admin** | Team members, invitations |
| **Content Admin** | Templates, company profile, profile reviews |
| **Employee** | Personal profile management only |

---

## API Endpoints Reference

> Base URL: `http://localhost:5000/api/v1`
> All admin endpoints require `Authorization: Bearer <token>` header.
> In dev mode, CORS allows all origins.

### Authentication — All Tested OK

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/login` | Login with email + password |
| `GET` | `/auth/me` | Get current authenticated user |
| `POST` | `/auth/refresh` | Rotate access token with refresh token |
| `POST` | `/auth/logout` | Revoke current session |
| `POST` | `/auth/forgot-password` | Send password reset email |
| `POST` | `/auth/reset-password` | Reset password with token |

**Login Request Body:**
```json
{
  "email": "superadmin@onewinq.com",
  "password": "OneWinq@Admin2026!"
}
```

**Login Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "user": { "_id": "...", "email": "superadmin@onewinq.com" },
    "member": { "name": "Super Administrator", "roleId": {} }
  }
}
```

---

### Admin Dashboard — TESTED OK

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/dashboard` | Full dashboard overview with KPIs |

Response includes: `overview.totalMembers`, `overview.activeMembers`, `overview.pendingInvites`, `overview.totalDepartments`, `overview.pendingApprovalsCount`, `overview.averageProfileCompletion`, `analytics`, `analyticsTrends`, `topProfiles`, `departmentBreakdown`, `recentPendingApprovals`, `recentActivity`

---

### Team Members — TESTED OK

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/team` | List all team members (paginated) |
| `GET` | `/admin/team?page=1&limit=10` | Paginated |
| `GET` | `/admin/team?status=active` | Filter by status |
| `GET` | `/admin/team?search=john` | Search by name |
| `GET` | `/admin/team?departmentId=<id>` | Filter by department |
| `GET` | `/admin/team?roleId=<id>` | Filter by role |
| `GET` | `/admin/team/:id` | Get single member |
| `PATCH` | `/admin/team/:id` | Update member |
| `DELETE` | `/admin/team/:id` | Archive member |

---

### Departments — TESTED OK

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/departments` | List all departments |
| `POST` | `/admin/departments` | Create department |
| `GET` | `/admin/departments/:id` | Get department |
| `PATCH` | `/admin/departments/:id` | Update department |
| `DELETE` | `/admin/departments/:id` | Delete department |

---

### Roles — TESTED OK

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/roles` | List all roles with permissions |
| `POST` | `/admin/roles` | Create custom role |
| `GET` | `/admin/roles/:id` | Get role details |
| `PATCH` | `/admin/roles/:id` | Update role |
| `DELETE` | `/admin/roles/:id` | Delete custom role |

---

### Permissions — TESTED OK

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/permissions` | List all 36 permissions |
| `GET` | `/admin/permissions/by-module` | Permissions grouped by module |

---

### Invitations — TESTED OK

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/invitations` | List all invitations |
| `POST` | `/admin/invitations` | Send invitation |
| `GET` | `/admin/invitations/:id` | Get invitation details |
| `POST` | `/admin/invitations/:id/resend` | Resend invitation |
| `DELETE` | `/admin/invitations/:id` | Cancel invitation |

---

### Company Profile — TESTED OK

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/company-profile` | Get company profile |
| `PATCH` | `/admin/company-profile` | Update company profile |

---

### Templates — TESTED OK

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/templates` | List all profile templates |
| `POST` | `/admin/templates` | Create new template |
| `GET` | `/admin/templates/:id` | Get template details |
| `PATCH` | `/admin/templates/:id` | Update template |
| `DELETE` | `/admin/templates/:id` | Archive template |
| `POST` | `/admin/templates/:id/duplicate` | Duplicate template |

---

### Profile Approvals — TESTED OK

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/approvals` | List pending profile approvals |
| `POST` | `/admin/approvals/:id/review` | Approve or reject a profile |

---

### Analytics — TESTED OK (All Ranges)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/analytics` | Analytics — default (7d) |
| `GET` | `/admin/analytics?range=today` | Today |
| `GET` | `/admin/analytics?range=7d` | Last 7 days |
| `GET` | `/admin/analytics?range=30d` | Last 30 days |
| `GET` | `/admin/analytics?range=custom&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` | Custom range |

Response KPIs: `kpis.totalViews`, `kpis.totalShares`, `kpis.totalQrScans`, `kpis.totalLinkClicks`, `kpis.totalContactClicks`, `trends[]`, `topViewedProfiles[]`, `templateUsage[]`

---

### Audit Logs — TESTED OK

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/audit-logs` | List audit logs |
| `GET` | `/admin/audit-logs?page=1&limit=20` | Paginated audit logs |

---

### Organization Settings — TESTED OK

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/settings` | Get organization settings |
| `PATCH` | `/admin/settings` | Update settings |

---

### Media Library — TESTED OK

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/media` | List all media assets |
| `GET` | `/admin/media?type=image` | Filter by type |
| `POST` | `/admin/media/upload` | Upload file (multipart/form-data) |
| `DELETE` | `/admin/media/:id` | Delete media asset |

---

### Employee (Self) Routes — TESTED OK

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/me/profile` | Get own employee profile |
| `PATCH` | `/me/profile` | Update own profile |
| `GET` | `/me/notifications` | Get own notifications |
| `PATCH` | `/me/notifications/:id/read` | Mark notification as read |

---

### Public Routes (No Auth Required)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/public/p/:slug` | View public employee profile |
| `GET` | `/public/company/:slug` | View public company profile |
| `GET` | `/invitations/verify/:token` | Verify invitation token |
| `POST` | `/invitations/accept` | Accept invitation & register |

---

### Routes NOT in Backend (Important)

| ❌ Attempted | ✅ Actual Route | Reason |
|---|---|---|
| `/admin/notifications` | `/me/notifications` | Notifications are employee-scoped |
| `/admin/employee-profiles` | `/me/profile` | Profiles accessed per member |

---

## Admin Modules

All 15 modules are accessible from the fixed left sidebar:

| # | Module | Page Route | API Endpoint |
|---|---|---|---|
| 1 | Dashboard | `/admin/dashboard` | `GET /admin/dashboard` |
| 2 | Company Profile | `/admin/company-profile` | `GET/PATCH /admin/company-profile` |
| 3 | Team Members | `/admin/team-members` | `GET /admin/team` |
| 4 | Departments | `/admin/departments` | `GET /admin/departments` |
| 5 | Roles | `/admin/roles` | `GET /admin/roles` |
| 6 | Permissions | `/admin/permissions` | `GET /admin/permissions` |
| 7 | Invitations | `/admin/invitations` | `GET /admin/invitations` |
| 8 | Media Library | `/admin/media` | `GET /admin/media` |
| 9 | Employee Profiles | `/admin/employee-profiles` | `GET /me/profile` |
| 10 | Templates | `/admin/templates` | `GET /admin/templates` |
| 11 | Profile Approvals | `/admin/profile-approvals` | `GET /admin/approvals` |
| 12 | Analytics | `/admin/analytics` | `GET /admin/analytics` |
| 13 | Audit Logs | `/admin/audit-logs` | `GET /admin/audit-logs` |
| 14 | Notifications | `/admin/notifications` | `GET /me/notifications` |
| 15 | General Settings | `/admin/settings` | `GET /admin/settings` |

---

## Environment & Configuration

### Vite Config (`vite.config.js`)

```js
server: {
  port: 3000,   // Must match backend FRONTEND_URL = http://localhost:3000
  proxy: {
    '/api': { target: 'http://localhost:5000', changeOrigin: true },
    '/uploads': { target: 'http://localhost:5000', changeOrigin: true }
  }
}
```

### API Base URL

In `services/api.js`:
```js
baseURL: '/api/v1'   // proxied -> http://localhost:5000/api/v1
```

### Backend CORS Policy

The backend allows these origins (do NOT change server code):
- `http://localhost:3000` (primary — frontend must run here)
- `http://localhost:5173` (also allowed)
- All origins in `development` mode

---

## Available Scripts

```bash
npm run dev       # Start dev server on port 3000
npm run build     # Build for production
npm run preview   # Preview production build locally
```

---

## Postman Quick Setup

1. Create environment variable: `BASE_URL = http://localhost:5000/api/v1`
2. Create login request:
   - Method: `POST`
   - URL: `{{BASE_URL}}/auth/login`
   - Body (JSON): `{ "email": "superadmin@onewinq.com", "password": "OneWinq@Admin2026!" }`
3. In the **Tests** tab of login request, add:
   ```js
   pm.environment.set("TOKEN", pm.response.json().data.accessToken);
   ```
4. For all admin requests, add header:
   - Key: `Authorization`
   - Value: `Bearer {{TOKEN}}`

---

## Coding Standards

- **No fake data**: All data must come from live backend APIs. No hardcoded placeholders.
- **Loading states**: Use `loading` boolean from hooks to show spinners.
- **Empty states**: Use `<EmptyState>` when API returns empty arrays.
- **Error handling**: Display API error messages to the user.
- **Reuse components**: Use `StatCard`, `Pagination`, `Modal`, `EmptyState` from `components/common/`.
- **No server changes**: `server/` folder is immutable. Treat backend as source of truth.
- **Branch**: All frontend work stays on `feature/frontend-modules`.

---

*OneWinq Enterprise — Frontend Client — Branch: `feature/frontend-modules`*
