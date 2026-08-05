const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'public', '_redirects');
const dest = path.join(__dirname, '..', 'dist', '_redirects');

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('Copied _redirects to dist');
} else {
  console.warn('_redirects not found in public/');
}
