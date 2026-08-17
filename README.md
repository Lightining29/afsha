# Afsha Enterprises / Glowora - Hostinger Deployment Guide

This project is a full-stack e-commerce web application powered by **Node.js (Express + Socket.IO + MongoDB)** on the backend and **React (Vite)** on the frontend.

---

## 🚀 Quick Start for Hostinger Deployment

There are two primary ways to deploy this application on Hostinger:

### Option A: Hostinger Web / Cloud Hosting (Node.js Selector via hPanel)

1. **Upload Files:**
   - Compress your project folder (excluding `node_modules`) and upload it via Hostinger File Manager or Git.
   - Extract to `/home/uXXXXX/domains/afshaenterprises.com/` (or your domain directory).

2. **Configure Node.js in Hostinger hPanel:**
   - Go to **Websites** → **Manage** → **Node.js**.
   - **Node.js version:** Select **18.x** or **20.x** (or newer).
   - **Application mode:** `Production`.
   - **Application root:** `/` (or path to project root).
   - **Application startup file:** `server.js`.
   - **Application URL:** `https://www.afshaenterprises.com` (your domain).

3. **Set Environment Variables:**
   - In Hostinger hPanel or via `.env` file in the root directory, configure the required variables (see `.env.example`):
     - `PORT=5000` (or the port Hostinger assigns)
     - `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/glowora?retryWrites=true&w=majority`
     - `JWT_SECRET=your_secure_random_jwt_secret`
     - `FRONTEND_URL=https://www.afshaenterprises.com`
     - `SITE_URL=https://www.afshaenterprises.com`
     - `RAZORPAY_KEY_ID=your_key`
     - `RAZORPAY_KEY_SECRET=your_secret`
     - `SMTP_USER=your_email@gmail.com`
     - `SMTP_PASS=your_app_password`

4. **Install Dependencies and Build Frontend:**
   - Open the Hostinger SSH Terminal or use the "NPM Install" button in hPanel.
   - Run:
     ```bash
     npm install
     npm run build
     ```
   - Restart the Node.js application from the hPanel dashboard.

---

### Option B: Hostinger VPS (Ubuntu / Debian with PM2 + Nginx)

1. **Connect to your VPS:**
   ```bash
   ssh root@<your_vps_ip>
   ```

2. **Install Node.js 20 & PM2:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs git
   sudo npm install -g pm2
   ```

3. **Clone / Upload Project:**
   ```bash
   cd /var/www
   git clone <your_repo_url> afsha-app
   cd afsha-app
   ```

4. **Install & Build:**
   ```bash
   npm install
   npm run build
   ```

5. **Configure Environment:**
   ```bash
   cp .env.example .env
   nano .env
   # Enter your MongoDB Atlas URI, JWT Secret, Razorpay keys, etc.
   ```

6. **Start with PM2:**
   ```bash
   pm2 start ecosystem.config.cjs
   pm2 save
   pm2 startup
   ```

7. **Nginx Reverse Proxy Configuration (Sample):**
   ```nginx
   server {
       server_name afshaenterprises.com www.afshaenterprises.com;

       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
   Install SSL with Certbot:
   ```bash
   sudo certbot --nginx -d afshaenterprises.com -d www.afshaenterprises.com
   ```

---

## 🛠 Available NPM Scripts

- `npm run build` — Installs frontend packages and builds optimized React production bundle into `frontend/dist`.
- `npm start` — Starts the production Node.js Express server.
- `npm run dev` — Starts the server in development watch mode.
- `npm run seed` — Populates default categories, admin account, and blogs in MongoDB.

---

## 📡 API Health Check

Check that your API server is running and connected to MongoDB:
- `GET /api/health` -> Returns system uptime, database status, and node environment.
