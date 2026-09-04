#!/usr/bin/env node

/**
 * Sync assets/ (2+ GB, files up to ~85 MB — over Cloudflare Pages' 25 MB
 * per-file limit) to a Cloudflare R2 bucket via `rclone`. Incremental: only
 * changed files are re-uploaded on subsequent runs.
 *
 * No persisted rclone config file — credentials are passed as environment
 * variables to rclone's "on the fly" S3-compatible remote (`:s3:bucket`),
 * read here from .env.r2 (gitignored, never committed) or process.env:
 *   R2_ACCOUNT_ID
 *   R2_ACCESS_KEY_ID
 *   R2_SECRET_ACCESS_KEY
 *
 * Generate these in the Cloudflare dashboard: R2 → Manage R2 API Tokens →
 * Create API Token (Object Read & Write, scoped to the bucket).
 *
 * Usage: node sync-assets-r2.js <bucket-name> [assets-dir]
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function readEnvFile() {
  const envPath = path.resolve(__dirname, '.env.r2');
  if (!fs.existsSync(envPath)) return {};

  const vars = {};
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (match) vars[match[1]] = match[2];
  }
  return vars;
}

function getR2Credentials() {
  const fileVars = readEnvFile();
  const accountId = process.env.R2_ACCOUNT_ID || fileVars.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID || fileVars.R2_ACCESS_KEY_ID;
  const secretAccessKey =
    process.env.R2_SECRET_ACCESS_KEY || fileVars.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'Missing R2 credentials — set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY ' +
        'in .env.r2 (gitignored) or the environment. Generate them in the Cloudflare ' +
        'dashboard: R2 → Manage R2 API Tokens.'
    );
  }
  return { accountId, accessKeyId, secretAccessKey };
}

function assertRcloneAvailable() {
  try {
    execFileSync('rclone', ['version'], { stdio: 'ignore' });
  } catch (error) {
    throw new Error('rclone not found — install with `brew install rclone`');
  }
}

function syncAssets(bucketName, assetsDir) {
  assertRcloneAvailable();
  const { accountId, accessKeyId, secretAccessKey } = getR2Credentials();

  if (!fs.existsSync(assetsDir)) {
    throw new Error(`Assets directory not found: ${assetsDir}`);
  }

  // The built JS expects assets under an "assets/" prefix on whatever host
  // ASSET_PREFIX points to (html-require-loader.js rewrites "/assets/..."
  // to "<prefix>assets/..."), so the bucket needs that same "assets/"
  // subpath — syncing straight to the bucket root produces 404s.
  const destination = `:s3:${bucketName}/assets`;
  console.log(`Syncing ${assetsDir} -> R2 bucket "${bucketName}/assets"...`);

  execFileSync(
    'rclone',
    [
      'sync',
      assetsDir,
      destination,
      '--progress',
      '--s3-provider=Cloudflare',
      '--s3-env-auth=false',
      '--checksum'
    ],
    {
      stdio: 'inherit',
      env: {
        ...process.env,
        RCLONE_S3_ACCESS_KEY_ID: accessKeyId,
        RCLONE_S3_SECRET_ACCESS_KEY: secretAccessKey,
        RCLONE_S3_ENDPOINT: `https://${accountId}.r2.cloudflarestorage.com`,
        RCLONE_S3_REGION: 'auto'
      }
    }
  );
}

function main() {
  const bucketName = process.argv[2];
  const assetsDir = process.argv[3] || path.resolve(__dirname, 'assets');

  if (!bucketName) {
    console.error('Usage: node sync-assets-r2.js <bucket-name> [assets-dir]');
    process.exit(1);
  }

  try {
    syncAssets(bucketName, assetsDir);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { syncAssets };
