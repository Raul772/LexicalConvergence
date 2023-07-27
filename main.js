const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const Sistema = require("./backend/Entities/Sistema.js");
const Config = require("./backend/Entities/Config.js");

function createWindow() {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  window.loadFile(path.join(__dirname, "frontend", "index.html"));
}

app.whenReady().then(() => {
  ipcMain.handle("simular", () => {
    return new Sistema().inicializar(BrowserWindow.getFocusedWindow());
  });
  ipcMain.handle("configs", () =>
    JSON.parse(fs.readFileSync("./backend/settings.json"))
  );
  ipcMain.handle("updateConfigs", (event, configs) => {
    global.systemConfig = configs;
    fs.writeFileSync("./backend/settings.json", JSON.stringify(configs));
  });

  createWindow();

  // No MacOS, caso o app não tenha janelas abertas mas está ativo, criar uma nova janela
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Terminar aplicação caso todas as janelas forem fechadas (Exceto no MacOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
