# SpectraOps Enterprise Platform

A world-class, premium cybersecurity and AI infrastructure SaaS landing page and administration gateway for **SpectraOps**. Inspired by high-end brutalist design, typography scales, dynamic canvas animations, and a rich dark-theme aesthetic.

---

## 🚀 Local Development & Testing

This project consists of a **Modular Express Backend** (serving APIs and database registries on port `3000`) and a **Vite + React Frontend** (running on port `5173`).

### 1. Prerequisites
Ensure you have [Node.js (v18+)](https://nodejs.org) installed on your system.

### 2. Quick Installation
From the root workspace directory, install dependencies for the root manager, backend, and frontend concurrently:
```bash
npm run install:all
```

### 3. Running the Dev Server (Localhost)
To launch both the backend (with `nodemon` hot-reloading) and the frontend (Vite dev server) simultaneously:
```bash
npm run dev
```
* **Frontend Site**: [http://localhost:5173](http://localhost:5173)
* **Backend API & Health**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

### 4. Admin Gateway Access
To access the administrative terminal logs, CRM pipeline, orders registry, and mail gateway configurations:
1. Navigate to `/admin-login` (or [http://localhost:5173/admin-login](http://localhost:5173/admin-login)).
2. Authenticate using the seeded default credentials:
   * **Username**: `admin`
   * **Password**: `SpectraOps2025!`
   * **Email**: `spectraopsofficial@gmail.com`

---

## 🌐 Production Deployment Guides

To publish the entire stack (React static builds + Express REST server) under your domain, choose one of the three paths below based on your budget and scaling requirements.

> [!IMPORTANT]
> Because the application relies on **SQLite** (`spectraops.db`) and local JSON configuration, you **must** use a hosting provider that provides **persistent file storage**, otherwise, database items and settings will be wiped out when the server restarts.

---

### 1. Recommended Way — Standard Linux VPS (Paid VPS)
Hosting on a virtual private server (e.g., **DigitalOcean Droplet**, **Hetzner Cloud**, **AWS EC2**, or **Linode**) is the most robust and secure way to keep SQLite files intact.

#### Steps:
1. **Build Frontend Assets Locally**:
   ```bash
   npm run build:all
   ```
   This generates compiled production static files in `frontend/dist/`.
2. **Server Setup**:
   Log in to your Ubuntu VPS via SSH and install Node.js, Nginx, and PM2:
   ```bash
   sudo apt update
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs nginx git
   sudo npm install -g pm2
   ```
3. **Deploy Code**:
   Clone the repository into `/var/www/spectraops` and run `npm install --production` inside `backend`.
4. **Environment File**:
   Create a `.env` file inside the `backend` folder:
   ```env
   PORT=3000
   JWT_SECRET=your_secure_jwt_secret
   JWT_REFRESH_SECRET=your_secure_jwt_refresh_secret
   DATABASE_PATH=/var/www/spectraops/backend/data/spectraops.db
   ```
5. **Run under PM2**:
   ```bash
   pm2 start server.js --name "spectraops"
   pm2 save
   pm2 startup
   ```
6. **Nginx Reverse Proxy**:
   Create an Nginx configuration under `/etc/nginx/sites-available/spectraops`:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   Enable it (`ln -s`) and reload Nginx (`sudo systemctl restart nginx`).
7. **Install SSL (HTTPS)**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

---

### 2. Free Way — Render Free Tier or Oracle Cloud Always Free VM
If you want to host the project without spending any money:

#### Option A: Oracle Cloud Free Tier (Recommended Free - No Data Loss)
Oracle offers an **Always Free** VPS tier that acts exactly like a paid Linux server.
* **Steps**: Sign up for an Oracle Cloud account, spin up an "Always Free" VM instance with Ubuntu, and deploy using the **Standard Linux VPS** instructions above.
* **Pro**: SQLite database files are saved permanently.
* **Con**: Registration requires credit card validation.

#### Option B: Render Free Tier (Easiest - Resetting Storage)
Render offers free hosting for Node.js web services.
* **Steps**: 
  1. Create a free account on [Render.com](https://render.com) and link your GitHub repo.
  2. Create a new **Web Service** on Render.
  3. Set **Build Command**: `npm install && npm run build --prefix frontend && npm install --prefix backend`.
  4. Set **Start Command**: `node backend/server.js`.
  5. Under **Environment**, add your `JWT_SECRET` variables.
  6. Map your custom domain in the Render Dashboard and configure the DNS settings at your domain registrar.
* **Pro**: Easiest deployment, automatic free SSL, and completely free.
* **Con**: Render Free Tier storage is ephemeral. The SQLite database will reset to default states whenever the app goes to sleep or restarts due to inactivity.

---

### 3. Paid PaaS Way — Render / Railway (Managed Platform with Persistent Disk)
If you want a managed Platform-as-a-Service (PaaS) without manually configuring Linux terminals, Nginx, or SSL, but need your database records to persist safely.

#### Steps on Render:
1. Connect your GitHub repository to a paid **Web Service** ($7/month tier).
2. Set the build and start commands:
   * **Build Command**: `npm install && npm run build --prefix frontend && npm install --prefix backend`
   * **Start Command**: `node backend/server.js`
3. Scroll down to **Disks** in your service configuration dashboard:
   * Click **Add Disk**.
   * Name: `spectraops-db-disk`
   * Mount Path: `/var/data`
   * Size: 1 GB (minimum paid disk, approx $1/month).
4. Add the following environment variable to point your database to the persistent disk path:
   * `DATABASE_PATH` = `/var/data/spectraops.db`
5. Connect your custom domain in settings. Render handles all reverse proxies and SSL renewals seamlessly.
