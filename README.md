# OneWinq Enterprise

OneWinq Enterprise is a React + Vite frontend for the enterprise admin experience, connected to the existing backend APIs under `/api/v1/admin` and `/api/v1/public`.

## Overview

This client implements the production-facing admin modules for analytics, profile approvals, roles and permissions, team members, departments, media gallery, company profile, and dashboard summary views. The frontend is intentionally aligned with the backend contracts already exposed by the server so that pages fetch real data, render real status states, and provide the expected create/edit/delete actions.

## Included frontend modules

- Analytics dashboard with KPI cards, profile-view charts, preset/custom date ranges, and loading/error/empty states
- Team members management with select-all/individual selection, view/edit/delete flows, delete confirmation, and refresh-after-delete
- Department management with delete confirmation and refresh-after-delete behavior
- Profile approval review actions mapped to `approve`, `reject`, and `request_changes` backend actions with status-safe UI
- QR code access for employee/public profiles
- Roles and permissions management with backend-driven role selection, module-grouped permission checkboxes, and role updates
- Media management dashboard at `/admin/media` with backend-backed upload, filtering, preview, and delete operations. It uses `POST /api/v1/admin/media/upload`, `GET /api/v1/admin/media`, and `DELETE /api/v1/admin/media/:id`; media editing is intentionally not exposed because the backend has no edit endpoint.
- Enterprise company profile dashboard at `/admin/company-profile`, split into reusable header, statistics, tabs, section cards, and overview/about/services/team/projects/achievements/media/contact sections. It uses `GET/PATCH /api/v1/admin/company-profile`, team data, analytics KPIs, and the media list.
- Dashboard profile completion overview using backend completion scores and approval states instead of static 100% values
- Company Profile now uses a data-driven identity visual layer with replaceable logo, cover, office, product, team, project, achievement, and media image sources plus smooth-scroll section navigation.
- Approval review comparison showing backend-provided current profile data against the submitted draft before approve/request-changes/reject actions.
- Permission management matrix grouped by backend modules with View, Create, Edit, and Delete checkboxes per selected role.

## Local development

1. Install frontend dependencies:
   npm install
2. Start the dev server:
   npm run dev
3. Build for production:
   npm run build

## Project structure

- `client/src/pages/admin` – admin screens and module pages
- `client/src/components` – reusable UI and form pieces
- `client/src/services` – API layer and backend integration helpers
- `server` – backend modules and API contract source used to align the frontend implementation

## Notes

- The app uses the existing backend APIs and does not rely on placeholder or static data where real API values are available.
- UI updates follow the server-side status and permission semantics already exposed by the backend.
- The backend currently exposes member and department `DELETE` routes through soft-archive service behavior; the frontend presents these actions as Delete and refreshes the list after success.
- Analytics traffic-source and device breakdowns are shown as unavailable when the backend response does not provide those dimensions; no fabricated values are rendered.
- The codebase is kept modular to support additional admin features without duplicating data or logic.
- Company profile dynamic sections are rendered only when supplied by the backend; unavailable projects, achievements, and media show explicit empty states instead of fabricated content.
