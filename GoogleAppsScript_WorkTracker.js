/**
 * =========================================================================
 * OneWinq Enterprise - Google Sheets Work Tracker Generator
 * =========================================================================
 * 
 * HOW TO USE IN 3 EASY STEPS:
 * 1. Open Google Sheets (https://sheets.new) in your browser.
 * 2. Go to: Extensions > Apps Script
 * 3. Replace any existing code with this script, click 'Save' (Ctrl+S), and click 'Run'.
 *    (Accept permissions if prompted).
 * 
 * DYNAMIC ROW INSERTION:
 * Whenever you add a new row inside BACKEND (e.g. right-click on any row in Backend
 * -> 'Insert 1 row above/below'), FRONTEND automatically shifts down dynamically!
 * All dropdowns, styling, and conditional formatting automatically apply!
 * =========================================================================
 */

function generateWorkTracker() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Work Tracker');
  
  if (!sheet) {
    sheet = ss.insertSheet('Work Tracker');
  } else {
    sheet.clear();
    sheet.clearConditionalFormatRules();
  }

  // Set Sheet as Active
  ss.setActiveSheet(sheet);

  // =========================================================
  // 1. SECTION 1: BACKEND (Row 1)
  // =========================================================
  sheet.getRange('A1:H1').merge();
  const bTitle = sheet.getRange('A1');
  bTitle.setValue('BACKEND');
  bTitle.setFontFamily('Segoe UI');
  bTitle.setFontSize(13);
  bTitle.setFontWeight('bold');
  bTitle.setFontColor('#0F172A');
  bTitle.setHorizontalAlignment('center');
  bTitle.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 36);

  // 2. Column Headers for Backend (Row 2)
  const headers = [
    'Date',
    'Module / Feature',
    'Task / Work Description',
    'Status',
    'Priority',
    'Issues / Blockers',
    'Next Step',
    'Remarks'
  ];
  sheet.getRange(2, 1, 1, headers.length).setValues([headers]);
  
  const bHeaderRange = sheet.getRange('A2:H2');
  bHeaderRange.setFontFamily('Segoe UI');
  bHeaderRange.setFontSize(10);
  bHeaderRange.setFontWeight('bold');
  bHeaderRange.setFontColor('#0F172A');
  bHeaderRange.setVerticalAlignment('middle');
  sheet.setRowHeight(2, 30);
  sheet.getRange('A2').setHorizontalAlignment('center');
  sheet.getRange('D2:E2').setHorizontalAlignment('center');

  // 3. Completed Backend Tasks Data (30 entries)
  const backendTasksData = [
    [
      '01-09-2026',
      'Authentication & Security',
      'Implemented Argon2id password hashing, user registration, and credential validation pipeline with failed login lockout.',
      'Completed',
      'High',
      'None',
      'Maintain session rotation & security audits',
      'Implemented in server/src/modules/auth with Argon2id + Winston logging'
    ],
    [
      '01-09-2026',
      'Token Family & Session Rotation',
      'Built JWT token family rotation, multi-device refresh token management, and instant device revocation on compromise.',
      'Completed',
      'High',
      'None',
      'Monitor token expiration telemetry',
      'Implemented in auth.service.js with automatic family invalidation'
    ],
    [
      '02-09-2026',
      'Password Reset & Recovery',
      'Developed cryptographically secure password reset token generation, email dispatch payload, and password update verification.',
      'Completed',
      'Medium',
      'None',
      'Connect production email SMTP credentials',
      'Implemented in auth.routes.js and auth.service.js'
    ],
    [
      '02-09-2026',
      'Granular RBAC Authorization',
      'Engineered system permission registry with 48 granular permissions across 16 domain modules with role-permission check middleware.',
      'Completed',
      'High',
      'None',
      'Add custom role builder frontend integration',
      'Defined in permissions.constants.js & role.service.js'
    ],
    [
      '03-09-2026',
      'Roles & Permissions Management',
      'Implemented custom role creation, role-based access control (RBAC) assignment, and system role protection rules.',
      'Completed',
      'High',
      'None',
      'Validate default system roles in staging',
      'Implemented in server/src/modules/roles and permissions'
    ],
    [
      '03-09-2026',
      'Team Directory & Workforce CRUD',
      'Built paginated employee directory, automated employee ID generator (OWQ-XXX), role/department links, and soft deletion/restoration.',
      'Completed',
      'High',
      'None',
      'Review bulk import capabilities',
      'Implemented in server/src/modules/team-members'
    ],
    [
      '04-09-2026',
      'Department Hierarchy & Head Assignment',
      'Engineered department CRUD operations with hierarchical parent-child relationships, department heads, and workforce count rollup.',
      'Completed',
      'Medium',
      'None',
      'Link department analytics breakdown',
      'Implemented in server/src/modules/departments'
    ],
    [
      '04-09-2026',
      'Enterprise Invitations Gateway',
      'Implemented cryptographic invitation token generator, token verification endpoint, bulk invite dispatch, and onboarding assignment.',
      'Completed',
      'High',
      'None',
      'Verify invite expiration and resend flow',
      'Implemented in server/src/modules/invitations'
    ],
    [
      '05-09-2026',
      'Smart NFC Card Inventory',
      'Built physical smart NFC card stock management tracking 6 materials (Matte PVC, Metal, Wood, Stainless) and status states.',
      'Completed',
      'High',
      'None',
      'Connect hardware laser UID batch importer',
      'Implemented in server/src/modules/cards/card.service.js'
    ],
    [
      '05-09-2026',
      'NFC Card Binding & Lifecycle',
      'Developed one-click binding and unlinking of smart NFC cards to employee profiles with audit logging and card lost/blocked flags.',
      'Completed',
      'High',
      'None',
      'Test re-binding workflows',
      'Implemented in card.controller.js and card.service.js'
    ],
    [
      '06-09-2026',
      'Contactless NFC Tap Resolver Gateway',
      'Built ultra-fast public NFC tap resolver (/api/v1/public/cards/:cardUid) with tap telemetry counter & real-time redirect to live profile.',
      'Completed',
      'High',
      'None',
      'Monitor tap telemetry performance',
      'Implemented in publicProfile.routes.js and card.service.js'
    ],
    [
      '06-09-2026',
      'Profile State Isolation & Deep Diff',
      'Designed state-isolated draft vs published profile architecture with automated deep JSON diff calculator for profile changes.',
      'Completed',
      'High',
      'None',
      'Verify edge case diff formatting',
      'Implemented in employeeProfile.service.js and diff.utils.js'
    ],
    [
      '07-09-2026',
      'Profile Approval Moderation Queue',
      'Built admin approval queue with side-by-side visual diff comparison, approve/reject with feedback, and auto-publishing.',
      'Completed',
      'High',
      'None',
      'Connect real-time in-app notification triggers',
      'Implemented in server/src/modules/profile-approvals'
    ],
    [
      '07-09-2026',
      'Public Verified Profiles Gateway',
      'Created public verified employee profile endpoint by vanity slug (/p/:slug) with privacy filtering and SEO metadata.',
      'Completed',
      'High',
      'None',
      'Add CDN edge caching headers',
      'Implemented in server/src/modules/public-profiles'
    ],
    [
      '08-09-2026',
      'Dynamic QR Code Generator Engine',
      'Implemented dynamic vector SVG and high-res Data URL QR code generator for profile sharing, vCard contact downloads, and card mapping.',
      'Completed',
      'Medium',
      'None',
      'Support customized branded QR centers',
      'Implemented in utils/qrGenerator.js and public profiles'
    ],
    [
      '08-09-2026',
      'Digital Card Template Builder',
      'Engineered digital card layout template engine (Classic, Modern, Minimal, Executive, Founder) with theme color palettes and field visibility.',
      'Completed',
      'Medium',
      'None',
      'Add custom CSS theme variable injection',
      'Implemented in server/src/modules/templates'
    ],
    [
      '08-09-2026',
      '8-Section Company Profile Gateway',
      'Built 8-section enterprise company profile API (Hero, About, Vision, Values, Services, Team, Gallery, Contact) for corporate branding.',
      'Completed',
      'Medium',
      'None',
      'Connect client public landing page',
      'Implemented in server/src/modules/company-profile'
    ],
    [
      '09-09-2026',
      'Personalized Employee Home Dashboard',
      'Built /me/home and /me/dashboard aggregating verified profile score, KPI cards, upcoming events, and active department stream.',
      'Completed',
      'High',
      'None',
      'Add weekly engagement summary rollup',
      'Implemented in server/src/modules/user-dashboard'
    ],
    [
      '09-09-2026',
      'Employee Privacy Matrix & Sessions',
      'Implemented user privacy matrix toggles (public/internal phone, email, experience) and active device session inspection/remote termination.',
      'Completed',
      'High',
      'None',
      'Review session timeout policies',
      'Implemented in server/src/modules/user-settings'
    ],
    [
      '09-09-2026',
      'Colleague Networking & Connection Lifecycle',
      'Built colleague discovery feed with connection badges (none, pending_sent, pending_received, connected) and request lifecycle handlers.',
      'Completed',
      'Medium',
      'None',
      'Add mutual connections suggestion algorithm',
      'Implemented in server/src/modules/connections'
    ],
    [
      '10-09-2026',
      'Enterprise Events & RSVP Ticketing',
      'Engineered department/role-scoped event feed, RSVP booking, and cryptographically secure digital ticket pass generator (OWQ-EVT-XXXXXX).',
      'Completed',
      'High',
      'None',
      'Add QR ticket scanner endpoint for event check-in',
      'Implemented in server/src/modules/events'
    ],
    [
      '10-09-2026',
      'Employee Organization Explorer',
      'Developed searchable organization colleague directory for employees with department/designation filters and direct contact links.',
      'Completed',
      'Medium',
      'None',
      'Add quick connection action buttons',
      'Implemented in server/src/modules/user-directory'
    ],
    [
      '10-09-2026',
      'Enterprise Helpdesk & Support Ticketing',
      'Built categorized enterprise FAQ knowledge base, support ticket creation, priority grading, and ticket status lifecycle.',
      'Completed',
      'Medium',
      'None',
      'Connect admin ticket resolution responses',
      'Implemented in server/src/modules/support'
    ],
    [
      '10-09-2026',
      'Visitor Telemetry & Analytics Engine',
      'Built real-time telemetry tracking for NFC card taps, QR scans, profile views, device/browser categorization, and time-series aggregation.',
      'Completed',
      'High',
      'None',
      'Connect admin analytics charting widgets',
      'Implemented in server/src/modules/analytics'
    ],
    [
      '10-09-2026',
      'Immutable Security Audit Trail',
      'Engineered automatic audit trail logging actor, target, action, diff changes, IP address, and user agent for compliance.',
      'Completed',
      'High',
      'None',
      'Add CSV / JSON audit export endpoint',
      'Implemented in server/src/modules/audit-logs'
    ],
    [
      '10-09-2026',
      'In-App Notification Engine',
      'Developed event-driven notifications for profile approvals, invitations, connections, and events with unread count tracking.',
      'Completed',
      'Medium',
      'None',
      'Integrate WebSocket / SSE real-time stream',
      'Implemented in server/src/modules/notifications'
    ],
    [
      '10-09-2026',
      'Media Upload & Storage Provider Integration',
      'Built multipart upload pipeline with local disk and cloud storage adapters (Cloudinary/S3) for avatars, covers, and company logos.',
      'Completed',
      'Medium',
      'None',
      'Add image optimization and thumbnail generator',
      'Implemented in server/src/modules/media'
    ],
    [
      '10-09-2026',
      'Organization Security & Platform Settings',
      'Implemented global platform configuration: password strength policies, session timeouts, and approval enforcement toggles.',
      'Completed',
      'Medium',
      'None',
      'Add 2FA enforcement policy toggle',
      'Implemented in server/src/modules/settings'
    ],
    [
      '10-09-2026',
      'Database Schema Architecture & Seed Pipeline',
      'Created 22 optimized Mongoose domain schemas with compound indexes, plus complete automated DB seed pipeline (Super Admin, Team, Cards).',
      'Completed',
      'High',
      'None',
      'Run seed verification in staging environment',
      'Implemented in server/src/seeds & models'
    ],
    [
      '10-09-2026',
      'Security & Request Middleware Pipeline',
      'Built Helmet security headers, CORS origin whitelisting, global/auth rate limiters, request correlation IDs, and centralized AppError handler.',
      'Completed',
      'High',
      'None',
      'Monitor rate limit hits in production',
      'Implemented in server/src/middlewares & app.js'
    ]
  ];

  const bStartRow = 3;
  const bNumRows = backendTasksData.length;
  const bDataRange = sheet.getRange(bStartRow, 1, bNumRows, 8);
  bDataRange.setValues(backendTasksData);

  bDataRange.setFontFamily('Segoe UI');
  bDataRange.setFontSize(10);
  bDataRange.setFontColor('#1E293B');
  bDataRange.setVerticalAlignment('middle');
  bDataRange.setWrap(true);

  sheet.getRange(bStartRow, 1, bNumRows, 1).setHorizontalAlignment('center');
  sheet.getRange(bStartRow, 2, bNumRows, 1).setFontWeight('bold');
  sheet.getRange(bStartRow, 4, bNumRows, 2).setHorizontalAlignment('center').setFontWeight('bold');

  for (let r = bStartRow; r < bStartRow + bNumRows; r++) {
    sheet.setRowHeight(r, 26);
  }

  // =========================================================
  // 4. SECTION 2: FRONTEND (Positioned Below Backend)
  // =========================================================
  const sepRow = bStartRow + bNumRows; // Row 33
  sheet.setRowHeight(sepRow, 14);

  const fHeaderRow = sepRow + 1; // Row 34
  sheet.getRange(`A${fHeaderRow}:H${fHeaderRow}`).merge();
  const fTitle = sheet.getRange(`A${fHeaderRow}`);
  fTitle.setValue('FRONTEND');
  fTitle.setFontFamily('Segoe UI');
  fTitle.setFontSize(13);
  fTitle.setFontWeight('bold');
  fTitle.setFontColor('#0F172A');
  fTitle.setHorizontalAlignment('center');
  fTitle.setVerticalAlignment('middle');
  sheet.setRowHeight(fHeaderRow, 36);

  const fColHeaderRow = fHeaderRow + 1; // Row 35
  sheet.getRange(fColHeaderRow, 1, 1, headers.length).setValues([headers]);
  const fHeaderRange = sheet.getRange(`A${fColHeaderRow}:H${fColHeaderRow}`);
  fHeaderRange.setFontFamily('Segoe UI');
  fHeaderRange.setFontSize(10);
  fHeaderRange.setFontWeight('bold');
  fHeaderRange.setFontColor('#0F172A');
  fHeaderRange.setVerticalAlignment('middle');
  sheet.setRowHeight(fColHeaderRow, 30);
  sheet.getRange(`A${fColHeaderRow}`).setHorizontalAlignment('center');
  sheet.getRange(`D${fColHeaderRow}:E${fColHeaderRow}`).setHorizontalAlignment('center');

  // Initial 5 empty rows ready for Frontend entry
  const fDataStartRow = fColHeaderRow + 1; // Row 36
  for (let r = fDataStartRow; r < fDataStartRow + 5; r++) {
    sheet.setRowHeight(r, 26);
    const rowRange = sheet.getRange(r, 1, 1, 8);
    rowRange.setFontFamily('Segoe UI');
    rowRange.setFontSize(10);
    rowRange.setFontColor('#1E293B');
    rowRange.setVerticalAlignment('middle');
    rowRange.setWrap(true);
    sheet.getRange(r, 1).setHorizontalAlignment('center');
    sheet.getRange(r, 4, 1, 2).setHorizontalAlignment('center').setFontWeight('bold');
  }

  // 5. Freeze Top Header (Row 2)
  sheet.setFrozenRows(2);

  // 6. Optimal Column Widths
  sheet.setColumnWidth(1, 110); // Date
  sheet.setColumnWidth(2, 240); // Module / Feature
  sheet.setColumnWidth(3, 420); // Task / Work Description
  sheet.setColumnWidth(4, 130); // Status
  sheet.setColumnWidth(5, 110); // Priority
  sheet.setColumnWidth(6, 180); // Issues / Blockers
  sheet.setColumnWidth(7, 300); // Next Step
  sheet.setColumnWidth(8, 360); // Remarks

  // 7. Universal Data Validation Dropdowns (Rows 3 to 2000)
  // Status Dropdown
  const statusList = ['Not Started', 'In Progress', 'Completed', 'Blocked', 'On Hold'];
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(statusList, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('D3:D2000').setDataValidation(statusRule);

  // Priority Dropdown
  const priorityList = ['High', 'Medium', 'Low'];
  const priorityRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(priorityList, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('E3:E2000').setDataValidation(priorityRule);

  // 8. Universal Conditional Formatting (Colors ONLY on Status and Priority)
  const rules = [];
  const statusRange = sheet.getRange('D3:D2000');
  const priorityRange = sheet.getRange('E3:E2000');

  // Status Rules
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Completed')
    .setBackground('#D1FAE5')
    .setFontColor('#065F46')
    .setRanges([statusRange])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('In Progress')
    .setBackground('#DBEAFE')
    .setFontColor('#1E40AF')
    .setRanges([statusRange])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Blocked')
    .setBackground('#FEE2E2')
    .setFontColor('#991B1B')
    .setRanges([statusRange])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('On Hold')
    .setBackground('#FEF3C7')
    .setFontColor('#92400E')
    .setRanges([statusRange])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Not Started')
    .setBackground('#F1F5F9')
    .setFontColor('#475569')
    .setRanges([statusRange])
    .build());

  // Priority Rules
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('High')
    .setBackground('#FFE4E6')
    .setFontColor('#9F1239')
    .setRanges([priorityRange])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Medium')
    .setBackground('#FEF3C7')
    .setFontColor('#92400E')
    .setRanges([priorityRange])
    .build());

  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Low')
    .setBackground('#CCFBF1')
    .setFontColor('#115E59')
    .setRanges([priorityRange])
    .build());

  sheet.setConditionalFormatRules(rules);

  // 9. Clean Subtle Grid Borders
  sheet.getRange(1, 1, fDataStartRow + 5, 8).setBorder(true, true, true, true, true, true, '#E2E8F0', SpreadsheetApp.BorderStyle.SOLID);
  sheet.getRange('A1:H1').setBorder(null, null, true, null, null, null, '#0F172A', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  sheet.getRange('A2:H2').setBorder(null, null, true, null, null, null, '#0F172A', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  sheet.getRange(`A${fHeaderRow}:H${fHeaderRow}`).setBorder(null, null, true, null, null, null, '#0F172A', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  sheet.getRange(`A${fColHeaderRow}:H${fColHeaderRow}`).setBorder(null, null, true, null, null, null, '#0F172A', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  SpreadsheetApp.flush();
}
