# EduManage Ugandan School Management System (UI Prototype)

This is a frontend UI prototype for a comprehensive School Management System designed specifically for the Ugandan education sector. It features a complete implementation of dashboards for Super Admins, School Administrators, Teachers, Students, and Parents.

## 🌟 What's New in v2.5 (Branch: `xmen`)

- 🤖 **AI Assistant & Copilots**:
  - **Admin AI Copilot** (`/admin/ai-assistant`, `/schooladmin/*/ai-assistant`): Automated UNEB exam readiness forecasting, fee collection projections, teacher substitution analysis, and instant smart reporting.
  - **Parent AI Academic Tutor** (`/parent/ai-chat`): Interactive parent chatbot providing grades explanations, homework assistance, attendance alerts, and policy lookups.
- 👨‍👩‍👧‍👦 **Multi-Child Parent Support**:
  - Parents can now link and manage **multiple children** attending the school under a single account.
  - Integrated interactive child picker with search in the Parents directory.
  - Quick sibling parent pre-filler in student enrollment forms.
- 🛡️ **Student Enrollment: Max 2 Parents & Next of Kin**:
  - Enforced a strict maximum of **2 parents** (Parent 1 Primary, Parent 2 Secondary) with relationship tagging.
  - Enforced a dedicated **Next of Kin (Emergency Line)** with relationship and direct contact number.
- 📸 **Universal Profile & Passport Photo Uploads**:
  - Instant portrait photo upload with live client preview for **Teachers**, **Pupils/Students**, and **Parents**.
- 🏫 **Primary vs. Secondary Complete Domain Separation**:
  - Dedicated Primary (P1–P7) and Secondary (S1–S6 O-Level/A-Level) school admin workflows, curriculum subjects, and grading systems.
  - **Multi-Class Teacher Assignments**: Teachers can teach multiple classes simultaneously with interactive selector chips.
- 🎨 **Clean Design System**: Standardized on Ugandan Navy Blue, Emerald Green, and Neutral Slate (removed arbitrary purple themes).

See the complete release details in [**CHANGELOG.md**](./CHANGELOG.md).

## Features Included in this Prototype

*   **Super Admin Dashboard:** Manage multiple schools across the country, handle subscriptions, view system-wide analytics, monitor performance, and access developer tools.
*   **School Admin Dashboard:** Dedicated controls for a specific school (e.g., Kampala Primary School). Manage Teachers, Students, Parents, Fee Structures, and Class level assignments.
*   **Teacher Dashboard:** Tools for teachers to manage their students, track daily attendance, input grades, and create assignments.
*   **Student Dashboard:** A portal for students to check their schedules, view grades, access assignments, and submit anonymous teacher absence reports.
*   **Parent/Guardian Dashboard:** A portal to track linked children's academic performance, monitor daily attendance, and handle fee payments.

## Uganda-Specific Features Configured
*   **Currency & Values:** All dummy currency is displayed in Ugandan Shillings (UGX).
*   **Class Structures:** Adheres to the standard Primary (P1-P7) and Secondary (S1-S6) education levels used in Uganda.
*   **Subject Differentiation:** Subjects and grading thresholds (e.g., >= 40% for passing) are aligned with the Ugandan curriculum.

## Frameworks and Technologies

*   **React.js 18**
*   **Vite** configuration for ultra-fast compilation
*   **Tailwind CSS 3** for styling and visual design
*   **Lucide React** for consistent iconography
*   **React Router v6** for role-based navigation and deep linking

## How to Run the App Locally

### Prerequisites

Before you start, make sure you have the following installed:

| Tool | Minimum version | Purpose |
|------|-----------------|---------|
| [Node.js](https://nodejs.org/) | 18+ | Runs the frontend and backend |
| npm | 9+ (bundled with Node.js) | Installs dependencies |
| [PostgreSQL](https://www.postgresql.org/download/) | 14+ | Database for the backend API |

You need **two terminal windows** to run the full app (frontend + backend). The frontend UI can run on its own for demo purposes, but login, registration, and live data require the backend.

---

### Step 1 — Open the project folder

Open a terminal and navigate to the project root (the folder that contains this README and `package.json`):

```bash
cd path/to/black
```

---

### Step 2 — Install frontend dependencies

From the project root:

```bash
npm install
```

---

### Step 3 — Configure the frontend environment

Create a `.env` file in the project root (if it does not already exist) with:

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

This tells the React app where to find the backend API.

---

### Step 4 — Set up the backend

Open a **second terminal** and navigate to the backend folder:

```bash
cd path/to/black/backend-schooladmin
```

Install backend dependencies:

```bash
npm install
```

Copy the example environment file and edit it with your local settings:

```bash
cp .env.example .env
```

At minimum, update these values in `.env`:

- `DATABASE_URL` — your PostgreSQL connection string (default expects user `postgres`, password `postgres`, database `edumanage` on port `5432`)
- `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` — use long random strings in production
- `ENCRYPTION_KEY` — a 64-character hex string (generate with `openssl rand -hex 32`)

Create the database in PostgreSQL (if it does not exist yet):

```sql
CREATE DATABASE edumanage;
```

Run database migrations and seed the default super admin account:

```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

The seed creates a platform admin you can use to log in:

- **Email:** `hatalabdallah@gmail.com`
- **Password:** `ChangeMe123!`

---

### Step 5 — Start the backend server

Still in the `backend-schooladmin` folder:

```bash
npm run dev
```

The API should be available at **http://localhost:4000**.

Leave this terminal running.

---

### Step 6 — Start the frontend dev server

Go back to your **first terminal** (project root) and run:

```bash
npm run dev -- --host
```

When Vite reports `ready`, open your browser. The frontend runs at **http://localhost:5173**.

Leave this terminal running as well.

---

### Step 7 — Open the app in your browser

Use the links below to access different parts of the application.

#### Quick Access Links

*   **Main Landing Page (Register your school)** 
    👉 `http://lvh.me:5173`
*   **Standalone Platform Admin Login** 
    👉 `http://lvh.me:5173/admin`
*   **School Portal (Specific Tenant Login)** 
    👉 `http://kampala.lvh.me:5173` *(Replace "kampala" with any school name)*

#### Dashboard Access Links (Local Dev)

This prototype also supports **tenant subdomains** in local development. Use a URL like `http://kampala.localhost:5173` (any subdomain name works) to access the tenant dashboards.

**Tenant dashboards (recommended):**

*   **Student Dashboard:** `http://kampala.localhost:5173/student`
*   **Teacher Dashboard:** `http://kampala.localhost:5173/teacher`
*   **Parent Dashboard:** `http://kampala.localhost:5173/parent`
*   **School Admin Dashboard (Primary):** `http://kampala.localhost:5173/schooladmin/primary`
*   **School Admin Dashboard (Secondary):** `http://kampala.localhost:5173/schooladmin/secondary`

**Main-domain demo hub:**

*   **Role Switcher / Demo Hub:** `http://localhost:5173/demo-hub`

---

### Restarting the app (after closing the terminal)

If you already completed the first-time setup above, you only need to start both servers again:

**Terminal 1 — Backend:**
```bash
cd path/to/black/backend-schooladmin
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd path/to/black
npm run dev -- --host
```

Make sure PostgreSQL is running before starting the backend.

---

### Troubleshooting

| Problem | Likely cause | Fix |
|---------|--------------|-----|
| `Can't reach database server at localhost:5432` | PostgreSQL is not running | Start the PostgreSQL service, then re-run `npx prisma migrate dev` |
| Frontend loads but login/API calls fail | Backend is not running | Start the backend with `npm run dev` in `backend-schooladmin` |
| Port 5173 or 4000 already in use | Another process is using the port | Stop the other process, or change `PORT` in backend `.env` / Vite config |
| `npm install` fails | Node.js version too old | Upgrade to Node.js 18 or later |
