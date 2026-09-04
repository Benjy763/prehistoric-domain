#!/usr/bin/env node

/**
 * Deploy the built VR scenes (dist/) to Cloudflare Pages via the wrangler
 * CLI. No new dependency — wrangler is a globally installed system binary
 * (`npm install -g wrangler`).
 *
 * Auth: `wrangler login` (OAuth, stored locally in ~/.wrangler — never in
 * this repo, and shared across projects on this machine).
 *
 * Usage: node deploy-pages.js [project-name]
 * The project name can also be set via CLOUDFLARE_PAGES_PROJECT.
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DIST_DIR = path.resolve(__dirname, 'dist');
const WORKER_SRC = path.resolve(__dirname, '_worker.js');

function assertBuilt() {
  if (!fs.existsSync(DIST_DIR) || fs.readdirSync(DIST_DIR).length === 0) {
    throw new Error(
      `${DIST_DIR} is missing or empty — run "npm run build:all" first`
    );
  }
}

function copyWorker() {
  // dist/ is wiped and rebuilt from scratch by build-all.js, so the custom
  // Worker (serves /assets/* from R2, same-origin — avoids the CORS/redirect
  // issues of a plain _redirects proxy) has to be re-copied in before every
  // deploy. Canonical source lives at the repo root, not inside dist/.
  fs.copyFileSync(WORKER_SRC, path.join(DIST_DIR, '_worker.js'));
}

function assertWranglerAuthenticated() {
  // `wrangler whoami` exits 0 even when logged out — it just prints a
  // message — so the auth state has to be read from stdout, not the exit code.
  const output = execFileSync('wrangler', ['whoami'], { encoding: 'utf8' });
  if (/not authenticated/i.test(output)) {
    throw new Error(
      'wrangler is not authenticated — run "wrangler login" first'
    );
  }
}

function deploy(projectName) {
  assertBuilt();
  assertWranglerAuthenticated();
  copyWorker();

  console.log(
    `Deploying ${DIST_DIR} to Cloudflare Pages project "${projectName}"...`
  );

  // --branch=main: force a production deployment regardless of whatever
  // git branch happens to be checked out locally. Without this, wrangler
  // infers the branch from the local repo and silently deploys to a
  // Preview environment (a different URL) if that isn't "main" — bit us
  // on the first deploy while the repo was on a feature branch.
  execFileSync(
    'wrangler',
    [
      'pages',
      'deploy',
      DIST_DIR,
      `--project-name=${projectName}`,
      '--branch=main'
    ],
    { stdio: 'inherit' }
  );
}

function main() {
  const projectName = process.argv[2] || process.env.CLOUDFLARE_PAGES_PROJECT;

  if (!projectName) {
    console.error(
      'Usage: node deploy-pages.js <project-name>\n(or set CLOUDFLARE_PAGES_PROJECT)'
    );
    process.exit(1);
  }

  try {
    deploy(projectName);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { deploy };
