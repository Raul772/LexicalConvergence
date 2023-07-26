const fs = require("fs");
const path = require("path");

let Config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "settings.json")));

module.exports = Config;
