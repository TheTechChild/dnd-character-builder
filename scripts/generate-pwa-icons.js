import sharp from 'sharp';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [64, 192, 512];
const publicDir = join(__dirname, '..', 'public');

async function generateIcons() {
  const svgBuffer = await fs.readFile(join(publicDir, 'd20-icon.svg'));
  
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(publicDir, `pwa-${size}x${size}.png`));
    
    console.log(`Generated pwa-${size}x${size}.png`);
  }
  
  // Generate maskable icon with safe area padding
  await sharp(svgBuffer)
    .resize(512, 512)
    .extend({
      top: 64,
      bottom: 64,
      left: 64,
      right: 64,
      background: '#4f46e5'
    })
    .resize(512, 512)
    .png()
    .toFile(join(publicDir, 'maskable-icon-512x512.png'));
  
  console.log('Generated maskable-icon-512x512.png');
  
  // Generate apple-touch-icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));
  
  console.log('Generated apple-touch-icon.png');
  
  // Generate favicon
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(join(publicDir, 'favicon.ico'));
  
  console.log('Generated favicon.ico');
}

generateIcons().catch(console.error);