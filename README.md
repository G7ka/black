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

If you turn off the PC or close the terminal, you can restart the application by following these steps:

1. Open a terminal and navigate strictly to the project root folder (`e:\wamp64\www\school_management`).
2. Start the development server using this command:
   ```bash
   npm run dev -- --host
   ```
3. Once the server says it is ready, you can access the different parts of the application using these specific links:

### Quick Access Links

*   **Main Landing Page (Register your school)** 
    👉 `http://lvh.me:5173`
*   **Standalone Platform Admin Login** 
    👉 `http://lvh.me:5173/admin`
*   **School Portal (Specific Tenant Login)** 
    👉 `http://kampala.lvh.me:5173` *(Replace "kampala" with any school name)*

## Dashboard Access Links (Local Dev)

This prototype also supports **tenant subdomains** in local development. Use a URL like `http://kampala.localhost:5173` (any subdomain name works) to access the tenant dashboards.

**Tenant dashboards (recommended):**

*   **Student Dashboard:** `http://kampala.localhost:5173/student`
*   **Teacher Dashboard:** `http://kampala.localhost:5173/teacher`
*   **Parent Dashboard:** `http://kampala.localhost:5173/parent`
*   **School Admin Dashboard (Primary):** `http://kampala.localhost:5173/schooladmin/primary`
*   **School Admin Dashboard (Secondary):** `http://kampala.localhost:5173/schooladmin/secondary`

**Main-domain demo hub:**

*   **Role Switcher / Demo Hub:** `http://localhost:5173/demo-hub`
