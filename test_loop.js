const AutoEvolutionLoop = require('./src/auto-evolution-loop');
console.log('Module loaded');
const loop = new AutoEvolutionLoop({ state: {}, io: {}, diamondProtocol: {} }, { 
  systems: { test: 'system' }
});
console.log('Created:', loop.getStatus());