# Cricket Tournament Management System

This project is a full-stack web application for managing sports tournaments, built with a React frontend and an Express/MongoDB backend.

## Features
- User authentication and role-based access (Player, Admin, Super Admin)
- Create, join, and manage teams
- Organize and manage tournaments
- Live match updates and points table
- Admin dashboard for tournament and user management

## Project Structure
```
SEPM-main/
├── client/   # React frontend
└── server/   # Express backend
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Setup Instructions

#### 1. Clone the repository
```
git clone <repo-url>
cd SEPM-main
```

#### 2. Install dependencies
- For the client:
  ```
  cd client
  npm install
  ```
- For the server:
  ```
  cd ../server
  npm install
  ```

#### 3. Configure Environment Variables
- In `server/`, create a `.env` file:
  ```
  MONGO_URI=<your-mongodb-uri>
  PORT=5000
  ```

#### 4. Run the Application
- Start the backend server:
  ```
  cd server
  npm start
  ```
- Start the frontend React app:
  ```
  cd ../client
  npm start
  ```
- The React app will run on [http://localhost:3000](http://localhost:3000)
- The backend API will run on [http://localhost:5000](http://localhost:5000)

## Scripts
- `client/` (React):
  - `npm start` – Start development server
  - `npm run build` – Build for production
  - `npm test` – Run tests
- `server/` (Express):
  - `npm start` – Start backend server

## Technologies Used
- React, React Router, Tailwind CSS
- Express.js, MongoDB, Mongoose
- JWT Authentication

## Folder Overview
- `client/src/components/` – UI components (Navbar, Sidebar, etc.)
- `client/src/pages/` – Application pages (Dashboard, Admin, etc.)
- `client/src/context/` – React context for authentication
- `server/controllers/` – API controllers
- `server/models/` – Mongoose models
- `server/routes/` – Express routes

## License
This project is for educational purposes.
