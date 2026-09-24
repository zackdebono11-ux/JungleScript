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

    if (app.isPackaged) {
        window.loadFile(path.join(__dirname, "index.html"));
    } else {
        window.loadURL("http://localhost:5173/");
    }
}

ipcMain.handle("run-clojure", async (event, code) => {
    return new Promise((resolve) => {
        let settled = false;

        const clojure = spawn("clj", ["-M", "-e", code], {
            cwd: __dirname,
            shell: false
        });

        let output = "";
        let error = "";

        clojure.on("error", (err) => {
            if (settled) return;
            settled = true;

            if (err.code === "ENOENT") {
                resolve({
                    success: false,
                    output: "Clojure ('clj') is not installed or not found on PATH."
                });
            } else {
                resolve({
                    success: false,
                    output: `Failed to start Clojure: ${err.message}`
                });
            }
        });

        clojure.stdout.on("data", (data) => {
            output += data.toString();
        });

        clojure.stderr.on("data", (data) => {
            error += data.toString();
        });

        clojure.on("close", (exitCode) => {
            if (settled) return;
            settled = true;

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


ipcMain.handle("launch-upgrade", async (event, filePath) => {

    if (typeof filePath !== "string" || !filePath.trim()) {
        return {
            success: false,
            error: "Invalid upgrade path."
        };
    }

    if (!filePath.toLowerCase().endsWith(".exe")) {
        return {
            success: false,
            error: "Only .exe upgrades can be launched."
        };
    }

    try {

        const child = spawn(filePath, [], {
            detached: true,
            stdio: "ignore",
            windowsHide: false,
            shell: false
        });

        child.unref();

        return {
            success: true
        };

    } catch (error) {

        return {
            success: false,
            error: error.message
        };

    }
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
