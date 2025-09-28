# 🤖 AI Interview Assistant

An AI-powered interview assistant built with **React + Vite + Supabase + Gemini API**.  
It allows candidates to upload resumes, answer AI-generated interview questions, and automatically generates summaries and scores.  
Interviewers can view and manage candidate results in a dashboard.

---

  - Demo Video : [https://drive.google.com/file/d/1ckue0vTIDP7dsFNo4_ApjYufawbJDVKZ/view?usp=sharing]
  - Deployed Link : [https://ai-interview-assistant-i804.onrender.com]


## 📸 Screenshots (Optional)
- <img width="1885" height="983" alt="image" src="https://github.com/user-attachments/assets/d9494a4e-5189-43c3-9ac0-b54b60b010a0" /> 
<p>
  <img width="518" height="201" alt="image" src="https://github.com/user-attachments/assets/91920a4f-7d63-430f-9d55-3c47d0d8d1a9" />
</p>
- <img width="1885" height="983" alt="image" src="https://github.com/user-attachments/assets/8a718efe-3e05-4193-81a2-1f572e7dc88a" />
- <img width="1870" height="993" alt="image" src="https://github.com/user-attachments/assets/00146a75-c7eb-4071-80cd-7595f8158fc3" />
- <img width="1870" height="985" alt="image" src="https://github.com/user-attachments/assets/69758066-2d8d-4bb3-80bd-f13ee741fa38" />
- <img width="1885" height="983" alt="image" src="https://github.com/user-attachments/assets/1ad6f895-55e5-49ec-b9f3-f1824167c0c2" />
- <img width="1885" height="983" alt="image" src="https://github.com/user-attachments/assets/cef143bf-c219-4d7d-b1ea-1d22f58f7848" />


---

## ✨ Features

### 🎯 Candidate Side (Interviewee)
- Upload resume (PDF / DOCX supported).
- Resume parser extracts **Name, Email, Phone**.
- AI generates **6 questions** (2 Easy, 2 Medium, 2 Hard).
- Candidate answers within a **timer per question** (auto-submission on timeout).
- Responses scored automatically with **Gemini AI**.
- Interview summary generated and saved to DB.

### 👩‍💼 Interviewer Side (Dashboard)
- View all candidates sorted by **score**.
- Search candidates by **name, email, phone**.
- View full **chat history** and AI-generated **summary**.
- Candidates are **upserted** (updated if phone already exists).
- Data stored in **Supabase** (Postgres).

---

## 🛠 Tech Stack

- **Frontend:** React + TypeScript + Vite + TailwindCSS + ShadCN UI  
- **Backend / DB:** Supabase (Postgres)  
- **AI:** Gemini API (for question generation, scoring, and summarization)  
- **State Persistence:** LocalStorage + Custom hooks  

---

## 🚀 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/your-username/ai-interview-assistant.git
cd ai-interview-assistant
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run Development Server
```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## 📂 Project Structure

```
ai-interview-assistant/
├── src/
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom hooks (resume parser, state persistence)
│   ├── services/         # Gemini AI + Supabase utilities
│   ├── pages/            # Interviewee & Interviewer views
│   ├── types/            # TypeScript type definitions
│   └── main.tsx          # App entry
├── public/               # Static assets
├── index.html            # Root HTML
├── vite.config.ts        # Vite configuration
└── package.json
```

---

## 🔑 Key Flows

### Interviewee Flow
1. Upload Resume → Extract candidate info.
2. Generate Questions (Easy/Medium/Hard).
3. Candidate answers → Timer enforced.
4. Gemini scores answers & summarizes.
5. Data stored in Supabase.

### Interviewer Flow
1. Login to Dashboard.
2. View list of candidates.
3. Search / Sort by score.
4. View full summary + chat history.

---

## 📊 Database (Supabase Table: `candidates`)

| Column       | Type       | Description                          |
|--------------|-----------|--------------------------------------|
| id           | uuid      | Primary key                          |
| name         | text      | Candidate name                       |
| email        | text      | Candidate email                      |
| phone        | text (unique) | Candidate phone (unique constraint) |
| score        | int       | Total interview score                |
| chat_history | jsonb     | Q/A with scores                      |
| summary      | text      | AI generated summary                 |
| created_at   | timestamp | Submission time                      |

---

## 🤝 Contributing
Contributions are welcome!  
- Fork & clone the repo  
- Create a new branch  
- Submit a PR 🎉  

---

