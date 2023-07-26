const config = require("./Config");

class Environment {

  constructor() {

    this.simbolos = config.simbolos;
    this.raioAudicao = config.raioAudicao;
    this.raioVisao = config.raioVisao;
    this.envMaxX = config.envMaxX;
    this.envMaxY = config.envMaxY;
    this.nMacacos = config.nMacacos;
    this.nPredadores = config.nPredadores;

    this.mapMatrix = [];
    this.macacos = [];
    this.predadores = [];


    for (let i = 0; i < config.envMaxX; i++) {
      this.mapMatrix[i] = [];
      this.mapMatrix[i].length = config.envMaxY;
      for (let j = 0; j < config.envMaxY; j++) {
        this.mapMatrix[i][j] = null;
      }
    }
  }

  static mostrarMapa() {
    this.mapMatrix.forEach((linha) => {
      linha.forEach((celula) => {
        process.stdout.write((celula ? celula.nome : "  ") + "|");
      });
      console.log("");
    });


  }
}

module.exports = Environment;
