import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.DISABLE_HMR = 'true';

const app = express();
const httpServer = http.createServer(app);
app.use(express.json());

// Explicitly serve public assets (manifest.json, sw.js, icons) with correct headers for PWABuilder
app.use(express.static(path.resolve(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('manifest.json')) {
      res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    } else if (filePath.endsWith('sw.js')) {
      res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
      res.setHeader('Service-Worker-Allowed', '/');
    }
  }
}));

// In-memory persistent database for users, highlights, and notes
interface User {
  id: string;
  name: string;
  email: string;
  contact: string;
  password?: string;
  role: 'admin' | 'user';
  createdAt: string;
  authProvider: 'manual' | 'google';
  streak: number;
  encouragements: number;
  badgesCount: number;
}

// Pre-seeded with the Admin account specified by the user
const users: User[] = [
  {
    id: 'admin-1',
    name: 'Israel Solomon',
    email: 'solomonisrael793@gmail.com',
    contact: '+234 806 468 7282',
    password: '08064687282', // Specified admin password
    role: 'admin',
    createdAt: new Date().toISOString(),
    authProvider: 'manual',
    streak: 6,
    encouragements: 0,
    badgesCount: 10
  }
];

// In-memory store for user saved items
interface UserDataStore {
  highlights: any[];
  notes: any[];
  bookmarks: any[];
}
const userStorage: Record<string, UserDataStore> = {
  'admin-1': {
    highlights: [
      { id: 'EZE-3-1', book: 'Ezekiel', chapter: 3, verse: 1, color: 'yellow', timestamp: Date.now() - 86400000 },
      { id: 'JHN-1-1', book: 'John', chapter: 1, verse: 1, color: 'emerald', timestamp: Date.now() - 172800000 }
    ],
    notes: [
      {
        id: 'note-1',
        book: 'Ezekiel',
        chapter: 3,
        verse: 1,
        text: 'Eat this roll, and go speak unto the house of Israel. Divine assimilation of the Word precedes proclaiming it.',
        timestamp: Date.now() - 86400000
      }
    ],
    bookmarks: []
  }
};

// --- AUTH API ROUTES ---

// Manual Registration
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, contact, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    contact: contact || '',
    password,
    role: email.toLowerCase() === 'solomonisrael793@gmail.com' ? 'admin' : 'user',
    createdAt: new Date().toISOString(),
    authProvider: 'manual',
    streak: 1,
    encouragements: 0,
    badgesCount: 1
  };

  users.push(newUser);
  userStorage[newUser.id] = { highlights: [], notes: [], bookmarks: [] };

  const { password: _, ...userWithoutPass } = newUser;
  return res.json({ user: userWithoutPass, token: `token-${newUser.id}` });
});

// Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const { password: _, ...userWithoutPass } = user;
  return res.json({ user: userWithoutPass, token: `token-${user.id}` });
});

// Google Account Authentication
app.post('/api/auth/google', (req: Request, res: Response) => {
  const { name, email, googleId, picture } = req.body;
  const userEmail = email || 'user@gmail.com';
  let user = users.find(u => u.email.toLowerCase() === userEmail.toLowerCase());

  if (!user) {
    user = {
      id: `google-${Date.now()}`,
      name: name || 'Google User',
      email: userEmail,
      contact: '',
      role: userEmail.toLowerCase() === 'solomonisrael793@gmail.com' ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      authProvider: 'google',
      streak: 1,
      encouragements: 0,
      badgesCount: 1
    };
    users.push(user);
    userStorage[user.id] = { highlights: [], notes: [], bookmarks: [] };
  }

  const { password: _, ...userWithoutPass } = user;
  return res.json({ user: userWithoutPass, token: `token-${user.id}` });
});

// Current User Profile
app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // Default to Israel Solomon admin for seamless instant preview if not logged out
    const admin = users[0];
    const { password: _, ...adminSafe } = admin;
    return res.json({ user: adminSafe });
  }

  const token = authHeader.replace('Bearer ', '');
  const userId = token.replace('token-', '');
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }

  const { password: _, ...userSafe } = user;
  return res.json({ user: userSafe });
});

// Admin: Get all registered users
app.get('/api/admin/users', (req: Request, res: Response) => {
  const safeUsers = users.map(({ password: _, ...u }) => u);
  return res.json({ users: safeUsers, totalUsers: safeUsers.length });
});

// User Saved Items (Highlights, Notes)
app.get('/api/user/saved', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const userId = authHeader ? authHeader.replace('Bearer token-', '') : 'admin-1';
  const data = userStorage[userId] || { highlights: [], notes: [], bookmarks: [] };
  return res.json(data);
});

app.post('/api/user/saved', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const userId = authHeader ? authHeader.replace('Bearer token-', '') : 'admin-1';
  const { highlights, notes, bookmarks } = req.body;
  if (!userStorage[userId]) {
    userStorage[userId] = { highlights: [], notes: [], bookmarks: [] };
  }
  if (highlights) userStorage[userId].highlights = highlights;
  if (notes) userStorage[userId].notes = notes;
  if (bookmarks) userStorage[userId].bookmarks = bookmarks;

  return res.json({ success: true, count: userStorage[userId].highlights.length + userStorage[userId].notes.length });
});

// Cache for complete scripture chapters
const bibleChapterCache: Record<string, any[]> = {};

// Scripture Text API Proxy with Memory Caching (Serves full KJV chapters)
app.get('/api/bible/:book/:chapter', async (req: Request, res: Response) => {
  const { book, chapter } = req.params;
  const version = (req.query.version as string || 'KJV').toUpperCase();
  const cacheKey = `${version}-${book}-${chapter}`;

  if (bibleChapterCache[cacheKey]) {
    return res.json({ book, chapter: Number(chapter), verses: bibleChapterCache[cacheKey] });
  }

  try {
    const query = encodeURIComponent(`${book} ${chapter}`);
    const resp = await fetch(`https://bible-api.com/${query}?translation=kjv`);
    if (resp.ok) {
      const data = await resp.json();
      if (data && data.verses && Array.isArray(data.verses) && data.verses.length > 0) {
        const verses = data.verses.map((v: any) => ({
          book: book,
          bookId: v.book_id || book.slice(0, 3).toUpperCase(),
          chapter: Number(chapter),
          verse: v.verse,
          textKJV: (v.text || '').trim().replace(/\n+/g, ' '),
          textNIV: (v.text || '').trim().replace(/\n+/g, ' '),
          textBSB: (v.text || '').trim().replace(/\n+/g, ' ')
        }));
        bibleChapterCache[cacheKey] = verses;
        return res.json({ book, chapter: Number(chapter), verses });
      }
    }
  } catch (err) {
    console.warn(`Backend fetch failed for ${book} ${chapter}:`, err);
  }

  return res.status(404).json({ error: `Verses for ${book} ${chapter} not found.` });
});

// Mount Vite in dev or serve dist in production
async function startServer() {
  const distPath = path.resolve(__dirname, 'dist');
  const indexPath = path.resolve(distPath, 'index.html');
  const isDev = process.env.NODE_ENV !== 'production' || !fs.existsSync(indexPath);

  if (isDev) {
    console.log('[Server] Starting in development / dynamic mode with Vite middleware');
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    console.log('[Server] Serving production static build from dist/');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(indexPath);
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`ScriptureArc Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
