# TerraFlux Frontend WebGIS Application

Interactive Geospatial & Planetary Climate Analysis Platform built with React 19, Vite, TailwindCSS, and MapLibre GL.

---

## 🚀 Local Development

**Prerequisites:** Node.js 18+

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Copy `.env.example` to `.env`:
   ```bash
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   The app will run at `http://localhost:3000`.

---

## 🌐 Production Deployment (Vercel / Cloudflare Pages)

### Deploying to Vercel (Recommended)

1. **Import Git Repository:**
   Connect your GitHub repository (`TerraFlux-Frontend`) in the [Vercel Dashboard](https://vercel.com).

2. **Build Settings:**
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

3. **Environment Variables:**
   Add the following environment variable in Vercel Project Settings:
   - `VITE_API_BASE_URL`: URL of your deployed backend (e.g. `https://api.terraflux.yourdomain.com`).

4. **SPA Routing:**
   `vercel.json` is pre-configured for instant client-side route rewrites (`/app`, `/home`) and optimal static asset caching.
