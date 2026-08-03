const fs = require('fs');
const p = require('path');
const root = 'C:/Users/hp/javspt/e-board/node_modules/react-native-web/src';
const hits = [];
const needles = ['onMouseEnter', 'onMouseLeave', 'onHoverIn', 'onHoverOut', 'hovered', 'Hoverable'];
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const full = p.join(d, e.name);
    if (e.isDirectory()) walk(full);
    else {
      const c = fs.readFileSync(full, 'utf8');
      for (const n of needles) if (c.includes(n)) { hits.push(full.replace(root, '') + ' :: ' + n); break; }
    }
  }
}
walk(root);
console.log(hits.join('\n'));
