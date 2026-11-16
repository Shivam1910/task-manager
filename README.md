# TaskFlow — MERN Task Manager
A task manager built with MongoDB, Express, React and Node.js.

## Features
- Create, view, update and delete tasks
- Toggle completion, search, status/priority filters
- Task descriptions, priorities and due dates
- Responsive React dashboard
- Mongoose schema validation and Express request validation

## Requirements
Node.js 20+, npm, MongoDB Atlas account (or local MongoDB).

## 1. MongoDB Atlas
Create a free cluster at https://www.mongodb.com/atlas/database. Create a database user, allow your development IP in Network Access, and copy the Node.js connection string. Replace `<password>` with your database user's password; URL-encode special characters.

## 2. Backend
```bash
cd server
npm install
```
Copy `.env.example` to `.env` and set:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.example.mongodb.net/task_manager?retryWrites=true&w=majority
CLIENT_ORIGIN=http://localhost:5173
```
Run `npm run dev`. Health check: http://localhost:5000/api/health

## 3. Frontend
In a second terminal:
```bash
cd client
npm install
```
Copy `.env.example` to `.env` and set `VITE_API_URL=http://localhost:5000/api`. Run `npm run dev`, then open http://localhost:5173.

## API
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | List tasks; supports `search`, `status`, `priority` |
| GET | `/api/tasks/:id` | Get one task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id/toggle` | Toggle completion |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/health` | Health check |

## Deployment
### MongoDB Atlas
Create cluster and database user. Add your backend host's outbound IPs to Network Access. `0.0.0.0/0` permits connections from any IP and should only be used as a deliberate trade-off with a strong password and least-privilege user. Set the connection string as `MONGODB_URI` in Render.

### Backend on Render
1. Push repository to GitHub and create a Render Web Service.
2. Root Directory: `server`; Build command: `npm install`; Start command: `npm start`.
3. Add `NODE_ENV=production`, `MONGODB_URI` and `CLIENT_ORIGIN` (the exact deployed frontend origin).
4. Deploy and verify `/api/health`.

### Frontend on Vercel
1. Import repository into Vercel.
2. Root Directory: `client`; framework: Vite.
3. Add `VITE_API_URL` = backend URL ending in `/api`, e.g. `https://your-api.onrender.com/api`.
4. Deploy. Update Render's `CLIENT_ORIGIN` to the exact Vercel URL and redeploy/restart the backend.

Never commit `.env` or expose the MongoDB URI. Free hosts may sleep while idle. This assessment version has no authentication: all visitors share one task list.

## GitHub
```bash
git init
git add .
git commit -m "Build MERN task manager assessment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/task-manager-mern.git
git push -u origin main
```

## Assessment explanation
**Three decisions:** reusable React components; REST API separation; MongoDB with Mongoose for persistent data and schema validation.

**Three deliberately excluded features:** authentication (focus on core workflows); real-time notifications (not essential for a basic task manager); team collaboration (multi-user sharing and permissions outside scope).

**Limitation:** all visitors share one task list; there is no per-user ownership. With one extra day, implement authentication, task ownership/authorization and automated tests.
