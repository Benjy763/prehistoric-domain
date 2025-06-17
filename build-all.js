const { exec } = require('child_process');

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

mainscenes.forEach((mainScene) =>
  exec(`npm run build --mainscene=${mainScene} --assetprefix=${assetPrefix}`)
);
