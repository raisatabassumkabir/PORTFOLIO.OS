import fs from 'fs';
import path from 'path';

const dirs = [
  'public/assets/portrait',
  'public/assets/projects',
  'public/assets/icons',
  'public/resume'
];

dirs.forEach(d => {
  const full = path.join(process.cwd(), d);
  if (!fs.existsSync(full)) {
    fs.mkdirSync(full, { recursive: true });
  }
});

const brainDir = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\11905e31-72b6-4af8-ae12-b20ede14191c';

const mappings = [
  { src: 'portrait_base_1792011643025.jpg', dest: 'public/assets/portrait/portrait-base.png' },
  { src: 'portrait_cyber_1792011667522.jpg', dest: 'public/assets/portrait/portrait-cyber.png' },
  { src: 'project_lets_ryde_1792011694622.jpg', dest: 'public/assets/projects/lets-ryde.png' },
  { src: 'project_mia_1792011717513.jpg', dest: 'public/assets/projects/mia.png' },
  { src: 'project_saif_1792011739748.jpg', dest: 'public/assets/projects/saif-locators.png' }
];

mappings.forEach(m => {
  const srcPath = path.join(brainDir, m.src);
  const destPath = path.join(process.cwd(), m.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${m.src} -> ${m.dest}`);
  } else {
    console.warn(`Source not found: ${srcPath}`);
  }
});
