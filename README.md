# HostelMate 🏠

HostelMate is a full-stack hostel management system designed to simplify day-to-day hostel operations for both students and administrators. The platform provides a centralized solution for managing complaints, room allocation, leave requests, mess information, fees, visitors, notices, expenses, and student profiles through an intuitive web interface.

## 🌐 Live Demo

**Deployment:** https://hostel-mate-orcin.vercel.app/

---

## ✨ Features

### Student Features
- Secure authentication and login
- Personal dashboard
- Room information and allocation details
- Complaint registration and tracking
- Leave request submission
- Fee status and payment records
- Mess information and updates
- Visitor management
- Expense tracking
- Roommate information
- Notice board access
- Profile management

### Admin Features
- Admin dashboard
- Student management
- Room management
- Complaint monitoring and resolution
- Leave request management
- Fee management
- Expense tracking
- Notice management
- Hostel operations monitoring

---

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Material UI (MUI)
- Radix UI Components

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt.js

### Deployment
- Frontend: Vercel
- Backend: Node.js + Express API

### AI 
- Ollama
- Scikit-Learn
- YOLO

---

## 📂 Project Structure

```
HostelMate/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+ recommended)
* MongoDB
* npm
* Docker (for Ollama)

---

## Backend Setup

cd backend
npm install
Create a `.env` file using `.env.example` as reference:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

Start the backend server:
npm run dev

---

## Frontend Setup

cd frontend
npm install
npm run dev

The frontend will run locally on:
http://localhost:5173

---

## 🔐 Authentication

HostelMate uses:

* JWT (JSON Web Tokens) for authentication
* Password hashing with bcrypt.js
* Protected API routes for secure access

---

## 📋 Core Modules

| Module             | Description                        |
| ------------------ | ---------------------------------- |
| Authentication     | User registration and login        |
| Room Management    | Hostel room allocation and details |
| Complaints         | Complaint submission and tracking  |
| Leave Management   | Leave application workflow         |
| Fee Management     | Fee records and status tracking    |
| Mess Management    | Mess-related information           |
| Visitor Management | Visitor entry records              |
| Expenses           | Expense tracking and management    |
| Notices            | Announcements and hostel updates   |
| Profile Management | Student profile maintenance        |

---

## 🎯 Objectives

* Digitize hostel administration
* Reduce paperwork and manual tracking
* Improve communication between students and hostel management
* Provide transparency for complaints, fees, and leave requests
* Offer a centralized platform for hostel-related services

---
