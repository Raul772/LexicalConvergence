const Agente = require("./Agente");
const Table = require("./Table");
const Predador = require("./Predador");


class Macaco extends Agente {
  static totalMacacos = 0;
  static taxaAprendizado = 0.0005;
  static systemConfig;

  constructor(environment, systemConfig) {
    super(environment, systemConfig);
    Macaco.systemConfig = systemConfig;
    Macaco.totalMacacos += 1;
    this.nome = "M" + Macaco.totalMacacos;
    this.table = new Table(systemConfig);
    this.populateTable();
  }

  populateTable() {
    for (let i = 0; i < Macaco.systemConfig.simbolos; i++) {
      for (let j = 0; j < Macaco.systemConfig.nPredadores; j++) {
        this.table.actualtable[i][j] = (Math.random() * 90) / 100;
      }
    }
  }

  verificarVizinhanca(environment) {
    let iCheck;
    let jCheck;

    let i = Macaco.systemConfig.envMaxX - Macaco.systemConfig.raioVisao;
    let j = Macaco.systemConfig.envMaxY - Macaco.systemConfig.raioVisao;

    for (i; i < Macaco.systemConfig.envMaxX + Macaco.systemConfig.raioVisao; i++) {
      if (i >= Macaco.systemConfig.envMaxX) {
        iCheck = i - Macaco.systemConfig.envMaxX;
      } else if (i < 0) {
        iCheck = i + Macaco.systemConfig.envMaxX;
      } else {
        iCheck = i;
      }

      for (j; j < Macaco.systemConfig.envMaxY + Macaco.systemConfig.raioVisao; j++) {
        if (j >= Macaco.systemConfig.envMaxY) {
          jCheck = j - Macaco.systemConfig.envMaxY;
        } else if (j < 0) {
          jCheck = j + Macaco.systemConfig.envMaxY;
        } else {
          jCheck = j;
        }

        if (
          environment.mapMatrix[iCheck][jCheck] &&
          environment.mapMatrix[iCheck][jCheck] != this
        ) {
          if (environment.mapMatrix[iCheck][jCheck] instanceof Predador) {
            return environment.mapMatrix[iCheck][jCheck];
          }
        }
      }
    }
    return null;
  }

  sinalizar(predador, environment) {
    let maior = 0.0;
    let indexSymbol = 0;
    let indexPredador = 0;

    // Identificando o predador avistado no array de predadores do Ambiente
    for (let i = 0; i < Macaco.systemConfig.nPredadores; i++) {
      if (environment.predadores[i] == predador) {
        indexPredador = i;
      }
    }

    // Procurando qual simbolo(para este macaco) tem a maior probalidade para representar esse predador
    for (let i = 0; i < Macaco.systemConfig.simbolos; i++) {
      if (this.table.actualtable[i][indexPredador] >= maior) {
        maior = this.table.actualtable[i][indexPredador];
        indexSymbol = i;
      }
    }

    let iCheck;
    let jCheck;

    for (
      let i = this.position.x - Macaco.systemConfig.raioAudicao;
      i <= this.position.x + Macaco.systemConfig.raioAudicao;
      i++
    ) {
      // correção das coordenadas para a verificação caso estejam out of boundaries
      if (i >= Macaco.systemConfig.envMaxX) {
        iCheck = i - Macaco.systemConfig.envMaxX;
      } else if (i < 0) {
        iCheck = i + Macaco.systemConfig.envMaxX;
      } else {
        iCheck = i;
      }

      for (
        let j = this.position.y - Macaco.systemConfig.raioAudicao;
        j <= this.position.y + Macaco.systemConfig.raioAudicao;
        j++
      ) {
        // correção das coordenadas para a verificação caso estejam out of boundaries
        if (j >= Macaco.systemConfig.envMaxY) {
          jCheck = j - Macaco.systemConfig.envMaxY;
        } else if (j < 0) {
          jCheck = j + Macaco.systemConfig.envMaxY;
        } else {
          jCheck = j;
        }

        // Verificando se há macaco na área de sinalização e se é este próprio
        if (
          environment.mapMatrix[iCheck][jCheck] != null &&
          environment.mapMatrix[iCheck][jCheck] instanceof Macaco
        ) {
          if (environment.mapMatrix[iCheck][jCheck] != this) {
            // Guardando o macaco encontrado na área de sinalização na memória
            let macacoEmArea = environment.mapMatrix[iCheck][jCheck];

            // fazendo com que o macaco encontrado na área de sinalização verifique sua vizinhança por predadores
            let predadorVisto = macacoEmArea.verificarVizinhanca(environment);

            // caso o macaco na área de sinalização tenha encontrado um predador
            if (predadorVisto != null) {
              macacoEmArea.aprender(indexSymbol, indexPredador);
            }
          }
        }
      }
    }
  }

  aumentarProbabilidadeSimbolo(probabilidade) {
    // somar a probabilidade já existente com a taxa de aprendizado definida
    return probabilidade + Macaco.taxaAprendizado;
  }

  logTable(environment) {
    console.log("\n\tMacaco: " + this.nome + "\n\n\t");

    process.stdout.write(".");
    environment.predadores.forEach((predador) => {
      process.stdout.write("\t" + predador.nome);
    });

    console.log("");

    for (let i = 0; i < Macaco.systemConfig.simbolos; i++) {
      process.stdout.write("S" + (i + 1) + "\t");
      for (let j = 0; j < Macaco.systemConfig.nPredadores; j++) {
        process.stdout.write(
          `${Number(this.table.actualtable[i][j]).toFixed(2)}\t`
        );
      }
      console.log("");
    }
  }

  mover(environment) {
    super.mover(environment);

    let predador = this.verificarVizinhanca(environment);

    if (predador) {
      this.sinalizar(predador, environment);
    }
  }

  aprender(indexSymbol, indexPredador) {
    // nova probalidade de uso do simbolo escutado calculada e aumentada para o predador visto
    this.table.actualtable[indexSymbol][indexPredador] =
      this.aumentarProbabilidadeSimbolo(
        this.table.actualtable[indexSymbol][indexPredador]
      );


    // Pegando um vetor de maior simbolo por predador (para este macaco)
    let mSimbAux = [];
    for (let predador = 0; predador < Macaco.systemConfig.nPredadores; predador++) {
      let probAux = 0;
      for (let simbolo = 0; simbolo < Macaco.systemConfig.simbolos; simbolo++) {
        if (this.table.actualtable[simbolo][predador] > probAux) {
          mSimbAux[predador] = simbolo;
          probAux = this.table.actualtable[simbolo][predador];
        }
      }
    }
    // Analisar se teve convegência de 2 predadores para o mesmo simbolo
    let simbConflitante = -1, predadorConflitante = -1;
    mSimbAux.forEach((simbolo, predador) => {
      if (mSimbAux.indexOf(simbolo, predador + 1) != -1) {
        simbConflitante = simbolo;
        predadorConflitante = predador;
      }
    });

    // se houve conflito, corrigir
    if (simbConflitante != -1) {
      this.table.actualtable[simbConflitante][predadorConflitante] -= 0.0005;
    }
  }
}

module.exports = Macaco;
