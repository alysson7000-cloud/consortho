const os = require('os');
const path = require('path');
console.log('os.homedir():', os.homedir());
console.log('SAVE path:', path.join(os.homedir(), 'estudio_criacao/consortho/estado.json'));
console.log('Exists:', require('fs').existsSync(path.join(os.homedir(), 'estudio_criacao/consortho/estado.json')));