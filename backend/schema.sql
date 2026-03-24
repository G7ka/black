-- =========================
-- SCHOOLS
-- =========================
CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    school_name VARCHAR(255) NOT NULL,
    level VARCHAR(50),
    address TEXT,
    email VARCHAR(255),
    district VARCHAR(100),
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    school_website VARCHAR(255)
);

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    school_id INT REFERENCES schools(id) ON DELETE CASCADE,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE INDEX idx_users_school_id ON users(school_id);

-- =========================
-- KEY CONTACTS
-- =========================
CREATE TABLE key_contacts (
    id SERIAL PRIMARY KEY,
    school_id INT REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(255),
    email VARCHAR(255),
    number VARCHAR(50)
);

-- =========================
-- DOCUMENTS
-- =========================
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    school_id INT REFERENCES schools(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    type VARCHAR(50),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- SCHOOL STATS
-- =========================
CREATE TABLE school_stats (
    id SERIAL PRIMARY KEY,
    school_id INT REFERENCES schools(id) ON DELETE CASCADE,
    month DATE NOT NULL,
    parent_count INT DEFAULT 0,
    teacher_count INT DEFAULT 0,
    student_count INT DEFAULT 0,
    UNIQUE (school_id, month)
);

CREATE INDEX idx_stats_school_month ON school_stats(school_id, month);

-- =========================
-- INVOICES
-- =========================
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    school_id INT REFERENCES schools(id) ON DELETE CASCADE,
    billing_month DATE NOT NULL,
    student_count INT NOT NULL,
    amount BIGINT NOT NULL,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (school_id, billing_month)
);

CREATE INDEX idx_invoices_school_id ON invoices(school_id);

-- =========================
-- PAYMENTS
-- =========================
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    invoice_id INT REFERENCES invoices(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    method VARCHAR(50)
);

CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);

-- =========================
-- MESSAGES
-- =========================
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    school_id INT REFERENCES schools(id) ON DELETE CASCADE,
    type VARCHAR(50),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TICKETS
-- =========================
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    school_id INT REFERENCES schools(id) ON DELETE CASCADE,
    subject VARCHAR(255),
    priority VARCHAR(50),
    status VARCHAR(50),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
