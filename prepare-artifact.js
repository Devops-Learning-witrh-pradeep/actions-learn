const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = __dirname;
const dockerArtifactDir = path.join(root, 'docker-artifact');

function log(msg) {
  console.log('[prepare-artifact] ' + msg);
}

async function rmDir(dir) {
  if (!fs.existsSync(dir)) return;
  log(`Removing ${dir}...`);
  await fs.promises.rm(dir, { recursive: true, force: true });
}

async function copy(src, dest) {
  const stat = await fs.promises.stat(src);
  if (stat.isDirectory()) {
    await fs.promises.mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src);
    for (const entry of entries) {
      await copy(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    await fs.promises.mkdir(path.dirname(dest), { recursive: true });
    await fs.promises.copyFile(src, dest);
  }
}

async function main() {
  try {
    // 1) Ensure production modules only (remove dev deps)
    log('Ensure production node_modules...');
    await rmDir(path.join(root, 'node_modules'));

    // Run: npm ci --omit=dev
    log('Running `npm ci --omit=dev`');
    execSync('npm ci --omit=dev', { stdio: 'inherit', cwd: root });

    // 2) Build static assets (cross-platform)
    log('Building static files (`npm run build`)');
    execSync('npm run build', { stdio: 'inherit', cwd: root });

    // 3) Prepare docker-artifact dir
    log('Creating docker-artifact dir');
    await rmDir(dockerArtifactDir);
    fs.mkdirSync(dockerArtifactDir, { recursive: true });

    // Copy runtime files
    const toCopy = ['server.js', 'package.json', 'package-lock.json'];
    for (const f of toCopy) {
      const src = path.join(root, f);
      if (fs.existsSync(src)) {
        log(`Copying ${f}`);
        await copy(src, path.join(dockerArtifactDir, f));
      }
    }

    // Copy dist and node_modules
    if (fs.existsSync(path.join(root, 'dist'))) {
      log('Copying dist/');
      await copy(path.join(root, 'dist'), path.join(dockerArtifactDir, 'dist'));
    }
    if (fs.existsSync(path.join(root, 'node_modules'))) {
      log('Copying node_modules/ (production)');
      await copy(path.join(root, 'node_modules'), path.join(dockerArtifactDir, 'node_modules'));
    }

    // Copy Dockerfile into artifact
    const dockerfileSrc = path.join(root, 'Dockerfile');
    if (fs.existsSync(dockerfileSrc)) {
      log('Copying Dockerfile');
      await copy(dockerfileSrc, path.join(dockerArtifactDir, 'Dockerfile'));
    }

    log('docker-artifact prepared successfully.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
