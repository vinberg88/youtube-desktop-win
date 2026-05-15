const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = path.resolve(__dirname, '..');
const buildDir = path.join(root, 'build');
const appxDir = path.join(buildDir, 'appx');

fs.mkdirSync(buildDir, { recursive: true });
fs.mkdirSync(appxDir, { recursive: true });

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}

function writePng(file, w, h, pixels) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    for (let x = 0; x < w; x++) {
      const src = (y * w + x) * 4;
      const dst = y * (w * 4 + 1) + 1 + x * 4;
      raw[dst] = pixels[src];
      raw[dst + 1] = pixels[src + 1];
      raw[dst + 2] = pixels[src + 2];
      raw[dst + 3] = pixels[src + 3];
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);

  fs.writeFileSync(file, png);
}

function canvas(w, h) {
  const p = Buffer.alloc(w * h * 4);
  return { w, h, p };
}

function setPx(c, x, y, rgba) {
  x = Math.round(x); y = Math.round(y);
  if (x < 0 || y < 0 || x >= c.w || y >= c.h) return;
  const i = (y * c.w + x) * 4;
  const a = rgba[3] / 255;
  const ia = 1 - a;
  c.p[i] = Math.round(rgba[0] * a + c.p[i] * ia);
  c.p[i + 1] = Math.round(rgba[1] * a + c.p[i + 1] * ia);
  c.p[i + 2] = Math.round(rgba[2] * a + c.p[i + 2] * ia);
  c.p[i + 3] = Math.min(255, Math.round(rgba[3] + c.p[i + 3] * ia));
}

function fillRect(c, x, y, w, h, rgba) {
  for (let yy = Math.floor(y); yy < Math.ceil(y + h); yy++) {
    for (let xx = Math.floor(x); xx < Math.ceil(x + w); xx++) setPx(c, xx, yy, rgba);
  }
}

function fillRoundedRect(c, x, y, w, h, r, rgba) {
  const x2 = x + w;
  const y2 = y + h;
  for (let yy = Math.floor(y); yy < Math.ceil(y2); yy++) {
    for (let xx = Math.floor(x); xx < Math.ceil(x2); xx++) {
      const dx = xx < x + r ? x + r - xx : xx > x2 - r ? xx - (x2 - r) : 0;
      const dy = yy < y + r ? y + r - yy : yy > y2 - r ? yy - (y2 - r) : 0;
      if (dx * dx + dy * dy <= r * r) setPx(c, xx, yy, rgba);
    }
  }
}

function strokeRoundedRect(c, x, y, w, h, r, t, rgba) {
  fillRoundedRect(c, x, y, w, h, r, rgba);
  fillRoundedRect(c, x + t, y + t, w - 2 * t, h - 2 * t, Math.max(0, r - t), [0, 0, 0, 0]);
  // transparent punch-out is not supported by alpha blend; draw inner with card color handled by caller instead.
}

function fillCircle(c, cx, cy, r, rgba) {
  for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) {
    for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
      const dx = x - cx, dy = y - cy;
      if (dx * dx + dy * dy <= r * r) setPx(c, x, y, rgba);
    }
  }
}

function fillTriangle(c, p1, p2, p3, rgba) {
  const minX = Math.floor(Math.min(p1[0], p2[0], p3[0]));
  const maxX = Math.ceil(Math.max(p1[0], p2[0], p3[0]));
  const minY = Math.floor(Math.min(p1[1], p2[1], p3[1]));
  const maxY = Math.ceil(Math.max(p1[1], p2[1], p3[1]));
  const area = (a, b, c2) => (b[0] - a[0]) * (c2[1] - a[1]) - (b[1] - a[1]) * (c2[0] - a[0]);
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const p = [x, y];
      const a1 = area(p1, p2, p);
      const a2 = area(p2, p3, p);
      const a3 = area(p3, p1, p);
      if ((a1 >= 0 && a2 >= 0 && a3 >= 0) || (a1 <= 0 && a2 <= 0 && a3 <= 0)) setPx(c, x, y, rgba);
    }
  }
}

function drawBlockTD(c, x, y, s, rgba) {
  const u = s / 10;
  // T
  fillRect(c, x, y, u * 4.2, u * 1.25, rgba);
  fillRect(c, x + u * 1.45, y, u * 1.25, u * 6.8, rgba);
  // D
  const dx = x + u * 5.0;
  fillRect(c, dx, y, u * 1.15, u * 6.8, rgba);
  fillRect(c, dx, y, u * 2.55, u * 1.15, rgba);
  fillRect(c, dx, y + u * 5.65, u * 2.55, u * 1.15, rgba);
  fillRect(c, dx + u * 2.45, y + u * 1.0, u * 1.15, u * 4.8, rgba);
}

function makeAsset(w, h, withText = false) {
  const c = canvas(w, h);
  // background gradient
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const t = (x + y) / (w + h);
      const i = (y * w + x) * 4;
      c.p[i] = Math.round(8 + 18 * t);
      c.p[i + 1] = Math.round(10 + 18 * t);
      c.p[i + 2] = Math.round(20 + 44 * t);
      c.p[i + 3] = 255;
    }
  }

  const min = Math.min(w, h);
  const cx = w / 2;
  const cy = withText ? h * 0.39 : h * 0.50;
  const cardW = min * 0.70;
  const cardH = min * 0.54;
  const x = cx - cardW / 2;
  const y = cy - cardH / 2;
  const r = min * 0.075;

  fillRoundedRect(c, x + min * 0.025, y + min * 0.035, cardW, cardH, r, [0, 0, 0, 70]);
  fillRoundedRect(c, x, y, cardW, cardH, r, [27, 31, 56, 255]);
  fillRoundedRect(c, x + min * 0.012, y + min * 0.012, cardW - min * 0.024, cardH - min * 0.024, Math.max(1, r - min * 0.012), [24, 28, 50, 255]);

  const barH = cardH * 0.22;
  fillRoundedRect(c, x + min * 0.012, y + min * 0.012, cardW - min * 0.024, barH, Math.max(1, r - min * 0.012), [76, 88, 255, 255]);
  fillRect(c, x + min * 0.012, y + barH * 0.58, cardW - min * 0.024, barH * 0.45, [76, 88, 255, 255]);

  const dot = Math.max(2, min * 0.035);
  fillCircle(c, x + min * 0.09, y + barH * 0.52, dot / 2, [255, 92, 120, 255]);
  fillCircle(c, x + min * 0.15, y + barH * 0.52, dot / 2, [255, 205, 90, 255]);
  fillCircle(c, x + min * 0.21, y + barH * 0.52, dot / 2, [105, 230, 160, 255]);

  const tdS = min * 0.31;
  drawBlockTD(c, cx - tdS * 0.45, y + barH + (cardH - barH - tdS * 0.68) / 2, tdS, [248, 248, 255, 255]);
  fillTriangle(c, [cx + min * 0.18, cy + min * 0.02], [cx + min * 0.18, cy + min * 0.12], [cx + min * 0.27, cy + min * 0.07], [255, 82, 116, 255]);

  if (withText) {
    // simple underline-style brand mark below the icon; no font dependency
    const by = h * 0.78;
    fillRoundedRect(c, w * 0.25, by, w * 0.50, Math.max(3, min * 0.026), Math.max(2, min * 0.013), [248, 248, 255, 230]);
    fillRoundedRect(c, w * 0.34, by + min * 0.06, w * 0.32, Math.max(2, min * 0.018), Math.max(1, min * 0.009), [180, 185, 215, 210]);
  }

  return c.p;
}

function saveAsset(name, w, h, text = false) {
  const pixels = makeAsset(w, h, text);
  const appxTarget = path.join(appxDir, name);
  const rootTarget = path.join(buildDir, name);
  writePng(appxTarget, w, h, pixels);
  fs.copyFileSync(appxTarget, rootTarget);
  console.log(`${name} ${w}x${h}`);
}

saveAsset('icon.png', 1024, 1024, true);
saveAsset('StoreLogo.png', 50, 50, false);
saveAsset('Square44x44Logo.png', 44, 44, false);
saveAsset('Square150x150Logo.png', 150, 150, false);
saveAsset('Square310x310Logo.png', 310, 310, true);
saveAsset('Wide310x150Logo.png', 310, 150, false);
saveAsset('SplashScreen.png', 620, 300, true);

const scales = [100, 125, 150, 200, 400];
const bases = {
  StoreLogo: [50, 50, false],
  Square44x44Logo: [44, 44, false],
  Square150x150Logo: [150, 150, false],
  Square310x310Logo: [310, 310, true],
  Wide310x150Logo: [310, 150, false],
};

for (const [base, [bw, bh, text]] of Object.entries(bases)) {
  for (const scale of scales) {
    saveAsset(`${base}.scale-${scale}.png`, Math.round(bw * scale / 100), Math.round(bh * scale / 100), text);
  }
}

console.log(`Generated TubeDesk AppX assets in ${buildDir}`);
