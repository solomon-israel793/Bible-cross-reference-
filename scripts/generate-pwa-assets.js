import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, 'public');
const screenshotsDir = path.resolve(publicDir, 'screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const svgPath = path.resolve(publicDir, 'icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generateAssets() {
  console.log('Generating PWA Icons & Screenshots for PWABuilder compliance...');

  // 1. 192x192 Standard Icon
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.resolve(publicDir, 'pwa-192x192.png'));
  console.log('Created pwa-192x192.png');

  // 2. 512x512 Standard Icon
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve(publicDir, 'pwa-512x512.png'));
  console.log('Created pwa-512x512.png');

  // 3. Apple Touch Icon (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.resolve(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // 4. Favicons
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.resolve(publicDir, 'favicon-32x32.png'));
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile(path.resolve(publicDir, 'favicon-16x16.png'));
  console.log('Created favicons');

  // 5. Maskable 512x512 with 15% Safe-Zone Padding on #121212 background
  // Safe zone rule: Android crops into circle or squircle, so central 80% contains the logo
  const innerSize = Math.round(512 * 0.72); // ~368px
  const innerBuffer = await sharp(svgBuffer)
    .resize(innerSize, innerSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 18, g: 18, b: 18, alpha: 1 }
    }
  })
    .composite([
      {
        input: innerBuffer,
        top: Math.round((512 - innerSize) / 2),
        left: Math.round((512 - innerSize) / 2)
      }
    ])
    .png()
    .toFile(path.resolve(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Created pwa-maskable-512x512.png');

  // 6. PWABuilder Required Screenshots (Desktop Wide & Mobile Narrow)
  // Wide Desktop Screenshot (1280x720)
  const desktopSvg = `
  <svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
    <rect width="1280" height="720" fill="#121212"/>
    <!-- Top Bar -->
    <rect width="1280" height="56" fill="#18181b" />
    <text x="40" y="36" fill="#f59e0b" font-family="system-ui, sans-serif" font-weight="bold" font-size="20">✝ ScriptureArc</text>
    <text x="200" y="35" fill="#a1a1aa" font-family="system-ui, sans-serif" font-size="14">Read · 63,779 Arcs Map · Ezekiel 3 · KJV</text>
    <!-- Cross Reference Rainbow Arc Header in Desktop -->
    <path d="M 140 380 C 140 100, 1140 100, 1140 380" fill="none" stroke="#ef4444" stroke-width="3" opacity="0.8"/>
    <path d="M 280 380 C 280 140, 1000 140, 1000 380" fill="none" stroke="#f59e0b" stroke-width="3" opacity="0.8"/>
    <path d="M 400 380 C 400 180, 880 180, 880 380" fill="none" stroke="#10b981" stroke-width="3" opacity="0.8"/>
    <path d="M 520 380 C 520 220, 760 220, 760 380" fill="none" stroke="#3b82f6" stroke-width="3" opacity="0.8"/>
    <line x1="100" y1="380" x2="1180" y2="380" stroke="#52525b" stroke-width="2"/>
    <!-- Scripture text -->
    <text x="640" y="440" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="32" font-weight="bold">Ezekiel 3</text>
    <text x="640" y="480" text-anchor="middle" fill="#d4d4d8" font-family="Georgia, serif" font-size="18">¹ Moreover he said unto me, Son of man, eat that thou findest; eat this roll...</text>
    <text x="640" y="520" text-anchor="middle" fill="#a1a1aa" font-family="system-ui, sans-serif" font-size="14">Connected to Revelation 10:9 · Jeremiah 15:16 · Psalm 119:103</text>
  </svg>
  `;
  await sharp(Buffer.from(desktopSvg))
    .png()
    .toFile(path.resolve(screenshotsDir, 'screenshot-desktop.png'));
  console.log('Created screenshot-desktop.png (wide)');

  // Narrow Mobile Screenshot (750x1334)
  const mobileSvg = `
  <svg width="750" height="1334" viewBox="0 0 750 1334" xmlns="http://www.w3.org/2000/svg">
    <rect width="750" height="1334" fill="#121212"/>
    <!-- Header -->
    <rect width="750" height="90" fill="#18181b"/>
    <text x="40" y="58" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="bold" font-size="28">ScriptureArc</text>
    <rect x="580" y="28" width="130" height="42" rx="21" fill="#27272a"/>
    <text x="645" y="55" text-anchor="middle" fill="#f59e0b" font-family="system-ui, sans-serif" font-weight="bold" font-size="18">KJV</text>
    <!-- Chapter Display -->
    <text x="375" y="180" text-anchor="middle" fill="#a1a1aa" font-family="system-ui, sans-serif" font-size="26">Ezekiel</text>
    <text x="375" y="270" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-weight="bold" font-size="80">3</text>
    <!-- Verses -->
    <text x="60" y="360" fill="#e4e4e7" font-family="Georgia, serif" font-size="26">¹ Moreover he said unto me, Son of man, eat that</text>
    <text x="60" y="405" fill="#e4e4e7" font-family="Georgia, serif" font-size="26">thou findest; eat this roll, and go speak unto the</text>
    <text x="60" y="450" fill="#e4e4e7" font-family="Georgia, serif" font-size="26">house of Israel.</text>
    <!-- Arc chart card -->
    <rect x="50" y="520" width="650" height="320" rx="24" fill="#18181b" stroke="#27272a" stroke-width="2"/>
    <text x="80" y="570" fill="#f59e0b" font-family="system-ui, sans-serif" font-weight="bold" font-size="20">63,779 Cross-References Arcs</text>
    <path d="M 100 760 C 100 620, 640 620, 640 760" fill="none" stroke="#ef4444" stroke-width="4"/>
    <path d="M 180 760 C 180 660, 560 660, 560 760" fill="none" stroke="#3b82f6" stroke-width="4"/>
    <line x1="80" y1="760" x2="660" y2="760" stroke="#3f3f46" stroke-width="2"/>
    <!-- Bottom Floating Audio Bar -->
    <rect x="150" y="1120" width="450" height="70" rx="35" fill="#27272a" stroke="#3f3f46" stroke-width="2"/>
    <circle cx="190" cy="1155" r="22" fill="#3f3f46"/>
    <text x="187" y="1162" fill="#ffffff" font-size="20">▶</text>
    <text x="385" y="1162" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-weight="bold" font-size="20">&lt; Ezekiel 3 &gt;</text>
  </svg>
  `;
  await sharp(Buffer.from(mobileSvg))
    .png()
    .toFile(path.resolve(screenshotsDir, 'screenshot-mobile.png'));
  console.log('Created screenshot-mobile.png (narrow)');

  console.log('All PWA assets generated successfully!');
}

generateAssets().catch(err => {
  console.error('Error generating PWA assets:', err);
  process.exit(1);
});
