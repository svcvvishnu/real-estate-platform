# Deployment Guide

This guide outlines the steps to deploy your Next.js Real Estate Platform to the internet.

## Opton 1: Vercel (Recommended)

Vercel is the creator of Next.js and provides the most seamless deployment experience.

### 1. Database Transition
**SQLite is not suitable for Vercel** because it's a file-based database and Vercel's filesystem is temporary. 
- Create a free PostgreSQL database on [Supabase](https://supabase.com/), [Railway](https://railway.app/), or [Vercel Postgres](https://vercel.com/storage/postgres).
- Update your `.env` with the new `DATABASE_URL`.
- In `prisma/schema.prisma`, change the provider:
  ```prisma
  datasource db {
    provider = "postgresql" // change from sqlite
    url      = env("DATABASE_URL")
  }
  ```

### 2. Push to GitHub
- Initialize a git repository and push your code to GitHub, GitLab, or Bitbucket.

### 3. Deploy to Vercel
- Sign in to [Vercel](https://vercel.com/) and click **"New Project"**.
- Import your repository.
- **IMPORTANT: Root Directory**: Since your app is inside the `web` folder, you must set the **Root Directory** to `web` in the Vercel project settings during the import step.
- **Environment Variables**: Add the following in the Vercel dashboard:
  - `DATABASE_URL`: Your production database connection string.
  - `AUTH_SECRET`: A random string (generate one with `openssl rand -base64 32`).
  - `NEXTAUTH_URL`: Your production domain. After your first deployment to Vercel, you will see a URL like `https://real-estate-platform-abc.vercel.app`. Copy that URL and add it to your Environment Variables.

> [!TIP]
> On Vercel, if you don't set `NEXTAUTH_URL`, it often automatically uses your deployment URL, but setting it explicitly is safer for custom domains.

### 4. Build and Launch
- Click **Deploy**. Vercel will automatically build the project and run migrations if you add a `postinstall` script in `package.json`: 
  ```json
  "scripts": {
    "postinstall": "prisma generate"
  }
  ```

---

## Option 2: VPS (DigitalOcean / AWS / Linode)

Use this if you want to keep costs fixed and maintain your own server.

### 1. Server Setup
- Install Node.js (v18+) and PM2:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
  sudo npm install -g pm2
  ```

### 2. Application Setup
- Clone your repo on the server.
- Install dependencies: `npm install`
- Build the app: `npm run build`
- Run migrations: `npx prisma db push` (or `npx prisma migrate deploy` if using folder-based migrations).

### 3. Process Management
- Start the app with PM2:
  ```bash
  pm2 start npm --name "real-estate" -- start
  ```

### 4. Nginx Reverse Proxy
- Install Nginx and point a domain to your server's IP.
- Configure Nginx to proxy requests to `http://localhost:3000`.

---

## Important Security Checklist
- [ ] Ensure `AUTH_SECRET` is unique and kept private.
- [ ] Use HTTPS (provided for free by Vercel).
- [ ] If using a VPS, set up a firewall (`ufw`).
- [ ] Ensure KYC documents are stored in a secure cloud bucket (e.g., AWS S3 or Supabase Storage) rather than local folders.
