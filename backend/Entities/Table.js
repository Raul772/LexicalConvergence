const Config = require("./Config");

class Table {

  constructor() {
    this.actualtable = [];
    
    for (let i = 0; i < Config.simbolos; i++) {
      this.actualtable[i] = [];
    }
  }
}
module.exports = Table;
