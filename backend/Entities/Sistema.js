const Config = require("./Config");

const Environment = require("./Environment");
const Macaco = require("./Macaco");
const Predador = require("./Predador");



class Sistema {
  constructor() {
    this.cicleData = [];
    this.cicle = 0;
  }

  go() {

    this.iterar(Config.nIteracao);
    let convergencia = this.convergiu();

    return convergencia;
  }

  inicializar(Bwindow) {
    this.cicle = 0;
    Macaco.totalMacacos = 0;
    Predador.totalPredadores = 0;
    this.environment = new Environment();

    for (let i = 0; i < Config.nMacacos; i++) {
      this.environment.macacos[i] = new Macaco(this.environment);
    }

    for (let i = 0; i < Config.nPredadores; i++) {
      this.environment.predadores[i] = new Predador(this.environment);
    }

    let convergencia = false;
    do {
      convergencia = this.go();
      this.cicle += 1;

      if (Config.animation) {        
        // enviar frames de animação do ambiente para o frontend a cada ciclo
        Bwindow.webContents.send("frameUpdate", this.createAnimationFrame());
      }

    } while (!convergencia);

    return {
      totalIterations: this.cicle * Config.nIteracao,
      cicleDataTable: this.cicleData
    }
  }

  iterar(vezes) {
    for (let i = 0; i < vezes; i++) {
      this.proximoPasso();
      // if (i % 50 === 0) {
      //   Environment.mostrarMapa();
      //   process.stdout.write('\x1Bc');
      // }
    }

    if (Config.saveCicleData) {
      this.saveCicleData();
    }
    

  }

  proximoPasso() {
    this.environment.macacos.forEach((macaco) => {
      macaco.mover(this.environment);
    });
    this.environment.predadores.forEach((predador) => {
      predador.mover(this.environment);
    });
  }

  logMacacos() {
    this.environment.macacos.forEach((macaco) => {
      macaco.logTable(this.environment);
      console.log(
        "\n--------------------------------------------------------------------------\n"
      );
    });
  }

  convergiu() {
    let convergencia = [];

    for (let i = 0; i < Config.nPredadores; i++) {
      convergencia[i] = -1;
    }

    let auxMacaco = 0;
    
    // Para o primeiro macaco, qual o simbolo que tem a maior probabilidade para cada predador
    for (let predador = 0; predador < Config.nPredadores; predador++) {
      let probAux = 0;
      for (let simbolo = 0; simbolo < Config.simbolos; simbolo++) {
        if (
          this.environment.macacos[auxMacaco].table.actualtable[simbolo][predador] > probAux
        ) {
          convergencia[predador] = simbolo;
          probAux = this.environment.macacos[auxMacaco].table.actualtable[simbolo][predador];
        }
      }
    }

    // Caso exista algum predador sem simbolo convergido
    for (let i = 0; i < Config.nPredadores; i++) {
      if (convergencia[i] == -1) {
        return false;
      }
    }
    
    // Do segundo macaco pra frente: verificar se as convergências foram iguais
    for (auxMacaco = 1; auxMacaco < Config.nMacacos; auxMacaco++) {
      for (let predador = 0; predador < Config.nPredadores; predador++) {
        let probAux = 0, mSimbAux = -1;
        for (let simbolo = 0; simbolo < Config.simbolos; simbolo++) {
          if (
            this.environment.macacos[auxMacaco].table.actualtable[simbolo][predador] > probAux
          ) {
            mSimbAux = simbolo;
            probAux = this.environment.macacos[auxMacaco].table.actualtable[simbolo][predador];
          }
        }
        if (mSimbAux != convergencia[predador] ) {
          return false;
        }
      }
    }

    return true;
  }

  saveCicleData() {
    // push de um novo ciclo
    this.cicleData.push([]);
    for (let j = 0; j < Config.nMacacos; j++) {
      {
        // Para cada iteração: Guardar a tabela de cada macaco
        // push de um macaco no ciclo
        this.cicleData[this.cicle].push([]);
        this.saveTable(this.cicleData[this.cicle][j], this.environment.macacos[j].table);
      }
    }
  }

  saveTable(storeTable, macacoTable) {

    // table macaco: Simb x Pred
    // storedTable: Pred x Simb

    let indexMaiorSimbPred = [];
    let probabilidade = 0;

    // Para cada predador na tabela de probabilidade do macaco
    for (let predador = 0; predador < Config.nPredadores; predador++) {
      indexMaiorSimbPred[predador] = -1;
      probabilidade = 0;
      //para cada simbolo em predador na tabela de probilidade do macaco
      for (let simbolo = 0; simbolo < Config.simbolos; simbolo++) {
        // Verificar se o simbolo é o mais provável
        if (
          macacoTable.actualtable[simbolo][predador] >= probabilidade
        ) {
          // guardar o simbolo mais provavel para esse predador para esse macaco
          indexMaiorSimbPred[predador] = simbolo;
          probabilidade = macacoTable.actualtable[simbolo][predador];
        }
      }
    }

    storeTable.push(indexMaiorSimbPred);
  }

  createAnimationFrame(){

    let frame = [];

    for (let i = 0; i < Config.envMaxX; i++) {
      frame[i] = [];
      frame[i].length = Config.envMaxY;
      for (let j = 0; j < Config.envMaxY; j++) {
        frame[i][j] = null;
      }
    }

    this.environment.macacos.forEach((macaco) => {
      let pX = macaco.position.x, pY = macaco.position.y;
      frame[pX][pY] = macaco;
    });
    this.environment.predadores.forEach((predador) => {
      let pX = predador.position.x, pY = predador.position.y;
      frame[pX][pY] = predador;
    });

    return frame;
  }

}

module.exports = Sistema;

