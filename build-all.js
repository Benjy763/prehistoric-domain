const { execFileSync } = require('child_process');

const mainscenes = [
  'tour',
  'aviary',
  'lagoon',
  'cretaceousLagoon',
  'sarco',
  'spino',
  'dimetrodon',
  'quetza',
  'trex',
  'edmon',
  'deino',
  'deinocheirus',
  'mammoth',
  'home',
  'gallery'
];

const assetPrefix = process.env.npm_config_assetprefix || '';
console.log(`assetPrefix: ${assetPrefix}`);

// Sequential + synchronous: the previous version used exec() without waiting
// for completion, so `npm run build:all` returned success immediately while
// the 15 builds were still running (or had silently failed) in the
// background — a caller chaining a deploy step right after could upload an
// incomplete dist/. execFileSync blocks until each build finishes and
// throws on a non-zero exit code, so a failed scene stops the whole run.
const failed = [];

for (const mainScene of mainscenes) {
  console.log(`\nBuilding scene: ${mainScene}`);
  try {
    execFileSync(
      'npm',
      [
        'run',
        'build',
        `--mainscene=${mainScene}`,
        `--assetprefix=${assetPrefix}`
      ],
      { stdio: 'inherit' }
    );
  } catch (error) {
    failed.push(mainScene);
  }
}

if (failed.length > 0) {
  console.error(`\nFailed scenes: ${failed.join(', ')}`);
  process.exit(1);
}

console.log(`\nAll ${mainscenes.length} scenes built successfully.`);
