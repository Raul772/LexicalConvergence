
class Table {

  constructor(systemConfig) {
    this.actualtable = [];
    
    for (let i = 0; i < systemConfig.simbolos; i++) {
      this.actualtable[i] = [];
    }
  }
}
module.exports = Table;
