# 🏥 Healthcare Full Stack Application

This is a full-stack healthcare application built using **React (Vite)**, **Express.js (Node.js)**, **TypeScript**, and **Firebase Firestore**. It was created as part of an internship assessment with a focus on secure patient registration, appointment booking, and treatment session management.

### 🌐 Live Demo
➡️ [https://health-care-app-snowy.vercel.app/](https://health-care-app-snowy.vercel.app/)

---

## 📋 Features

### ✅ Patient Login & Registration
- Secure login and signup functionality using Firebase Authentication.

### 🗓️ Special Appointment Booking
- Patients can book a special appointment lasting **1 hour**.
- Upon booking, **2 follow-up sessions** are auto-scheduled at **2-week intervals**.

### 🔁 Treatment Session Structure
- Session 1: Selected by the patient.
- Sessions 2 & 3: Automatically scheduled by the system.
- Follow-ups respect allowed appointment days and auto-adjust to the next available slot.

### 📅 Allowed Appointment Days
- Appointments can only be scheduled on:
  - **Tuesday**
  - **Wednesday**
  - **Friday**

### 🚫 Time Slot Blocking
- Once 3 sessions are booked by a patient, their time slots are reserved.
- These slots become unavailable to other users.

### 📊 Patient Dashboard
- View all upcoming and past appointments.
- Options to **update** or **cancel** appointments directly from the dashboard.

### 📧 Email Notifications
- Patients receive automatic email notifications on **appointment creation**, **rescheduling**, and **cancellation**.

---

## 🧰 Tech Stack

| Layer      | Tech Stack                         |
|------------|------------------------------------|
| Frontend   | React (Vite) + TypeScript + Ant Design |
| Backend    | Node.js (Express) + TypeScript     |
| Database   | Firebase Firestore                 |
| Auth       | Firebase Authentication            |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- Firebase Project Setup (Firestore & Auth)
- Environment Variables

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/healthcare-app.git
cd healthcare-app
```

### 2. Install Dependencies

For both frontend and backend:
```bash
npm install
```

### 3. Setup Environment Variables

Create a .env file in the client directory with the folling: 


| Variable Name     | Description                           |
|-------------------|---------------------------------------|
| `VITE_BASE_URL`   | Base URL of the backend API server    |


Create a .env file in the server directory with the following:

### 🔐 Environment Variables

| Variable Name           | Description                                                                 |
|-------------------------|-----------------------------------------------------------------------------|
| `FIREBASE_PROJECT_ID`   | Your Firebase project ID                                                    |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email                                              |
| `FIREBASE_PRIVATE_KEY`  | Private key for Firebase service account (escaped with `\n`, wrapped in `""`) |
| `JWT_SECRET`            | Secret key used for signing JWT tokens                                     |
| `CLIENT_URL`            | URL of the frontend client (e.g. Vite app)                                 |
| `EMAIL_USER`            | Gmail address used to send email notifications                             |
| `EMAIL_PASS`            | Gmail App Password (if 2FA enabled) or account password (not recommended)  |



### 4. Run Locally

Backend
```bash
cd server
npm run dev
```

Frontend
```bash
cd client
npm run dev
```

### 📦 Scripts

Backend (in /server)

"scripts": {
  "dev": "nodemon src/server.ts",
  "build": "rimraf ./dist && tsc",
  "start": "npm run build && node dist/server.js"
}

### Author
Email: contact.roopsagarudayar@gmail.com
Portfolio: [https://www.roopsagar.tech/](https://www.roopsagar.tech/)




