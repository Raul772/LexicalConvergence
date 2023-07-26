const { contextBridge, ipcRenderer } = require('electron');


// Disponibilizando uma API para o frontend
contextBridge.exposeInMainWorld("backend", {
  simular: () => ipcRenderer.invoke("simular"),
  configs: () => ipcRenderer.invoke("configs"),
  updateConfigs: configs => ipcRenderer.invoke("updateConfigs", configs),
  onFrameUpdate: callback => ipcRenderer.on("frameUpdate", callback)
  
  // Também é possível expor variáveis, não apenas funções
})

