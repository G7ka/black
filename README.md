# EduManage Ugandan School Management System (UI Prototype)

This is a frontend UI prototype for a comprehensive School Management System designed specifically for the Ugandan education sector. It features a complete implementation of dashboards for Super Admins, School Administrators, Teachers, Students, and Parents.

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

1. Ensure you have Node.js installed on your machine.
2. Clone or download this repository.
3. Open a terminal and navigate strictly to the project root folder.
4. If you have not yet installed modules, run:
   ```bash
   npm install
   ```
5. Start the development server using:
   ```bash
   npm run dev
   ```
6. Open your localized server (typically `http://localhost:5173`) in any modern web browser.
7. You will be greeted by the Role Switcher home screen, where you can log into any of the 5 included personas.
