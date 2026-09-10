
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const { spawn } = require("node:child_process");
function createWindow() {
    const window = new BrowserWindow({
        width: 1280,
        height: 820,
        minWidth: 900,
        minHeight: 600,
        title: "JungleScript",
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, "preload.cjs")
        }
    });

window.loadURL("http://localhost:5173/");
}
ipcMain.handle("run-clojure", async (event, code) => {
    return new Promise((resolve) => {
        const clojure = spawn("clj", ["-M", "-e", code], {
            cwd: __dirname,
            shell: false
        });

        let output = "";
        let error = "";

        clojure.stdout.on("data", (data) => {
            output += data.toString();
        });

        clojure.stderr.on("data", (data) => {
            error += data.toString();
        });

        clojure.on("close", (exitCode) => {
            if (exitCode === 0) {
                resolve({
                    success: true,
                    output: output.trim()
                });
            } else {
                resolve({
                    success: false,
                    output: error.trim() || `Clojure exited with code ${exitCode}`
                });
            }
        });
    });
});

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});