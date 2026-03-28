# Quick Setup Guide

Project layout: `backend/` (Express + MongoDB + Flutterwave) and `frontend/` (React).

## Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

## Step 2: Set Up Environment Variables
Copy `backend/.env.example` to `backend/.env` and fill in values (MongoDB URI, `JWT_SECRET`, Flutterwave keys, `FRONTEND_URL`).

## Step 3: Start MongoDB
Use MongoDB Atlas or a local instance. Example local URI: `mongodb://127.0.0.1:27017/taskmanager`.

## Step 4: Start Backend Server
```bash
cd backend
npm start
```

## Step 5: Install Frontend Dependencies
```bash
cd frontend
npm install
```

## Step 6: Frontend Environment (optional)
Copy `frontend/.env.example` to `frontend/.env`. Set `REACT_APP_API_URL` to your API base (e.g. `http://localhost:5000/api` or your Render URL + `/api`).

## Step 7: Start Frontend
```bash
cd frontend
npm start
```

## Step 8: Access the Application
Open `http://localhost:3000`.

## Deploy backend on Render
Use `render.yaml` or create a Web Service with root directory `backend`, start command `npm start`, and set the same environment variables as in `.env.example`. Register the webhook URL in Flutterwave: `https://<your-service>.onrender.com/api/payments/webhook`.

## First Time Usage
1. Click "Register" to create a new account
2. Fill in username, email, and password
3. You'll be automatically logged in
4. Start creating tasks!

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check if the connection string in `.env` is correct
- Default: `mongodb://localhost:27017/taskmanager`

### Port Already in Use
- Change the PORT in `.env` file
- Or stop the process using port 5000

### Frontend Can't Connect to Backend
- Make sure backend is running on port 5000
- Check `REACT_APP_API_URL` in `client/.env` (optional, defaults to localhost:5000)
