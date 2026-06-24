# 🚀 CodeBug AI Code Review API

REST API backend for an AI-powered code review platform. Users authenticate using JWT, submit code snippets, and receive AI-generated code analysis including bug detection, improvement suggestions, complexity analysis, and refactored code. Reviews are stored in PostgreSQL and linked to authenticated users.

---

## 🌍 Live API

Production Base URL:

https://codebug-fult.onrender.com

---

## Table of Contents

* [Tech Stack](#tech-stack)
* [API Endpoints](#api-endpoints)
* [Authentication](#authentication)
* [Database Schema](#database-schema)
* [Environment Variables](#environment-variables)

---

# Tech Stack

| Layer            | Technology         |
| ---------------- | ------------------ |
| Runtime          | Node.js            |
| Framework        | Express.js         |
| ORM              | Prisma             |
| Database         | PostgreSQL (Neon)  |
| Authentication   | JWT (jsonwebtoken) |
| Password Hashing | bcrypt             |
| AI Integration   | OpenAI API         |
| API Testing      | Postman            |
| Deployment       | Render             |

---

# API Endpoints

Base URL (Local)

```http
http://localhost:3000
```

Base URL (Production)

```http
https://codebug-fult.onrender.com
```

All request/response bodies use:

```http
Content-Type: application/json
```

---

# Health Check

| Route | Method | Description      |
| ----- | ------ | ---------------- |
| `/`   | GET    | API Status Check |

### Success Response

```json
{
  "message": "Server is running"
}
```

---

# Authentication

## Register User

| Route                | Method |
| -------------------- | ------ |
| `/api/auth/register` | POST   |

### Request Body

```json
{
  "email": "gazal@example.com",
  "password": "123456"
}
```

### Success Response

```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "email": "gazal@example.com"
  }
}
```

### Error Responses

* 400 — User already exists
* 500 — Internal server error

---

## Login User

| Route             | Method |
| ----------------- | ------ |
| `/api/auth/login` | POST   |

### Request Body

```json
{
  "email": "gazal@example.com",
  "password": "123456"
}
```

### Success Response

```json
{
  "message": "Login successful",
  "token": "your-jwt-token"
}
```

### Error Responses

* 401 — Invalid credentials
* 500 — Internal server error

---

# Protected Routes

All protected routes require:

```http
Authorization: Bearer <your_jwt_token>
```

---

## Verify User Token

| Route          | Method |
| -------------- | ------ |
| `/api/profile` | GET    |

### Headers

```http
Authorization: Bearer <token>
```

### Success Response

```json
{
  "message": "Protected route working",
  "userId": "user-uuid"
}
```

### Error Response

```json
{
  "message": "Unauthorized"
}
```

---

# AI Code Review

## Create Review

| Route         | Method |
| ------------- | ------ |
| `/api/review` | POST   |

### Headers

```http
Authorization: Bearer <token>
```

### Request Body

```json
{
  "language": "javascript",
  "codeSnippet": "for(let i=0;i<n;i++){console.log(i)}"
}
```

### Success Response

```json
{
  "message": "Review created successfully",
  "review": {
    "id": "uuid",
    "language": "javascript",
    "codeSnippet": "for(let i=0;i<n;i++){console.log(i)}",
    "bugs": "No major bugs found",
    "improvements": "Use meaningful variable names and proper formatting",
    "complexity": "O(n)",
    "refactoredCode": "for (let i = 0; i < n; i++) { console.log(i); }",
    "userId": "user-uuid"
  }
}
```

### Error Responses

* 400 — Missing required fields
* 401 — Unauthorized
* 500 — AI service or database error

---

## Get All Reviews

| Route          | Method |
| -------------- | ------ |
| `/api/reviews` | GET    |

### Headers

```http
Authorization: Bearer <token>
```

### Success Response

```json
{
  "reviews": [
    {
      "id": "uuid",
      "language": "javascript",
      "complexity": "O(n)",
      "createdAt": "2026-04-05T11:39:26.939Z"
    }
  ]
}
```

---

# Authentication

### Mechanism

JWT (JSON Web Token)

### Flow

1. Register a new user
2. Login using email and password
3. Receive a JWT token
4. Send the token in the Authorization header

```http
Authorization: Bearer <token>
```

### Token Payload

```json
{
  "userId": "uuid"
}
```

### Token Expiry

```text
7 days
```

---

# Database Schema

## User

| Field     | Type     | Notes               |
| --------- | -------- | ------------------- |
| id        | String   | UUID (Primary Key)  |
| email     | String   | Unique              |
| password  | String   | Hashed using bcrypt |
| createdAt | DateTime | Default now()       |

---

## Review

| Field          | Type     | Notes                    |
| -------------- | -------- | ------------------------ |
| id             | String   | UUID (Primary Key)       |
| language       | String   | Programming Language     |
| codeSnippet    | String   | Submitted Source Code    |
| bugs           | String   | AI Generated Analysis    |
| improvements   | String   | AI Suggestions           |
| complexity     | String   | Time Complexity Analysis |
| refactoredCode | String   | Optimized Code           |
| createdAt      | DateTime | Default now()            |
| userId         | String   | Foreign Key → User.id    |

### Relationship

* One User can have many Reviews
* Each Review belongs to one User

---

# Environment Variables

Create a `.env` file:

```env
PORT=3000

DATABASE_URL="your_neon_database_url"

JWT_SECRET="your_jwt_secret"

OPENAI_API_KEY="your_openai_api_key"

GEMINI_API_KEY="your_gemini_api_key"
```

⚠️ Never commit your real API keys or database credentials to GitHub.

---

# Running Locally

Install dependencies:

```bash
pnpm install
```

Generate Prisma Client:

```bash
pnpm prisma generate
```

Push schema to database:

```bash
pnpm prisma db push
```

Start development server:

```bash
pnpm run dev
```

---

# Deployment

Backend deployed on Render:

https://codebug-fult.onrender.com

---

# Author

**Gazal Singla**

Built using Node.js, Express.js, Prisma ORM, PostgreSQL (Neon), JWT Authentication, OpenAI Integration, and Render Deployment.
