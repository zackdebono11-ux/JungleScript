const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("jungleElectron", {
    runClojure: (code) => ipcRenderer.invoke("run-clojure", code)
});

console.log("🌴 JungleScript Electron bridge loaded!");