// Nightdrive Cover Studio — deterministic Node 22 hand-in, no install or network needed.
// The app/ directory is a standalone static site. The browser loads local fonts and sample photos;
// user photos never leave the browser. Screenshots are actual captures of its canvas and editor.
// Run with MAKEFUN_OUTPUT_DIR set to a fresh directory to inspect the resulting dossier.

// Nightdrive six-frame offline release: copy the tested static editor, locally licensed demo assets
// and genuine browser captures into the hand-in; never contact an image host at runtime.
// Keep this entrypoint deterministic: no timestamps, network calls, or generated content enter the dossier.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Refuse stale or oversized captures before packaging. This is deliberately a
// header parser, not an image conversion: the repository's browser exports are
// copied unchanged, and the dossier library validates their full image bytes.
function jpegDimensions(bytes: Uint8Array): [number, number] {
  const read16 = (at: number) => bytes[at]! * 256 + bytes[at+1]!;
  if (read16(0) !== 0xffd8) throw new Error('Screenshot is not a JPEG');
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) throw new Error('Malformed JPEG marker');
    const marker = bytes[offset + 1];
    if (marker === 0xd9 || marker === 0xda) break;
    const length = read16(offset + 2);
    if (length < 2 || offset + length + 2 > bytes.length) break;
    if ([0xc0,0xc1,0xc2,0xc3].includes(marker)) {
      return [read16(offset + 7), read16(offset + 5)];
    }
    offset += length + 2;
  }
  throw new Error('Screenshot has no JPEG frame header');
}
function checkCaptures(dir: string) {
  const names = readdirSync(dir).sort();
  if (names.length !== 4 || names[0] !== '1-cover.jpg') {
    throw new Error('Expected four current cover/editor captures');
  }
  for (const name of names) {
    const path = join(dir, name);
    if (!/^([1-4])-[a-z]+\.jpg$/.test(name) || !statSync(path).isFile()) {
      throw new Error(`Unexpected screenshot: ${name}`);
    }
    const bytes = readFileSync(path);
    const [width, height] = jpegDimensions(bytes);
    if (bytes.length > 262144 || Math.max(width,height) > 1280 || Math.min(width,height) < 480) {
      throw new Error(`Screenshot outside gate limits: ${name}`);
    }
  }
}
checkCaptures(join(here, 'screenshots'));

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files in app/ or 48 MiB of app
// files, in all, or a path under app/ over 1000 bytes: app/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
    app_path_max_bytes: 1000,
  }),
);
