# MediCore HMS

**Smarter Hospital. Better Care.**

Production-oriented Hospital Management System dashboard built with:

- **Angular 19** (standalone components)
- **Angular Material 19**
- **NgRx 19** (entity stores, effects, facades)
- **Clean feature folders** (domain · data · store · pages)

---

## Modules (Lessons 1–17)

| Area | Route | Highlights |
|------|--------|------------|
| Command Center | `/dashboard` | **Live KPIs** from all modules, ward bars, audit timeline |
| Patients | `/patients` | Search, register wizard, detail |
| Appointments | `/appointments` | Booking with slot conflicts |
| Ward & Beds | `/beds` | Color bed map, status changes |
| Emergency | `/emergency` | Triage board, trauma activation |
| EMR | `/emr` | SOAP, ICD-10, vitals + abnormal flags |
| Pharmacy | `/pharmacy` | Inventory, Rx queue, interactions |
| Laboratory | `/laboratory` | Orders, results, critical alerts |
| Nursing | `/nursing` | Quick hub for ward nurses |
| Billing | `/billing` | Invoices, payments, revenue |
| Staff | `/staff` | Roster + conflict detection |
| Notifications | `/notifications` | Clinical/ops alerts, topbar badge |
| Reports | `/reports` | Cross-module snapshot |
| Settings | `/settings` | Preferences (localStorage) |
| Audit | `/audit` | HIPAA-oriented activity trail |

---

## Quick start

```bash
cd medicore-hms
npm install
npm start
```

Open `http://localhost:4200`. Sign in with the demo credentials shown on the login screen (if configured) or the seeded session.

### Scripts

| Command | Purpose |
|---------|---------|
| `npm start` | Dev server |
| `npm run build` | Production build |
| `npm test` | Unit tests (when configured) |

---

## Architecture notes

- **Facades** keep components free of store boilerplate.
- **Mock repositories** simulate latency and domain rules (stock deduction, lab critical ranges, shift overlaps).
- **UI** uses fluid grids (`minmax(min(100%, …), 1fr)`) so forms and boards stay usable on large screens and zoom.
- **Theme** via CSS custom properties (`--mc-*`).

This is a **frontend demo**. Wire real APIs by swapping mock repositories for HTTP services behind the same domain interfaces.

---


## Lesson 17 — Role-based menu & nested Clinical routes

### Role-based sidebar
Menu groups and items are filtered by the signed-in `UserRole`:
- **Pharmacist** sees Pharmacy (not full Clinical admin tools)
- **Lab technician** sees Laboratory
- **Receptionist** sees Patients, Register, Appointments, Billing
- **Admin** sees Staff, Audit, Reports, etc.

Route `roleGuard` also blocks direct URL access (e.g. `/audit`, `/staff`, `/billing`).

### Nested Clinical navigation
Under **Clinical**:
- All patients → `/patients`
- Register patient → `/patients/register`
- Appointments → `/appointments`
- Book appointment → `/appointments/book`
- EMR, Nursing

Child routes remain under `patients.routes` / `appointments.routes`.


## Lesson 16 — Sidebar with submenus

Navigation is grouped:

| Parent | Children |
|--------|----------|
| Dashboard | (direct) |
| Clinical | Patients, Appointments, EMR, Nursing |
| Inpatient | Ward & Beds, Emergency |
| Diagnostics | Laboratory, Pharmacy |
| Operations | Billing, Staff & Roster, Reports |
| System | Notifications, Settings, Audit log |

Groups expand/collapse; the active route’s parent opens automatically.

## Lesson 15

- Dashboard stats and panels read **live NgRx state** (patients, beds, lab, ER, pharmacy, billing, staff, notifications, audit).
- Production-oriented README and module map.

**MediCore HMS core curriculum complete.** Extend with real backend, WebSockets, and e2e tests as needed.

Built like lives depend on it.
# hsm_angular
