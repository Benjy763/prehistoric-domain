const { exec } = require('child_process');

const mainscenes = [
  'tour',
  'aviary',
  'lagoon',
  'sarco',
  'spino',
  'dimetrodon',
  'quetza',
  'trex',
  'edmon',
  'deino',
  'home',
];
mainscenes.forEach((mainScene) =>
  exec(`npm run build:scene --mainscene=${mainScene}`)
);
