const { exec } = require('child_process');

const mainscenes = ['tour', 'aviary', 'lagoon', 'cinema', 'sarco', 'spino'];
mainscenes.forEach((mainScene) =>
  exec(`npm run build:scene --mainscene=${mainScene}`)
);
