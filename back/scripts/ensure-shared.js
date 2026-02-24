const fs = require('fs');
const path = require('path');
const link = path.join(__dirname, '../node_modules/shared');
const target = path.resolve(__dirname, '../../node_modules/shared');
if (fs.existsSync(link)) return;
fs.mkdirSync(path.dirname(link), { recursive: true });
fs.symlinkSync(target, link, process.platform === 'win32' ? 'junction' : 'dir');
