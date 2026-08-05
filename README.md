# JobTrackr — Full-Stack Job Application Tracker

A production-ready, full-stack Job Application Tracker web application built using **React 18**, **Tailwind CSS 3**, **Node.js**, **Express.js**, **MongoDB**, and **JWT Authentication**.

---

## 🌟 Key Features

* **🔐 JWT Authentication**: Secure signup, login, profile management, and password update with hashed passwords via `bcryptjs`.
* **📊 Analytics Dashboard**: Visual progress metrics, status distribution, response rate analytics, upcoming interviews, and recent applications.
* **💼 Job Applications CRUD**: Full management for application status (`Applied`, `OA`, `Interview`, `Rejected`, `Offer`), job types, salary, links, and tags.
* **🔍 Search, Filter & Sort**: Real-time debounced search, filtering by status/type, sorting, and pagination.
* **📄 Resume Upload**: Local resume file attachment (PDF/DOCX) per job application with download links.
* **🏢 Company Management**: Keep research notes, website links, target industries, and 1-5 star ratings for target companies.
* **🎤 Interview Scheduling**: Track technical, behavioral, system design, and phone screen rounds with datetime pickers and meeting links.
* **📝 Notes & Reminders**: Attach job-specific notes and view in-app deadline/interview notifications.
* **🌓 Dark/Light Mode**: Smooth theme toggling with system preference detection and `localStorage` persistence.
* **✨ Modern UI/UX**: Built with glassmorphism, responsive sidebar layout, toast notifications (`react-hot-toast`), loading skeletons, and subtle micro-animations.
* **🐳 Docker Support**: Production ready `docker-compose.yml` orchestrating MongoDB, Express API, and Nginx frontend.
* **🌱 Seed Data**: Built-in seed script to populate sample applications, companies, interviews, and notes.

---

## 📁 Project Structure

```text
serious placement project/
├── client/                      # React 18 + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/shared/   # Reusable UI primitives (Button, Input, Modal, etc.)
│   │   ├── context/             # Auth & Theme context providers
│   │   ├── hooks/               # Custom hooks
│   │   ├── pages/               # Dashboard, JobList, JobDetail, CompanyList, etc.
│   │   ├── services/            # Axios API client & resource services
│   │   ├── App.jsx              # Routes & Protected route wrapper
│   │   ├── index.css            # Tailwind directives & glassmorphism utilities
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                      # Node.js + Express + Mongoose Backend API
│   ├── src/
│   │   ├── config/              # MongoDB connection & env validation
│   │   ├── controllers/         # Auth, Job, Company, Interview, Note controllers
│   │   ├── middleware/          # Auth JWT verify, Multer upload, Error handler, Validator
│   │   ├── models/              # User, Job, Company, Interview, Note, Notification schemas
│   │   ├── routes/              # Express API route handlers
│   │   ├── seed/                # Sample database seeder script
│   │   ├── app.js               # Express application middleware setup
│   │   └── server.js            # Express server entry point
│   ├── uploads/                 # Local directory for resume uploads
│   └── Dockerfile
│
├── docker-compose.yml           # Orchestration for MongoDB, server, and client
├── .env.example                 # Environment variables template
├── .env                         # Local environment variables
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
* **Node.js** (v18+)
* **MongoDB** (Local instance or MongoDB Atlas URI)

### 1. Backend Setup

```bash
cd server
npm install
```

Ensure your `.env` file in the root project directory has a valid `MONGO_URI`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/job-tracker
JWT_SECRET=job-tracker-super-secret-key-2024
CLIENT_URL=http://localhost:5173
```

Seed initial sample data:
```bash
npm run seed
```
> **Default Demo Account:**
> - Email: `demo@example.com`
> - Password: `demo1234`

Start the Express development server:
```bash
npm run dev
```

### 2. Frontend Setup

In a separate terminal:
```bash
cd client
npm install
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🐳 Docker Deployment

To spin up the complete stack (MongoDB + Node.js API + React on Nginx) with a single command:

```bash
docker-compose up --build
```

Access the app at:
- **Frontend App**: `http://localhost:80`
- **Backend API**: `http://localhost:5000`

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user |
| **POST** | `/api/auth/login` | Authenticate user & get JWT token |
| **GET** | `/api/auth/me` | Get active user profile |
| **GET** | `/api/jobs` | Get jobs with search, filter, sort, and pagination |
| **GET** | `/api/jobs/stats` | Get aggregated dashboard metrics |
| **POST** | `/api/jobs` | Create a job application |
| **POST** | `/api/jobs/:id/resume` | Upload a PDF/DOCX resume file |
| **GET** | `/api/companies` | List user's target companies |
| **GET** | `/api/interviews` | List upcoming and scheduled interviews |
| **GET** | `/api/notes/job/:jobId` | Get job prep notes |
| **GET** | `/api/notifications` | Get in-app alerts |

---

## 🛡️ License

MIT License © 2026. Built as a serious placement preparation project.
