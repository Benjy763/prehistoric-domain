const { exec } = require('child_process');

const mainscenes = ['tour', 'aviary', 'lagoon', 'cinema', 'swamp'];
mainscenes.forEach((mainScene) =>
  exec(`npm run build:scene --mainscene=${mainScene}`)
);
