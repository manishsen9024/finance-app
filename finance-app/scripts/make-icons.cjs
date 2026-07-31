/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require("sharp");

async function makeIcon(size, file) {
  const svg = `
  <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#4f46e5"/>
        <stop offset="50%" stop-color="#7c3aed"/>
        <stop offset="100%" stop-color="#d946ef"/>
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="url(#g)"/>
    <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.30}" fill="none" stroke="white" stroke-width="${size * 0.055}"/>
    <path d="M${size * 0.5} ${size * 0.32} v${size * 0.36} M${size * 0.42} ${size * 0.42} h${size * 0.10} a${size * 0.045} ${size * 0.045} 0 0 1 0 ${size * 0.09} h-${size * 0.045} a${size * 0.045} ${size * 0.045} 0 0 0 0 ${size * 0.09} h${size * 0.10}"
        stroke="white" stroke-width="${size * 0.045}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(file);
  console.log("wrote", file);
}

(async () => {
  await makeIcon(192, "public/icons/icon-192.png");
  await makeIcon(512, "public/icons/icon-512.png");
  await makeIcon(180, "public/icons/apple-icon.png");
})().catch((e) => { console.error(e); process.exit(1); });