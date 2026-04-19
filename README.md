# 🎬 YouTube Clone App

A modern full-stack YouTube Clone built to replicate the essential features of a video streaming platform. This project highlights scalable design, real-time user interaction, and a smooth user experience using modern web technologies.

---

## 🚀 Key Features

### 🔐 Authentication & User Profile

* Secure signup with validation and duplicate checks
* Token-based login system using JWT
* User profile management (avatar, bio, links)
* Persistent login sessions
* Strong security with encrypted passwords and protected routes

---

### 🎥 Video Handling & Streaming

* Upload videos with thumbnail support and metadata
* Background processing for optimized streaming
* Manage titles, tags, categories, and descriptions
* Track video performance and engagement
* Privacy options: public, private, unlisted

---

### 💬 Social & Engagement

* Comment system with replies and mentions
* Like and dislike functionality
* Channel subscription system
* Watch history tracking
* Smart content discovery and recommendations

---

### 🎨 UI/UX Design

* Fully responsive design for all devices
* Dark mode support
* Reusable component-based architecture
* Smooth animations and loading states
* Accessibility-friendly interface

---

## 🎯 Use Cases

### 🎬 Content Creators

* Upload and manage videos easily
* Grow audience with subscription features
* Analyze performance using insights

---

### 👀 Viewers

* Search and explore content
* Interact via comments and likes
* Continue watching from history
* Share content easily

---

### 💻 Developers

* Learn real-world full-stack architecture
* Understand API integration and state management
* Extend and customize features easily

---

## ⚙️ Setup Instructions

### 📋 Requirements

* Node.js (v16 or above)
* npm / yarn
* MongoDB

---

### 🖥️ Backend Setup

```bash
cd BackEnd
npm install
```

Create `.env` file:

```
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/Youtube-clone
JWT_SECRET=rtyoyurog3556g85ghdfjgdj6oogrghtyfbc
```

  

Run server:

```bash
npm start
```

---

### 🌐 Frontend Setup

```bash
cd FrontEnd
npm install
```

Add `.env`:

```
VITE_BACKEND_SERVER=http://localhost:8000
```

Run frontend:

```bash
npm run dev
```

---

## 🏗️ Project Structure

### 🔙 Backend

* Server setup & middleware configuration
* Database connection and models
* Controllers for business logic
* API routes handling
* Authentication & validation middleware

---

### 🎨 Frontend

* App routing and layout
* Pages (Login, Register, Home, Video Player)
* Reusable components
* State management using Redux/Context
* API communication layer

---

## 🛠️ Technologies Used

### Backend

* Node.js
* Express.js
* MongoDB & Mongoose
* JWT Authentication
* bcrypt

---

### Frontend

* React
* Vite
* Tailwind CSS
* Redux Toolkit
* Axios

---

## 🔗 API Endpoints

### Authentication

* Register User
* Login User

### Videos

* Upload Video
* Fetch Videos

### Engagement

* Like / Dislike

### Comments

* Get Comments
* Add Comment

---

## ✅ Highlights

* Clean and modular architecture
* Secure authentication system
* Optimized performance
* Scalable and maintainable code

---

## 📌 Repository

### GitHub: https://github.com/liku9/Youtube-clone
