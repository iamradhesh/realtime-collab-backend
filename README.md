# 🚀 Realtime Collab Backend

A **Node.js backend** for **real-time collaboration**, featuring authentication, project management, job processing, and real-time socket communication.

---

## ✨ Features

- **User Authentication** (JWT-based)  
- **Project Management** (CRUD operations)  
- **Real-time Collaboration** via WebSockets  
- **Job Queue & Worker System**  
- **Rate Limiting & Error Handling Middleware**  
- **Redis & RabbitMQ Integration**  
- **API Documentation** with Swagger  

---

## 🛠️ Tech Stack

- **Backend:** Node.js, TypeScript, Express.js  
- **Database & Caching:** Redis  
- **Messaging:** RabbitMQ  
- **Testing:** Vitest  
- **Deployment:** Docker & Docker Compose  

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+  
- Docker & Docker Compose  

### Installation

1. **Clone the repository**:

```bash
git clone https://github.com/yourusername/realtime-collab-backend.git
cd realtime-collab-backend

npm install
Configure environment variables:
cp src/config/env.example.ts src/config/env.ts
# Edit src/config/env.ts as needed
Running Locally

Start all services with Docker Compose:
docker-compose up --build
Or run the server directly:npm run dev
Project Structure:-
src/                # Main source code
├─ modules/         # Feature modules (auth, collaboration, jobs, projects)
├─ middleware/      # Express middlewares
├─ utils/           # Utility functions (DB, Redis, RabbitMQ)
├─ config/          # Configuration files (env, swagger)
├─ routes/          # API route definitions
coverage/           # Test coverage reports
docker-compose.yml  # Docker Compose setup

📚 API Documentation

Swagger docs are available at:
http://localhost:5000/api-docs
