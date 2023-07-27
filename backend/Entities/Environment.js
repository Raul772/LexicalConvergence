
class Environment {
  
  static systemConfig;

  constructor(systemConfig) {

    this.mapMatrix = [];
    this.macacos = [];
    this.predadores = [];
    Environment.systemConfig = systemConfig;

    for (let i = 0; i < Environment.systemConfig.envMaxX; i++) {
      this.mapMatrix[i] = [];
      this.mapMatrix[i].length = Environment.systemConfig.envMaxY;
      for (let j = 0; j < Environment.systemConfig.envMaxY; j++) {
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
