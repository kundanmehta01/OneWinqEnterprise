# OneWinq Enterprise Backend

> Production-ready, high-performance Node.js modular monolith backend powering the **OneWinq** digital identity, verified credentials, smart NFC hardware integration, employee networking, and enterprise events platform.

---

## 🌟 Overview

The **OneWinq Backend** provides the foundational services and APIs for the complete enterprise ecosystem:
- **Admin & Executive Management Console** (`/api/v1/admin/*`): Executive dashboard, organization directory, department hierarchy, granular RBAC (48 permissions), smart NFC card inventory stock & linking, template builder, profile change review queue, enterprise events administration, immutable security audit logs, visitor analytics, and global security policies.
- **Employee Portal & User Experience** (`/api/v1/me/*`): Personalized home dashboard (`/me/home`), personal stats, department widgets, upcoming events, draft profile editor, profile review submission, privacy controls, active device session management, and in-app notifications.
- **Professional Networking & Connections** (`/api/v1/network/*`): Colleague discovery feed with real-time connection badges (`none`, `pending_sent`, `pending_received`, `connected`), connection invitation dispatching, and mutual connection directory.
- **Enterprise Events & RSVP Ticketing** (`/api/v1/events/*`): Department and role-scoped upcoming events, RSVP registration, and secure unique digital ticket pass issuance (`OWQ-EVT-XXXXXX`).
- **Smart NFC Card Tap Gateway** (`/api/v1/public/cards/*`): Contactless NFC tap resolver that routes physical cards (`OWQ-NFC-XXXXX`) to verified employee digital profiles with automated tap counting and telemetry ingestion.
- **Public Verified Gateway** (`/api/v1/public/*`): Sanitized 8-section company profile, verified employee digital profiles by vanity slug, dynamic QR code generation (SVG & Data URL), and telemetry tracking.
- **Support & Helpdesk** (`/api/v1/support/*`): Categorized enterprise FAQs and ticket submission with tracking codes (`OWQ-TCK-XXXXXX`).

---

## 🚀 Key Features & Architectural Decisions

- **Modular Monolith**: Strict domain boundaries (`auth`, `users`, `team-members`, `departments`, `roles`, `permissions`, `invitations`, `company-profile`, `employee-profile`, `templates`, `profile-approvals`, `public-profiles`, `cards`, `user-dashboard`, `connections`, `events`, `user-settings`, `user-directory`, `support`, `analytics`, `audit-logs`, `notifications`, `settings`, `dashboard`, `media`).
- **Separation of Identity vs Member vs Profile vs Hardware Card**:
  - `User`: Pure authentication, email, password hashing, failed attempt lockouts, refresh token rotation.
  - `TeamMember`: Organizational identity, employee ID (`OWQ-001`), role, department, completion scores.
  - `EmployeeProfile`: State-separated `published` vs `draft` blocks with field-level deep diff calculation and approval lifecycle.
  - `Card`: Physical smart NFC card hardware inventory with chip UID, serial number, status (`unassigned`, `linked`, `blocked`, `lost`), and real-time tap telemetry.
- **Enterprise-Grade Security**:
  - `Argon2id` / `bcryptjs` password hashing with timing-safe comparisons.
  - Refresh token rotation with **token family reuse detection** (revokes entire token family if token theft or replay is detected).
  - Fine-grained RBAC with reusable `requirePermission(...)` middleware across 48 permissions.
  - Device session termination allowing users to revoke specific or all other active logins.
  - Rate limiting, Helmet security headers, CORS origin whitelisting, sanitized structured logging.
- **Audit Logging & Telemetry**:
  - Automatic event-driven audit logging with sensitive credential redaction (`passwords`, `tokens`).
  - Correlation request ID tracking (`x-request-id`).
  - Privacy-preserving public profile view and NFC tap telemetry.
- **Pluggable Integrations**:
  - `EmailService`: Nodemailer SMTP provider with console/mock fallback.
  - `StorageService`: Cloudinary, Local Disk, and S3 pluggable storage providers.

---

## 📦 Quick Start

### 1. Prerequisites
- Node.js `v20+` or `v24+`
- MongoDB `v6.0+` (or MongoDB Atlas)

### 2. Installation & Setup
```bash
cd server
cp .env.example .env
npm install
```

### 3. Database Seeding
Populate permissions, system roles, departments, organization profile, default card templates, Super Admin, sample employees, enterprise events, and smart NFC cards inventory:
```bash
npm run seed
```

Default Seeded Accounts:
- **Super Admin Account**:
  - **Email**: `superadmin@onewinq.com`
  - **Password**: `OneWinq@Admin2026!`
- **Founder & CEO Account**:
  - **Email**: `rajat@onewinq.in`
  - **Password**: `OneWinq@Admin2026!`
  - **Public Profile**: `http://localhost:5000/api/v1/public/profiles/rajat-chaturvedi`
- **Sample Team Members**:
  - **CTO**: `himanshu.jain@onewinq.in` (Password: `Employee@2026!`)
  - **Head of HR**: `neha.sharma@onewinq.in` (Password: `Employee@2026!`)
  - **Lead Designer**: `amit.verma@onewinq.in` (Password: `Employee@2026!`)

### 4. Running Locally
```bash
# Development mode with hot-reload
npm run dev

# Production start
npm start
```

### 5. Running Verification Test Suite
Execute the automated test suite across all 10 domain feature areas:
```bash
npm test
```

---

## 📚 API Documentation & Interactive Exploration

Once the server is running, explore interactive Swagger / OpenAPI docs at:
- **Swagger UI**: `http://localhost:5000/api-docs`
- **OpenAPI JSON**: `http://localhost:5000/api-docs.json`
- **Health Check**: `http://localhost:5000/api/v1/health`
- **Detailed Markdown API Reference**: See [`API.md`](./API.md)
- **Detailed System Architecture**: See [`ARCHITECTURE.md`](./ARCHITECTURE.md)

---

## 📁 Directory Structure

```text
server/
├── .env.example
├── package.json
├── README.md                           # Quick start and platform overview
├── ARCHITECTURE.md                     # Deep architectural breakdown and diagrams
├── API.md                              # Complete API route and payload reference
├── src/
│   ├── app.js                          # Express app configuration & middleware pipeline
│   ├── server.js                       # Server startup, db connection, and graceful shutdown
│   ├── config/                         # Env, DB, Logger, Swagger configs
│   ├── constants/                      # Permissions, Roles, Error Codes, Events
│   ├── errors/                         # AppError hierarchy (400, 401, 403, 404, 409, 422)
│   ├── events/                         # AppEventBus & event listeners (audit, notify, analytics)
│   ├── integrations/                   # EmailService (SMTP/Mock), StorageService (Disk/S3)
│   ├── middlewares/                    # Auth, RBAC, Validation, RateLimit, ErrorHandler, RequestID
│   ├── modules/                        # Domain modules (model, controller, service, routes, validation)
│   │   ├── auth/                       # JWT authentication & session rotation
│   │   ├── users/                      # User credentials & security status
│   │   ├── team-members/               # Employee records & organizational status
│   │   ├── departments/                # Department hierarchy & heads
│   │   ├── roles/                      # RBAC roles & permissions
│   │   ├── permissions/                # Granular system permissions matrix
│   │   ├── invitations/                # Onboarding invitations & token activation
│   │   ├── cards/                      # Physical & Smart NFC Card service & tap resolver
│   │   ├── user-dashboard/             # Employee home dashboard & widget aggregations
│   │   ├── connections/                # Professional networking & colleague discovery
│   │   ├── events/                     # Enterprise events & RSVP ticketing
│   │   ├── user-settings/              # User privacy matrix & device session management
│   │   ├── user-directory/             # Read-only org explorer for employees
│   │   ├── support/                    # Categorized FAQs & helpdesk tickets
│   │   ├── company-profile/            # 8-section published brand identity
│   │   ├── employee-profile/           # State-isolated profile & draft editor
│   │   ├── templates/                  # Responsive digital card visual layouts
│   │   ├── profile-approvals/          # Profile change review queue & diff calculator
│   │   ├── public-profiles/            # Public vanity slug profiles & QR generation
│   │   ├── analytics/                  # Interaction telemetry & aggregation KPIs
│   │   ├── audit-logs/                 # Immutable security audit trail
│   │   ├── notifications/              # In-app notifications
│   │   ├── settings/                   # Global organization policies
│   │   ├── dashboard/                  # Executive admin dashboard metrics
│   │   └── media/                      # Asset uploads & media management
│   ├── routes/                         # Central API v1 router
│   ├── seeds/                          # Database seed pipeline
│   └── utils/                          # API response, hashing, token, diff, QR code, pagination
└── tests/                              # Automated integration tests
```

---

## 📄 License
UNLICENSED — Proprietary OneWinq Enterprise Software.
