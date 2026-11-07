const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Building VokabelStar Standalone Desktop App (100% Native Rust) ===');

const baseDir = __dirname;
const htmlPath = path.join(baseDir, 'index.html');
const cssPath = path.join(baseDir, 'styles.css');
const i18nPath = path.join(baseDir, 'i18n.js');
const xlsxPath = path.join(baseDir, 'xlsx.full.min.js');
const mammothPath = path.join(baseDir, 'mammoth.browser.min.js');
const appJsPath = path.join(baseDir, 'app.js');
const outHtmlPath = path.join(baseDir, 'VokabelStar_App.html');

console.log('1. Reading source files...');
let html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const i18n = fs.readFileSync(i18nPath, 'utf8');
const xlsx = fs.readFileSync(xlsxPath, 'utf8');
const mammoth = fs.readFileSync(mammothPath, 'utf8');
const appJs = fs.readFileSync(appJsPath, 'utf8');

console.log('2. Inlining styles...');
html = html.replace(
  /<link\s+rel=["']stylesheet["']\s+href=["']styles\.css(?:\?v=\d+)?["']\s*\/?>/i,
  () => `<style>\n${css}\n</style>`
);

console.log('3. Inlining header scripts (i18n, xlsx, mammoth)...');
const headScripts = `<script>\n${i18n}\n</script>\n<script>\n${xlsx}\n</script>\n<script>\n${mammoth}\n</script>`;
html = html.replace(
  /<!-- i18n Internationalization & Device Language Detection -->[\s\S]*?<script src="mammoth\.browser\.min\.js"><\/script>/i,
  () => headScripts
);

console.log('4. Inlining app.js...');
html = html.replace(
  /<script src="app\.js(?:\?v=\d+)?"><\/script>/i,
  () => `<script>\n${appJs}\n</script>`
);

fs.writeFileSync(outHtmlPath, html, 'utf8');
console.log(`✅ VokabelStar_App.html generated (${(fs.statSync(outHtmlPath).size / 1024 / 1024).toFixed(2)} MB).`);

console.log('5. Compiling VokabelStar.exe via Cargo (Rust)...');
execSync('cargo build --release', { cwd: baseDir, stdio: 'inherit' });
const builtExe = path.join(baseDir, 'target', 'release', 'VokabelStar.exe');
const outExePath = path.join(baseDir, 'VokabelStar.exe');
fs.copyFileSync(builtExe, outExePath);
console.log(`✅ VokabelStar.exe successfully compiled in Rust! Size: ${(fs.statSync(outExePath).size / 1024 / 1024).toFixed(2)} MB.`);
