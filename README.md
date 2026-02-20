# 🚀 TalentIQ — AI-Powered Applicant Tracking System

> Beyond keyword matching. Understand candidates — not just resumes.

TalentIQ is a full-stack AI-powered Applicant Tracking System that uses **LLMs via Groq API** to intelligently parse job descriptions, analyze resumes, and score candidates using semantic understanding.

Instead of traditional keyword filtering, TalentIQ evaluates candidates across multiple dimensions and provides **explainable AI-driven hiring insights**.

---

## ✨ Features

### 🧠 AI-Powered Intelligence
- Job Description Parsing using Groq LLM
- Resume Intelligence Extraction (Skills, Experience, Projects, Education)
- Semantic Skill Matching (React = ReactJS, ML = Machine Learning)
- AI-generated reasoning for every hiring decision

---

### 📊 Multi-Dimensional Scoring

Each candidate is evaluated across:

| Dimension | Weight |
|----------|--------|
| Skill Match | 50% |
| Experience | 25% |
| Project Relevance | 15% |
| Education | 10% |

**Final Score = Weighted sum (0–100)**

---

### 🏷️ Smart Shortlisting

Based on configurable job threshold:

| Label | Criteria |
|------|---------|
| ✅ Shortlisted | Score ≥ Threshold |
| ⚠️ Borderline | Within 10 points |
| ❌ Rejected | Below Threshold |

Threshold changes automatically re-label candidates using MongoDB bulk updates.

---

### 📁 Resume Upload

Supports:
- PDF
- DOCX
- TXT
- Direct text paste

Bulk uploads supported.

---

### 🔒 Privacy-First Design
- Resume text processed in memory
- Raw resumes are **never stored**
- Only structured intelligence is saved

---

### 📈 Interactive Dashboard
- Ranked candidate list
- Filter by status
- AI reasoning breakdown
- Score visualization
- Live threshold adjustment

---

## ☁️ Cloud Data Storage

TalentIQ uses **MongoDB Atlas** for:

- Job storage
- Candidate intelligence
- Scores & structured insights

---

## 🛠️ Tech Stack

### 🔹 Backend
- Node.js
- Express.js
- MongoDB Atlas (Cloud Database)
- Mongoose
- Multer (File Uploads)
- Mammoth (DOCX Parsing)
- PDF Parsing Tools
- Groq API (AI Processing)
- dotenv
- cors

---

### 🔹 Frontend
- Next.js (App Router)
- TypeScript
- React
- Tailwind CSS
- Axios
- react-dropzone

---

### 🔹 AI Layer
- Groq LLM API
  - JD Parsing
  - Resume Analysis
  - Candidate Scoring

---

## 🏗️ Architecture
Frontend (Next.js)
↓
Backend (Express API)
↓
AI Layer (Groq LLM)
↓
MongoDB Atlas (Cloud Storage)
