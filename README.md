# Cravings Food Delivery Platform

A production-ready monolithic full-stack food delivery application.

## Architecture

- **Frontend (`/client`)**: Next.js 16.3 (App Router), TypeScript, Tailwind CSS v4, Zustand.
- **Backend (`/server`)**: Node.js, Express, MongoDB (Mongoose), JWT Auth.

## Installation & Setup

1. **Clone the repository.**

2. **Backend Setup**
   ```bash
   cd server
   npm install
   # Copy .env.example to .env and fill in your secrets
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   # Copy .env.example to .env
   npm run dev
   ```
   *The frontend runs on port 3000 by default.*

## Environment Variables

### Server (`server/.env`)
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NODE_ENV`

### Client (`client/.env`)
- `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

## Deployment

The Next.js client is optimized for Vercel deployment. Ensure you add `NEXT_PUBLIC_API_URL` to the Vercel environment settings.
The Express backend can be deployed easily on AWS EC2, Render, or Heroku.
