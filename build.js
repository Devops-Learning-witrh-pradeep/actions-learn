const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'public');
const outDir = path.join(__dirname, 'dist');

async function copyDir(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

(async () => {
  try {
    if (fs.existsSync(outDir)) {
      await fs.promises.rm(outDir, { recursive: true, force: true });
    }
    await copyDir(srcDir, outDir);
    console.log('Build complete: dist/ created');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
