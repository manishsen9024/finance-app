/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require("sharp");

async function makeMaskable(size, file) {
  const svg = `
  <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#4f46e5"/>
        <stop offset="50%" stop-color="#7c3aed"/>
        <stop offset="100%" stop-color="#d946ef"/>
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" fill="url(#g)"/>
    <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.22}" fill="none" stroke="white" stroke-width="${size * 0.05}"/>
    <path d="M${size * 0.5} ${size * 0.40} v${size * 0.20} M${size * 0.44} ${size * 0.46} h${size * 0.08} a${size * 0.035} ${size * 0.035} 0 0 1 0 ${size * 0.07} h-${size * 0.035} a${size * 0.035} ${size * 0.035} 0 0 0 0 ${size * 0.07} h${size * 0.08}"
        stroke="white" stroke-width="${size * 0.04}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(file);
  console.log("wrote", file);
}

(async () => {
  await makeMaskable(512, "public/icons/icon-512-maskable.png");
  await makeMaskable(192, "public/icons/icon-192-maskable.png");
})().catch((e) => { console.error(e); process.exit(1); });