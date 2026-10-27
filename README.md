# ScriptureArc - 63,779 Bible Cross-Reference Reader

A high-performance Bible study application featuring **63,779 canonical scripture cross-reference arcs**, King James Version (KJV) and New International Version (NIV) translations, collapsible verse-by-verse study accordions, audio narration, and PWA capabilities.

---

## 🚀 Quick Start: Running Locally in Your Text Editor (VS Code / Cursor / Sublime)

### Why opening `index.html` directly in a browser showed a blank page:
Modern web frameworks use ECMAScript Modules (`<script type="module">`). Browsers block module scripts on the `file:///` protocol for security reasons. To run the app locally, a local dev server is required.

### Steps to Run Locally:
1. Open your project folder in your text editor (VS Code, Cursor, etc.).
2. Open a terminal in the project folder and run:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   # Option A: Full-stack server (Frontend + Express API)
   npm run dev

   # Option B: Pure frontend client (lightweight Vite dev server)
   npm run dev:client
   ```
4. Open your browser at:
   ```
   http://localhost:3000
   ```

### To Build and Preview the Production Version Locally:
```bash
npm run build
npm run preview
```

---

## 🌐 Deploying to Hosting Platforms

### 1. GitHub Pages (Static Hosting)
The project is configured with `base: './'` in `vite.config.ts`, so assets load correctly on subpaths (e.g. `https://<username>.github.io/<repo>/`).

**Steps:**
1. Push your repository to GitHub.
2. Build the project:
   ```bash
   npm run build
   ```
3. Deploy the generated `dist` folder to GitHub Pages:
   - You can use the standard `gh-pages` branch, or
   - In your GitHub repo: go to **Settings > Pages** -> Source: **GitHub Actions** (choose Static HTML / Vite workflow).
4. The app includes resilient client-side fallback: Bible text and user authentication automatically function without requiring a Node.js backend!

---

### 2. Render.com (Full-Stack Web Service)
Render is a backend host. To deploy on Render without a blank page:

1. Log in to [Render.com](https://render.com) and click **New + > Web Service**.
2. Connect your Git repository.
3. Configure the settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add Environment Variable:
   - `NODE_ENV`: `production`
5. Click **Create Web Service**.
6. Render will automatically run `npm run build` to compile the frontend into `dist/`, and then run `server.ts` which serves both the API endpoints (`/api/*`) and the static frontend on `0.0.0.0:$PORT`.

*(Note: If you choose **Static Site** on Render instead of Web Service, set Build Command to `npm run build` and Publish Directory to `dist`.)*

---

### 3. Vercel / Netlify
1. Connect your repository to Vercel or Netlify.
2. Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Click **Deploy**.

---

### 4. Railway.app
1. Create a new project from your GitHub repo.
2. Railway detects the `package.json`.
3. Set the build command to `npm run build` and start command to `npm start`.

---

## 🔑 Authentication & Admin Details

- **Admin Account**:
  - **Email**: `solomonisrael793@gmail.com`
  - **Password**: `08064687282`
  - Has administrative access, personal study history, highlights, and notes.
- **Regular Users**:
  - Users can register with their Name, Email, Contact Phone, and Password.
  - Or sign in with their Google account.

---

## 📖 Scripture & Cross-Reference Features

- **63,779 Canonical Cross-Reference Arcs**:
  Interactive visualization representing the hyperlinked unity of all 66 books of the Holy Scripture.
- **Collapsible Verse Accordions**:
  Clicking any verse in study mode expands authentic Treasury of Scripture Knowledge (TSK) cross-references directly under that verse, complete with full target scriptures (KJV & NIV) and theological study notes.
- **Authentic Non-Repeating Cross References**:
  Every chapter and verse features authentic, canonical scripture links categorized across Law, History, Wisdom, Prophets, Gospels, Epistles, and Revelation.
- **PWA & Android Ready**:
  Includes `manifest.json`, service worker caching (`sw.js`), and is 100% ready for conversion to an `.apk` via [PWABuilder.com](https://www.pwabuilder.com).
