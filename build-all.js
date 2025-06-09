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
mainscenes.forEach((mainScene) =>
  exec(`npm run build:scene --mainscene=${mainScene}`)
);
