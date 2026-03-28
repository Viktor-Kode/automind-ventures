# Full Stack Task Manager

A complete full-stack task management application with authentication, task CRUD operations, filtering, search, and statistics.

## Features

### Backend Features
- ✅ User authentication (Register/Login with JWT)
- ✅ Task CRUD operations
- ✅ Task filtering (status, priority, category)
- ✅ Task search functionality
- ✅ Task sorting
- ✅ Task statistics
- ✅ User-specific tasks (each user sees only their tasks)
- ✅ Due dates and overdue detection
- ✅ Categories and tags
- ✅ Priority levels (low, medium, high)
- ✅ Task status (pending, in-progress, completed)

### Frontend Features
- ✅ Modern, responsive UI
- ✅ User authentication pages
- ✅ Task dashboard with statistics
- ✅ Create, edit, delete tasks
- ✅ Filter and search tasks
- ✅ Sort tasks by various criteria
- ✅ Task status management
- ✅ Priority indicators
- ✅ Due date tracking with overdue alerts
- ✅ Category and tag support
- ✅ Real-time statistics

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Flutterwave (hosted checkout + verify + webhook)

### Frontend
- React
- React Router
- Axios for API calls
- Modern CSS with gradients and animations

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or connection string)

### Backend Setup

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Create `backend/.env` (see `backend/.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/taskmanager
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
FLUTTERWAVE_SECRET_KEY=
FLUTTERWAVE_PUBLIC_KEY=
FLUTTERWAVE_SECRET_HASH=
```

3. Start the backend server:
```bash
cd backend
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. From the repo root, go to the frontend app:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Optional: `frontend/.env` with:
```env
REACT_APP_API_URL=http://localhost:5000/api
```
Production example: `REACT_APP_API_URL=https://automind-ventures.onrender.com/api`

4. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
  - Query params: `status`, `priority`, `category`, `search`, `sortBy`, `sortOrder`
- `GET /api/tasks/stats` - Get task statistics
- `GET /api/tasks/:id` - Get a single task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

All task endpoints require authentication (JWT token in Authorization header).

### Payments (Flutterwave)
- `GET /api/payments/config` — public key for client-side use (if needed)
- `POST /api/payments/initialize` — start payment (auth); returns checkout `link`
- `GET /api/payments/verify?transaction_id=...` — confirm transaction after redirect (auth)
- `POST /api/payments/webhook` — Flutterwave server webhook (configure `FLUTTERWAVE_SECRET_HASH`)

## Usage

1. Start MongoDB if running locally
2. Start the backend server
3. Start the frontend client
4. Open `http://localhost:3000` in your browser
5. Register a new account or login
6. Start creating and managing your tasks!

## Project Structure

```
automind/
├── backend/               # Express API (deploy on Render)
│   ├── controllers/
│   ├── Model/
│   ├── Routes/
│   ├── middleware/
│   ├── index.js
│   └── package.json
├── frontend/              # React app (separate deploy, e.g. Netlify/Vercel)
│   ├── public/
│   ├── src/
│   └── package.json
└── render.yaml            # Optional Render Blueprint
```

## License

ISC
