# 🛡️ CampusAlert - College Grievance Management System

A modern, presentation-ready MERN stack application for managing college grievances. Built with React, Node.js, Express, and MongoDB.

![CampusAlert Banner](https://img.shields.io/badge/CampusAlert-Empowering%20Student%20Voices-0ea5e9?style=for-the-badge&logo=shield)

## ✨ Features

### 🎯 Enhancement #1: Professional Landing Page
- Modern hero section with gradient animations
- Animated statistics ticker (1,250+ Issues Resolved, 98% Satisfaction)
- Student Login & Admin Portal buttons
- **Demo Mode** - One-click auto-login with demo credentials

### 🔒 Enhancement #2: Anonymous Reporting
- Toggle switch to submit complaints anonymously
- Backend properly hides user identity from public responses
- Admins can still see who submitted for tracking

### 🤖 Enhancement #3: Pseudo-AI Auto-Categorization
- Keyword-based intelligent category detection
- Automatically suggests category as you type
- Supports 7 categories: Canteen, Hostel, Academics, Infrastructure, Transport, Library, Sports

### 📊 Enhancement #4: Visual Status Timeline
- `StatusStepper` component with 3 steps: Submitted → Reviewed → Resolved
- Animated progress indicators
- Color-coded states (green for completed, blue for active, gray for pending)

### 🎨 Enhancement #5: UI Polish
- `react-hot-toast` for beautiful notifications
- `EmptyState` component with animated SVG illustration
- Glassmorphism design with smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone and navigate to the project:**
```bash
cd CampusAlert
```

2. **Install Backend Dependencies:**
```bash
cd server
npm install
```

3. **Install Frontend Dependencies:**
```bash
cd ../client
npm install
```

4. **Configure Environment Variables:**

Edit `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/campusalert
JWT_SECRET=your_super_secret_key
PORT=5000
```

5. **Start MongoDB** (if running locally):
```bash
mongod
```

6. **Start the Backend:**
```bash
cd server
npm run dev
```

7. **Start the Frontend:**
```bash
cd client
npm run dev
```

8. **Open in browser:**
```
http://localhost:3000
```

## 📁 Project Structure

```
CampusAlert/
├── client/                   # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ComplaintCard.jsx    # Displays complaint with status
│   │   │   ├── ComplaintForm.jsx    # Form with anonymous toggle & AI
│   │   │   ├── EmptyState.jsx       # Empty state illustration
│   │   │   └── StatusStepper.jsx    # Visual timeline component
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Authentication state
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Professional landing page
│   │   │   ├── Login.jsx            # Login/Register with demo
│   │   │   ├── Dashboard.jsx        # Student dashboard
│   │   │   └── AdminDashboard.jsx   # Admin dashboard
│   │   ├── services/
│   │   │   └── api.js               # Axios configuration
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                   # Node.js Backend
│   ├── models/
│   │   ├── User.js           # User schema
│   │   └── Complaint.js      # Complaint schema with isAnonymous
│   ├── routes/
│   │   ├── auth.js           # Auth routes (login, register, seed)
│   │   ├── complaints.js     # CRUD for complaints
│   │   └── stats.js          # Statistics endpoint
│   ├── middleware/
│   │   └── auth.js           # JWT authentication
│   ├── index.js              # Express server entry
│   ├── package.json
│   └── .env
│
└── README.md
```

## 🔐 Demo Credentials

| Role    | Email              | Password  |
|---------|-------------------|-----------|
| Student | student@demo.com  | demo123   |
| Admin   | admin@demo.com    | admin123  |

Click **"Try Demo Account"** on the landing page to auto-login!

## 🛠️ Tech Stack

| Layer     | Technologies |
|-----------|-------------|
| Frontend  | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend   | Node.js, Express.js |
| Database  | MongoDB, Mongoose |
| Auth      | JWT, bcryptjs |
| UI        | Lucide Icons, react-hot-toast |

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/seed` - Create demo accounts

### Complaints
- `GET /api/complaints` - Get all complaints (filtered by role)
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints/:id` - Get single complaint
- `PUT /api/complaints/:id` - Update complaint (admin only)
- `DELETE /api/complaints/:id` - Delete complaint

### Statistics
- `GET /api/stats` - Get dashboard statistics

## 🎨 Design Features

- **Glassmorphism** - Frosted glass effect with backdrop blur
- **Gradient Accents** - Primary (cyan) to Accent (purple) gradients
- **Dark Theme** - Professional dark mode UI
- **Micro-animations** - Framer Motion for smooth transitions
- **Responsive** - Works on all device sizes

## � Deployment Guide

### Option 1: Deploy Backend to Render + Frontend to Vercel (Recommended - Free Tier)

#### Step 1: Deploy Backend to Render

1. **Create a Render account** at [render.com](https://render.com)

2. **Create a New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing CampusAlert

3. **Configure the Service:**
   ```
   Name: campusalert-api
   Region: Singapore (or closest to you)
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Set Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-a-strong-random-string>
   FRONTEND_URL=<your-vercel-url-after-deployment>
   ```
   
   💡 **Tip:** Generate JWT_SECRET with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

5. **Deploy!** Click "Create Web Service"
   - Note down your Render URL (e.g., `https://campusalert-api.onrender.com`)

#### Step 2: Deploy Frontend to Vercel

1. **Create a Vercel account** at [vercel.com](https://vercel.com)

2. **Import Project:**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   
3. **Configure the Project:**
   ```
   Framework Preset: Vite
   Root Directory: client
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Set Environment Variables:**
   ```
   VITE_API_URL=https://your-render-url.onrender.com/api
   ```

5. **Deploy!** Click "Deploy"

6. **Update Render FRONTEND_URL:**
   - Go back to Render dashboard
   - Update `FRONTEND_URL` environment variable with your Vercel URL
   - Redeploy the backend

### Option 2: Single Server Deployment (Full Stack on Render)

1. **Build the frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **The server is configured to serve the client build in production mode**

3. **Deploy to Render** with these settings:
   ```
   Root Directory: . (root, not server)
   Build Command: cd client && npm install && npm run build && cd ../server && npm install
   Start Command: cd server && npm start
   ```

4. **Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<your-secret>
   ```

### MongoDB Atlas Setup (Required for Deployment)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Create a database user
4. Whitelist IP: `0.0.0.0/0` (allow all - required for cloud deployment)
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/campusalert?retryWrites=true&w=majority
   ```

### Environment Variables Reference

#### Backend (server/.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT tokens | Random 64+ char string |
| `PORT` | Server port (auto-set by host) | `5000` |
| `NODE_ENV` | Environment mode | `production` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-app.vercel.app` |

#### Frontend (client/.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://your-api.onrender.com/api` |

## 🔧 Troubleshooting

### CORS Issues
- Ensure `FRONTEND_URL` is set correctly in backend
- Check browser console for exact error message

### MongoDB Connection Fails
- Verify IP whitelist includes `0.0.0.0/0`
- Check username/password in connection string
- Ensure special characters in password are URL-encoded

### API Calls Fail
- Check `VITE_API_URL` is set correctly
- Ensure backend is running (check `/api/health` endpoint)

## �📄 License

MIT License - Feel free to use for your projects!

---

Summer training project | CampusAlert © 2024
