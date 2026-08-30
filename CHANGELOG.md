# 🚀 EduManage System — Changelog & Release Notes

All notable updates and feature additions for the **EduManage Ugandan School Management Platform** are documented below.

---

## 🌟 [v2.5.0 - X-Men Update] — 2026-08-24

### 🤖 1. AI Integration & Intelligent Assistants
- **Admin AI Copilot (`/admin/ai-assistant`, `/superadmin/ai-assistant`, `/schooladmin/*/ai-assistant`)**:
  - Automated academic performance analysis and UNEB exam readiness forecasting.
  - School fee collection predictions and revenue optimization suggestions.
  - Teacher attendance anomaly detection and automated relief/substitution proposals.
  - Natural language querying for student records, enrollment statistics, and class reports.
- **Parent AI Academic Tutor & Assistant (`/parent/ai-chat`)**:
  - Interactive chatbot for parents to query their child's grades, exam marks, and daily attendance.
  - Context-aware homework and revision assistance tailored to the Ugandan national curriculum.
  - Automated explanation of report card remarks and school fee balances.

---

### 👨‍👩‍👧‍👦 2. Multi-Child Parent Portal & Sibling Management
- **Multiple Children per Parent Account**:
  - Parents can now link and monitor **more than 1 child** simultaneously under a single login.
  - Added an interactive student selector with real-time search in the Parents directory.
  - Parent profile view now showcases a multi-child card grid with individual pupil classes, fees status, and quick links.
- **Quick Sibling Parent Pre-Filler**:
  - When enrolling a new student, school admins can choose an existing parent from the *"Link to Sibling's Parent"* dropdown to instantly auto-fill contact information.

---

### 🛡️ 3. Student Enrollment & Emergency Contacts Structure
- **Strict 2-Parents Limit**:
  - **Parent 1 (Primary Contact) \***: Required full name, phone number, relationship (*Mother, Father, Guardian*), and email.
  - **Parent 2 (Secondary Contact)**: Optional second parent/guardian with full relationship and contact details.
- **Mandatory Next of Kin (Emergency Line) \***:
  - Enforced a dedicated Next of Kin emergency contact with contact number and relationship selector (*Uncle, Aunt, Brother, Sister, Grandparent, Legal Guardian, Family Friend*).
- **Directory Indicators**:
  - Student tables and profiles now display the Next of Kin contact indicator (`NoK: Name (Phone)`) alongside primary parent contacts.

---

### 📸 4. Universal Passport & Profile Photo Uploads
- Integrated instant image upload with live client-side preview for:
  - **Teachers & Faculty Staff**
  - **Pupils & Students (Primary & Secondary)**
  - **Parents & Guardians**
- Fallback initials avatars with modern dual-color gradient backgrounds when no image is uploaded.

---

### 🏫 5. Primary vs. Secondary Domain & Curriculum Separation
- **Independent Education Levels**:
  - Clean separation between **Primary (P1–P7)** and **Secondary (S1–S6 O-Level & A-Level)** structures.
  - Removed cross-level grading confusion and separated subject combinations.
  - Dedicated Primary Admin and Secondary Admin routing and navigation sets.
- **Multi-Class Teacher Assignments**:
  - Teachers can now be assigned to **multiple classes/streams** simultaneously (e.g. `P6A, P7B` or `S1A, S2B, S3A`) via an interactive class selector chip group.

---

### 🎨 6. UI & Design System Standardization
- Removed arbitrary purple color schemes across forms, tables, and profile modals.
- Standardized on a modern palette of **Ugandan Navy Blue (`#2563EB`)**, **Emerald Green (`#059669`)**, **Amber Warmth (`#D97706`)**, and **Neutral Slate (`#0F172A`)**.
- Enhanced dark mode compatibility across all modals, tables, and metric cards.

---

## 🛠️ How to Test & Access
- **Branch**: `xmen`
- **Main App**: `http://localhost:5173/`
- **Primary School Admin**: `http://localhost:5173/schooladmin/primary`
- **Secondary School Admin**: `http://localhost:5173/schooladmin/secondary`
- **Parent Portal & AI Chat**: `http://localhost:5173/parent` & `http://localhost:5173/parent/ai-chat`
- **Admin AI Assistant**: `http://localhost:5173/schooladmin/primary/ai-assistant`
