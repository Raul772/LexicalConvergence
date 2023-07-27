const Agente = require("./Agente");

class Predador extends Agente{

  static totalPredadores = 0;

  constructor(environment, systemConfig){
    super(environment, systemConfig);
    this.index = Predador.totalPredadores;
    Predador.totalPredadores += 1;
    this.nome = ("P" + Predador.totalPredadores);
  }
}

module.exports = Predador;
