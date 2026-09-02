# OneWinq Enterprise Backend

> Production-ready, high-performance Node.js modular monolith backend powering the **OneWinq** digital identity, verified credentials, and team management platform.

---

## 🌟 Overview

The **OneWinq Backend** provides the foundational services and APIs for the entire OneWinq ecosystem:
- **Admin / Management Experience** (`/api/v1/admin/*`): Organization dashboard, team members, departments, granular RBAC, templates, profile approvals, audit logs, analytics, and global settings.
- **Employee Portal Experience** (`/api/v1/me/*`): Self-service profile management, experience/skills/projects editing, state-isolated draft workflow, review submission, and in-app notifications.
- **Public Profiles Gateway** (`/api/v1/public/*`): Sanitized public company profiles, public employee profiles by slug/username, dynamic QR code generation, and telemetry interaction tracking.

---

## 🚀 Key Features & Architectural Decisions

- **Modular Monolith**: Strict domain boundaries (`auth`, `users`, `team-members`, `departments`, `roles`, `permissions`, `invitations`, `company-profile`, `employee-profile`, `templates`, `profile-approvals`, `public-profiles`, `analytics`, `audit-logs`, `notifications`, `settings`, `dashboard`, `media`).
- **Separation of Identity vs Employee vs Profile**:
  - `User`: Pure authentication, email, password hashing, failed attempt lockouts, refresh token rotation.
  - `TeamMember`: Organizational identity, employee ID, role, department, completion scores.
  - `EmployeeProfile`: State-separated `published` vs `draft` blocks with field-level diff calculation and approval lifecycle.
- **Enterprise-Grade Security**:
  - `Argon2id` / `bcryptjs` password hashing with timing-safe comparisons.
  - Refresh token rotation with **token family reuse detection** (revokes entire token family if token theft or replay is detected).
  - Fine-grained RBAC with reusable `requirePermission(...)` middleware.
  - Rate limiting, Helmet security headers, CORS origin whitelisting, sanitized structured logging.
- **Audit Logging & Telemetry**:
  - Automatic event-driven audit logging with sensitive credential redaction (`passwords`, `tokens`).
  - Correlation request ID tracking (`x-request-id`).
  - Privacy-preserving public profile view telemetry.
- **Pluggable Integrations**:
  - `EmailService`: Nodemailer SMTP provider with console/mock fallback.
  - `StorageService`: Local disk provider with S3/Cloudflare R2 interface abstraction.

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
Populate permissions, system roles, OneWinq organization settings, default templates, Super Admin, and sample active employees:
```bash
npm run seed
```

Default Super Admin credentials seeded:
- **Email**: `superadmin@onewinq.com`
- **Password**: `OneWinq@Admin2026!`

Sample Employee credentials seeded:
- **Email**: `priya.patel@onewinq.com` / `alex.morgan@onewinq.com`
- **Password**: `Employee@2026!`

### 4. Running Locally
```bash
# Development mode with hot-reload
npm run dev

# Production start
npm start
```

### 5. Running Test Suite
Execute the comprehensive automated test suite (runs on an in-memory MongoDB instance):
```bash
npm test
```

---

## 📚 API Documentation

Once the server is running, explore interactive Swagger / OpenAPI docs at:
- **Swagger UI**: `http://localhost:5000/api-docs`
- **OpenAPI JSON**: `http://localhost:5000/api-docs.json`
- **Health Check**: `http://localhost:5000/api/v1/health`

---

## 📁 Directory Structure

```text
server/
├── .env.example
├── package.json
├── README.md
├── ARCHITECTURE.md
├── API.md
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
│   │   ├── auth/
│   │   ├── users/
│   │   ├── team-members/
│   │   ├── departments/
│   │   ├── roles/
│   │   ├── permissions/
│   │   ├── invitations/
│   │   ├── company-profile/
│   │   ├── employee-profile/
│   │   ├── templates/
│   │   ├── profile-approvals/
│   │   ├── public-profiles/
│   │   ├── analytics/
│   │   ├── audit-logs/
│   │   ├── notifications/
│   │   ├── settings/
│   │   ├── dashboard/
│   │   └── media/
│   ├── routes/                         # Central API v1 router
│   ├── seeds/                          # Database seed scripts
│   └── utils/                          # API response, hashing, token, diff, QR code, pagination
└── tests/                              # Automated integration tests
```

---

## 📄 License
UNLICENSED — Proprietary OneWinq Enterprise Software.
