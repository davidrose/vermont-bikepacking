const { execSync } = require('child_process');
const uri = 'file:///Users/davidrose/.gemini/antigravity/playground/crystal-filament/index.html';
const cmd = `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --dump-dom "${uri}" 2>&1`;
try {
  const out = execSync(cmd, { shell: true, encoding: 'utf8' });
  console.log('Out length:', out.length);
} catch (e) {
  console.error('Failed:', e.message);
}
