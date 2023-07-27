const fs = require("fs");
const path = require("path");

class Config{

  static configs = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "settings.json")));

  static getConfigs() {
    Config.configs = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "settings.json")));
    return Config.configs;
  }
}

exports.configs = Config.configs;
exports.getConfigs = Config.getConfigs;


