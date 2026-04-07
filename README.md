# MERN Stack Project

This repository contains the complete MERN (MongoDB, Express, React, Node.js) stack project.

## Directory Structure

The project branches out into the following main directories and files:

```text
merns_project/
├── backend/                  # Node.js & Express API (Server)
│   ├── controllers/          # Endpoint logic/handlers
│   ├── middleware/           # Custom Express middlewares
│   ├── models/               # Mongoose schemas (Database)
│   ├── routes/               # API route definitions
│   ├── uploads/              # User uploaded files (like PDFs, images)
│   ├── server.js             # Main entry point for the backend
│   └── package.json          # Backend dependencies
│
└── frontend/                 # Vite + Vanilla JS/React Frontend (Client)
    ├── public/               # Static assets accessible globally
    ├── src/                  
    │   ├── components/       # Reusable UI components
    │   ├── pages/            # View pages for the application
    │   └── App.jsx           # Main application setup
    ├── index.html            # Main HTML rendering template
    ├── vite.config.js        # Vite bundler configuration
    └── package.json          # Frontend dependencies
```


### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file for your environment variables (like `MONGO_URI`).
4. Start the development server: `npm run dev`

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`

### For Running
1. Go to the forntend folder
2. type npm run dev
3. In terminal
