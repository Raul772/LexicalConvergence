const Position = require("./Position");

class Agente {
  static systemConfig;

  constructor(environment, systemConfig) {
    Agente.systemConfig = systemConfig;

    // Definição randomica de coordenadas para spawn do agente
    let x, y;

    do {
      x = Math.floor(Math.random() * Agente.systemConfig.envMaxX);
      y = Math.floor(Math.random() * Agente.systemConfig.envMaxY);
    } while (environment.mapMatrix[x][y]);

    // Criação de um objeto representando a posição
    this.position = new Position(x, y);

    // inserção do Agente na matriz ambiente
    environment.mapMatrix[x][y] = this;
  }

  mover(environment) {
    let x,
      y,
      nextPosition = new Position();
    do {
      //Definição randomica de novas posições para o agente
      x = Math.floor(Math.random() * Agente.systemConfig.envMaxX);
      y = Math.floor(Math.random() * Agente.systemConfig.envMaxY);
      // criação do objeto posição que representa a próxima posição do agente
      nextPosition.x = x;
      nextPosition.y = y;
    } while (
      // o código acima se repetirá até que seja encontrada um posição disponível
      // interrompe a procura de uma posição livre caso a posição esteja disponível (null)
      environment.mapMatrix[nextPosition.x][nextPosition.y]
    );

    // libera a posição atual e se posiciona na nova
    environment.mapMatrix[this.position.x][this.position.y] = null;
    environment.mapMatrix[nextPosition.x][nextPosition.y] = this;

    // guarda na memória sua posição após o movimento
    this.position = nextPosition;
  }
}

module.exports = Agente;
