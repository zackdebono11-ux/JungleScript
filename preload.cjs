const {
    contextBridge,
    ipcRenderer,
    webUtils
} = require("electron");

contextBridge.exposeInMainWorld(
    "jungleElectron",
    {

        runClojure: (code) =>
            ipcRenderer.invoke(
                "run-clojure",
                code
            ),

        getFilePath: (file) =>
            webUtils.getPathForFile(file),

        launchUpgrade: (filePath) =>
            ipcRenderer.invoke(
                "launch-upgrade",
                filePath
            )

    }
);

console.log(
    "🌴 JungleScript Electron bridge loaded!"
);