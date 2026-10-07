// ==========================================
// 🌴 JUNGLESCRIPT ELECTRON PRELOAD
// ==========================================

const {
    contextBridge,
    ipcRenderer
} = require("electron");

// ==========================================
// 🌴 JUNGLE HELPER
// ==========================================

contextBridge.exposeInMainWorld(
    "jungleAI",
    {

        start: () =>
            ipcRenderer.invoke(
                "jungle-ai-start"
            ),

        send: (message) =>
            ipcRenderer.invoke(
                "jungle-ai-send",
                message
            ),

        onOutput: (callback) => {

            ipcRenderer.on(
                "jungle-ai-output",
                (event, text) => {

                    callback(text);
                }
            );
        },

        onStatus: (callback) => {

            ipcRenderer.on(
                "jungle-ai-status",
                (event, status) => {

                    callback(status);
                }
            );
        }
    }
);