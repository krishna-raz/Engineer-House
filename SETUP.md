# Engineer House - Development Setup Guide

## Post-Implementation Setup Steps

After the project structure has been created, follow these steps to get your development environment running.

## Step 1: Backend Setup

### 1.1 Install Dependencies
```bash
cd backend
npm install
```

This will install:
- express, cors, dotenv
- mongoose (MongoDB driver)
- bcryptjs (password hashing)
- jsonwebtoken (JWT)
- multer (file upload)
- nodemon (development)

### 1.2 Configure Environment
```bash
# Copy the example .env file
cp .env.example .env

# Edit .env with your settings
```

**For Development (MongoDB Local):**
```
MONGODB_URI=mongodb://localhost:27017/engineer-house
JWT_SECRET=dev_secret_key_12345
JWT_EXPIRE=7d
NODE_ENV=development
PORT=5000
```

**For Development (MongoDB Atlas Cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/engineer-house?retryWrites=true&w=majority
JWT_SECRET=dev_secret_key_12345
JWT_EXPIRE=7d
NODE_ENV=development
PORT=5000
```

### 1.3 Start Backend Server
```bash
npm run dev
```

Expected output:
```
MongoDB connected successfully
Server running on port 5000
```

### 1.4 Verify Backend is Running
```bash
# In a new terminal, test the API
curl http://localhost:5000/api/posts
# Should return: {"posts":[],"total":0,"pages":0}
```

---

## Step 2: Frontend Setup

### 2.1 Install Dependencies
```bash
cd frontend
npm install
```

This will install:
- react, react-dom
- react-router-dom (routing)
- axios (HTTP client)
- tailwindcss, postcss, autoprefixer (styling)

### 2.2 Configure Environment
```bash
# Copy the example .env file
cp .env.example .env

# Keep default settings
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### 2.3 Start Frontend Development Server
```bash
npm start
```

- Frontend will open at `http://localhost:3000`
- Hot reload enabled (changes auto-refresh browser)

---

## Step 3: Test the Application

### 3.1 Create First Admin User

1. Visit `http://localhost:3000/login`
2. Click "Register" link (or go to `/register` - add this page in Phase 2)
3. Create account:
   - Name: Admin
   - Email: admin@example.com
   - Password: password123

### 3.2 First Login
- Email: admin@example.com
- Password: password123
- Should redirect to `/admin` dashboard

### 3.3 Create First Blog Post

1. In Admin Dashboard, click "New Blog Post"
2. Fill in:
   - **Title**: My First Technical Blog
   - **Category**: Coding
   - **Content**: Write about IoT/Coding/Electronics
   - **Tags**: javascript, tutorial

3. **Option A - Without Image:** Save as draft, then publish
4. **Option B - With Image:** 
   - Upload an image (JPG/PNG/WEBP, max 2MB)
   - Image appears in post
   - Save and publish

### 3.4 View Published Post

1. Visit `http://localhost:3000` (Home page)
2. Your published post should appear
3. Click "Read More" to view full post

---

## Step 4: Important File Locations

| File | Purpose | Edit When |
|------|---------|-----------|
| `backend/.env` | Backend configuration | Setting DB URL, JWT secret |
| `backend/server.js` | Express app entry | Adding new middleware/routes |
| `backend/models/` | Database schemas | Modifying data structure |
| `backend/routes/` | API endpoints | Adding new endpoints |
| `frontend/.env` | Frontend configuration | Changing API base URL |
| `frontend/src/App.jsx` | App routing | Adding new pages/routes |
| `frontend/src/pages/` | Page components | Creating new pages |

---

## Step 5: Common Commands

### Backend
```bash
cd backend
npm run dev        # Start dev server with auto-reload
npm start          # Start production server
npm test           # Run tests
```

### Frontend
```bash
cd frontend
npm start          # Start dev server (opens browser)
npm run build      # Build for production
npm test           # Run tests
```

---

## Step 6: Database Management

### View MongoDB Data (Local)

Using MongoDB Compass:
1. Download MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Browse `engineer-house` database
4. View `users`, `posts`, `comments` collections

### View MongoDB Data (Atlas)

1. Log in to MongoDB Atlas
2. Go to Cluster → Collections
3. View data in browser

---

## Step 7: Testing API with Postman

### Import Collection Steps:
1. Download Postman
2. Create new request collection
3. Add requests for each endpoint

**Example: Login Request**
```
URL: http://localhost:5000/api/auth/login
Method: POST
Body (JSON):
{
  "email": "admin@example.com",
  "password": "password123"
}
```

Response will contain:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

Copy the `token` and use in subsequent requests:
```
Header: Authorization
Value: Bearer {token}
```

---

## Step 8: Troubleshooting

### Backend Issues

**"MongoDB connection error"**
- Ensure MongoDB is running (local) or URL is correct (Atlas)
- Check MONGODB_URI in .env
- Test with: `mongosh` (local) or Atlas UI

**"Port 5000 already in use"**
- Kill process: `lsof -ti:5000 | xargs kill -9` (Mac/Linux)
- Or change PORT in .env to 5001, 5002, etc.

**"Cannot find module 'express'"**
- Run `npm install` in backend folder
- Check package.json has dependencies listed

### Frontend Issues

**"Port 3000 already in use"**
- Kill process or use different port
- npm start will prompt for alternate port

**"Error: REACT_APP_API_BASE_URL is undefined"**
- Create `.env` file in frontend folder
- Add: `REACT_APP_API_BASE_URL=http://localhost:5000/api`
- Restart frontend with `npm start`

**"Login fails with 'Invalid token'"**
- Verify backend is running on port 5000
- Check JWT_SECRET in backend .env
- Ensure token is in localStorage (DevTools → Application → Local Storage)

---

## Step 9: Project Structure Recap

```
Engineer House/
├── backend/                    # Express.js server
│   ├── config/db.js           # MongoDB connection
│   ├── models/                # User, Post schemas
│   ├── middleware/            # Auth, multer (upload)
│   ├── routes/                # API endpoints
│   ├── uploads/               # Images folder
│   ├── server.js              # Entry point
│   ├── package.json           # Dependencies
│   └── .env                   # Config (secret)
│
├── frontend/                  # React app
│   ├── src/
│   │   ├── pages/             # Login, Dashboard, Home
│   │   ├── components/        # ProtectedRoute
│   │   ├── context/           # AuthContext
│   │   ├── services/          # API calls
│   │   ├── App.jsx            # Main component
│   │   └── index.css          # Tailwind CSS
│   ├── public/
│   │   └── index.html         # HTML template
│   ├── package.json           # Dependencies
│   └── .env                   # Config
│
├── README.md                  # Project documentation
└── .gitignore                 # Git ignore rules
```

---

## Step 10: Next Steps (Phase 2)

- [ ] Add register page for new admin users
- [ ] Add create/edit blog post pages
- [ ] Add blog detail page with full content
- [ ] Implement comments system
- [ ] Add search and category filtering
- [ ] Implement like/share buttons
- [ ] Add dark mode support
- [ ] Calculate reading time for posts
- [ ] Auto-pagination on home page
- [ ] Add admin analytics dashboard

---

## Tips for Development

1. **Hot Reload**: Both frontend and backend support hot reload. Changes auto-reflect.

2. **Debug Frontend**: 
   - Open DevTools (F12)
   - Check Console for errors
   - Use React DevTools extension
   - Check Network tab for API calls

3. **Debug Backend**:
   - Check terminal output for logs
   - Add `console.log()` statements
   - Use Postman to test endpoints directly

4. **Database Management**:
   - Keep MongoDB Compass open during development
   - Verify data is saved after API calls
   - Clear collections if you need to restart

5. **JWT Token Testing**:
   - Decode token at jwt.io to verify content
   - Check expiration time
   - Token expires after 7 days (configurable)

---

## Performance Tips

- Images should be optimized before upload
- Use pagination for blog listing (currently 10 posts per page)
- MongoDB indexes can be added for faster queries
- Consider caching on frontend for frequently accessed posts

---

## Security Reminders

- ✅ Never commit `.env` file (use `.env.example`)
- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens expire after 7 days
- ✅ Admin routes protected
- ✅ File uploads validated (type & size)

- ⚠️ In production:
  - Use strong JWT_SECRET
  - Set NODE_ENV=production
  - Use HTTPS only
  - Backup `/uploads` folder regularly
  - Use MongoDB Atlas with proper access controls

---

## Questions?

Refer to README.md for API documentation and project overview.

Happy coding! 🚀
