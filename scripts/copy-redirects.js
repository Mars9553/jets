const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const distDir = path.join(__dirname, '..', 'dist');

function copyFile(src, dest) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${path.basename(src)} to dist`);
  } else {
    console.warn(`${path.basename(src)} not found in public/`);
  }
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`${path.basename(src)} not found in public/`);
    return;
  }
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  console.log(`Copied ${path.basename(src)} to dist`);
}

copyFile(path.join(publicDir, '_redirects'), path.join(distDir, '_redirects'));
copyFile(path.join(publicDir, 'sw.js'), path.join(distDir, 'sw.js'));
copyFile(path.join(publicDir, 'manifest.json'), path.join(distDir, 'manifest.json'));
copyDir(path.join(publicDir, 'icons'), path.join(distDir, 'icons'));
