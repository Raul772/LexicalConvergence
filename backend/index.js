const Environment = require("./Entities/Environment");
const Sistema = require("./Entities/Sistema");

const sistema = new Sistema();

let results = sistema.inicializar();

sistema.logMacacos();
console.log(results.totalIterations, " Iterações até a convergência.");
console.log(results.cicleDataTable);



module.exports = {};
