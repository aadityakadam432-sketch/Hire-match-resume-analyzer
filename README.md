# 🤖 Hire Match AI — Resume & Job Matching System

> **Hackathon Problem Statement:** ALG-AI-01
> **Category:** AI / NLP / Recruitment Technology

Hire Match AI is an **AI-powered Resume & Job Matching System** that helps recruiters analyze multiple resumes against a job description, rank candidates based on relevance, and clearly explain why each candidate is a good or weak match.

Unlike traditional keyword-based screening systems, SmartHire AI focuses on **semantic matching, evidence-based scoring, explainability, and unsupported claim detection**.

---

## 🚀 Key Features

### 📄 Resume Upload

* Upload multiple resumes at once
* Supports PDF and DOCX files
* Extracts important candidate information automatically
* Handles messy and unstructured resumes

### 📝 Job Description Analysis

Recruiters can enter a complete job description and the system extracts:

* Required skills
* Preferred skills
* Experience requirements
* Education requirements
* Relevant technologies
* Job responsibilities

### 🧠 AI Information Extraction

The system extracts structured information from resumes:

* 👤 Candidate Name
* 📧 Contact Information
* 💻 Technical Skills
* 🎓 Education
* 💼 Work Experience
* 🛠️ Projects
* 🏆 Certifications
* 📍 Location

### 📊 Candidate Scoring & Ranking

Candidates are scored according to multiple factors:

| Factor              | Weight |
| ------------------- | -----: |
| Required Skills     |    40% |
| Relevant Experience |    25% |
| Education           |    10% |
| Projects            |    10% |
| Certifications      |     5% |
| Semantic Similarity |    10% |

The system generates an overall **Match Score** and ranks candidates automatically.

### 🔍 Search & Filters

Recruiters can quickly find candidates using:

* Skill search
* Experience filter
* Education filter
* Match score
* Location
* Certification
* Strong / Medium / Weak match

### 💡 Explainable AI

Instead of only showing a score, SmartHire AI explains **why the candidate received that score**.

Example:

> **Match Score: 91%**
>
> ✓ Python experience matches the job requirement
> ✓ Django experience found in previous projects
> ✓ SQL experience detected
> ✓ 3.2 years of relevant experience
> ✓ REST API experience found

This makes the ranking easier for recruiters to understand and trust.

---

## 🚨 Innovation: Unsupported Claim Detection

One of the key features of SmartHire AI is detecting potentially **unsupported skills or claims**.

For example, if a resume says:

> `Expert in Python, AWS and Machine Learning`

but the resume contains no AWS project, work experience, or certification, the system can flag it:

```text
⚠ Unsupported Claim

Skill: AWS

Evidence:
❌ Work experience
❌ Project
❌ Certification

Confidence: LOW
```

The system does **not automatically accuse the candidate of lying**.

Instead, it informs the recruiter that the claimed skill could not be supported by the available resume evidence.

---

## 🏗️ System Architecture

```text
                 ┌─────────────────────┐
                 │      Recruiter      │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   React / Next.js   │
                 │     Frontend        │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │       FastAPI       │
                 │       Backend       │
                 └──────────┬──────────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
   Resume Parser       JD Analyzer       Database
          │                 │
          ▼                 ▼
      NLP / LLM       Requirements
          │                 │
          └────────┬────────┘
                   ▼
            Matching Engine
                   │
          ┌────────┴─────────┐
          ▼                  ▼
     Score Engine      Claim Validator
          │                  │
          └────────┬─────────┘
                   ▼
            Ranked Candidates
                   │
                   ▼
             Recruiter UI
```

---

## 🛠️ Technology Stack

### Frontend

* React.js / Next.js
* Tailwind CSS
* JavaScript

### Backend

* Python
* FastAPI

### AI / NLP

* Natural Language Processing
* Sentence Transformers
* Embeddings
* Large Language Models
* Semantic Similarity

### Resume Processing

* PyMuPDF / PDF Parser
* python-docx
* OCR for scanned resumes

### Database

* PostgreSQL

### Vector Search

* FAISS / pgvector

---

## 📂 Project Structure

```text
SmartHire-AI/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── ...
│
├── backend/
│   ├── main.py
│   ├── api/
│   ├── models/
│   ├── services/
│   ├── resume_parser/
│   └── matching_engine/
│
├── uploads/
│
├── README.md
├── requirements.txt
└── .gitignore
```

---

## 🔄 How It Works

```text
1. Recruiter uploads multiple resumes
              ↓
2. Resume text is extracted
              ↓
3. Candidate information is structured
              ↓
4. Recruiter enters Job Description
              ↓
5. Job requirements are extracted
              ↓
6. Resume & Job Description are compared
              ↓
7. Candidate Match Score is generated
              ↓
8. Candidates are ranked
              ↓
9. Evidence-based explanation is generated
              ↓
10. Unsupported claims are flagged
```

---

## 📈 Example Result

```text
Candidate: Rahul Sharma

Overall Match: 91%

Skills Match:       95%
Experience Match:   92%
Education Match:    90%
Project Match:      88%
Semantic Match:     91%

Status: 🟢 Strong Match

Matched Skills:
✓ Python
✓ Django
✓ SQL
✓ REST API
✓ Git

Evidence:
✓ 3.2 years of backend development
✓ Django project detected
✓ REST API experience detected
✓ SQL used in project

Claim Verification:
⚠ AWS listed but supporting evidence not found
```

---

## 🎯 Problem We Solve

Recruiters often receive hundreds of resumes for a single position.

Traditional resume screening systems can:

* Depend heavily on keywords
* Miss semantically relevant candidates
* Produce rankings without explanations
* Reward keyword stuffing
* Fail to identify unsupported skill claims

SmartHire AI addresses these problems through:

> **Semantic Matching + Evidence-Based Scoring + Explainable AI + Claim Verification**

---

## 🌟 Future Improvements

* Multi-language resume support
* Advanced OCR for handwritten/scanned documents
* Interview question generation
* Candidate skill-gap analysis
* Recruiter feedback-based ranking
* Bias and fairness monitoring
* LinkedIn profile integration
* Advanced analytics dashboard
* Automated interview scheduling
* Candidate recommendation system

---

## 🔐 Privacy & Security

Candidate information can contain sensitive personal data.

The production version should include:

* Secure file storage
* Authentication & authorization
* Encryption
* Access control
* Automatic file deletion policies
* Data retention controls
* Privacy-compliant processing

---

## 🏆 Hackathon Value Proposition

### Why SmartHire AI?

**Traditional ATS**

> Resume → Keywords → Score

**SmartHire AI**

> Resume → Understand → Extract → Compare → Verify Evidence → Explain → Rank

Our goal is to make recruitment screening **faster, smarter, transparent, and more explainable**.

---

## 👥 Team

**Project:** SmartHire AI
**Problem Statement:** ALG-AI-01
**Domain:** Artificial Intelligence / NLP / Recruitment

---

## 📜 License

This project is developed for educational and hackathon purposes.
