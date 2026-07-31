import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makePng(width, height) {
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const ihdrChunk = makeChunk('IHDR', ihdrData);

  const lineLength = width * 4 + 1;
  const rawData = Buffer.alloc(height * lineLength);

  for (let y = 0; y < height; y++) {
    const lineStart = y * lineLength;
    rawData[lineStart] = 0; // Filter type None
    for (let x = 0; x < width; x++) {
      const idx = lineStart + 1 + x * 4;
      const dx = x - width / 2;
      const dy = y - height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const crossHorizontal = Math.abs(dy) < height * 0.12 && Math.abs(dx) < width * 0.35;
      const crossVertical = Math.abs(dx) < width * 0.12 && Math.abs(dy) < height * 0.35;

      if (crossHorizontal || crossVertical) {
        // White cross
        rawData[idx] = 255;
        rawData[idx + 1] = 255;
        rawData[idx + 2] = 255;
        rawData[idx + 3] = 255;
      } else if (dist < width * 0.45) {
        // Medical Cyan/Blue background
        rawData[idx] = 14;
        rawData[idx + 1] = 116;
        rawData[idx + 2] = 144;
        rawData[idx + 3] = 255;
      } else {
        rawData[idx] = 0;
        rawData[idx + 1] = 0;
        rawData[idx + 2] = 0;
        rawData[idx + 3] = 0;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const crcBuf = buf.subarray(4, 8 + len);
  const crcVal = crc32(crcBuf);
  buf.writeUInt32BE(crcVal, 8 + len);
  return buf;
}

const iconsDir = path.join(process.cwd(), 'src-tauri', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

fs.writeFileSync(path.join(iconsDir, '32x32.png'), makePng(32, 32));
fs.writeFileSync(path.join(iconsDir, '128x128.png'), makePng(128, 128));
fs.writeFileSync(path.join(iconsDir, '128x128@2x.png'), makePng(256, 256));
fs.writeFileSync(path.join(iconsDir, 'icon.png'), makePng(512, 512));
fs.writeFileSync(path.join(iconsDir, 'icon.ico'), makePng(128, 128));
fs.writeFileSync(path.join(iconsDir, 'icon.icns'), makePng(128, 128));

console.log('Successfully generated Tauri icons in src-tauri/icons/');
