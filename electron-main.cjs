const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron");

const path = require("node:path");

const {
    spawn
} = require("node:child_process");

const JUNGLE_HELPER_PROJECT = path.join(
    __dirname,
    "JungleAgent",
    "Jungle Helper",
    "JungleHelper"
);



// ==========================================
// 🌴 MAIN WINDOW
// ==========================================

function createWindow() {

    const window =
        new BrowserWindow({

            width: 1280,
            height: 820,

            minWidth: 900,
            minHeight: 600,

            title: "JungleScript",

            webPreferences: {

                contextIsolation: true,

                nodeIntegration: false,

                preload:
                    path.join(
                        __dirname,
                        "preload.cjs"
                    )
            }
        });


    // ==========================================
    // 🌴 WAIT FOR JUNGLESCRIPT UI TO LOAD
    // ==========================================

   

    // ==========================================
    // 🌴 LOAD JUNGLESCRIPT
    // ==========================================

    if (app.isPackaged) {

        window.loadFile(
            path.join(
                __dirname,
                "index.html"
            )
        );

    } else {

        window.loadURL(
            "http://localhost:5173/"
        );

    }
    window.webContents.once("did-finish-load", () => {

    console.log(
        "🌴 JungleScript UI loaded."
    );

    setTimeout(() => {

        startJungleHelperSession()
            .then(result => {

                if (result.success) {

                    console.log(
                        "🤖 Jungle Helper is ready."
                    );

                } else {

                    console.error(
                        "❌ Jungle Helper startup failed:",
                        result.error
                    );

                }

            });

    }, 100);

});



}


// ==========================================
// 🌴 RUN CLOJURE
// ==========================================

ipcMain.handle(
    "run-clojure",
    async (event, code) => {

        return new Promise(
            (resolve) => {

                let settled = false;

                const clojure =
                    spawn(
                        "clj",
                        [
                            "-M",
                            "-e",
                            code
                        ],
                        {
                            cwd: __dirname,
                            shell: false
                        }
                    );

                let output = "";
                let error = "";

                clojure.on(
                    "error",
                    (err) => {

                        if (settled) {
                            return;
                        }

                        settled = true;

                        if (
                            err.code ===
                            "ENOENT"
                        ) {

                            resolve({

                                success: false,

                                output:
                                    "Clojure ('clj') is not installed or not found on PATH."
                            });

                        } else {

                            resolve({

                                success: false,

                                output:
                                    `Failed to start Clojure: ${err.message}`
                            });
                        }
                    }
                );

                clojure.stdout.on(
                    "data",
                    (data) => {

                        output +=
                            data.toString();
                    }
                );

                clojure.stderr.on(
                    "data",
                    (data) => {

                        error +=
                            data.toString();
                    }
                );

                clojure.on(
                    "close",
                    (exitCode) => {

                        if (settled) {
                            return;
                        }

                        settled = true;

                        if (
                            exitCode === 0
                        ) {

                            resolve({

                                success: true,

                                output:
                                    output.trim()
                            });

                        } else {

                            resolve({

                                success: false,

                                output:
                                    error.trim() ||
                                    `Clojure exited with code ${exitCode}`
                            });
                        }
                    }
                );
            }
        );
    }
);


// ==========================================
// 🌴 SEND EVENT TO RENDERER
// ==========================================

function eventSender(
    channel,
    data
) {

    const windows =
        BrowserWindow.getAllWindows();

    for (
        const window of windows
    ) {

        window.webContents.send(
            channel,
            data
        );
    }
}


// ==========================================
// 🌴 LAUNCH UPGRADE
// ==========================================

ipcMain.handle(
    "launch-upgrade",
    async (event, filePath) => {

        if (
            typeof filePath !==
                "string" ||
            !filePath.trim()
        ) {

            return {
                success: false,
                error:
                    "Invalid upgrade path."
            };
        }

        if (
            !filePath
                .toLowerCase()
                .endsWith(".exe")
        ) {

            return {
                success: false,
                error:
                    "Only .exe upgrades can be launched."
            };
        }

        try {

            const child =
                spawn(
                    filePath,
                    [],
                    {
                        detached: true,
                        stdio: "ignore",
                        windowsHide: false,
                        shell: false
                    }
                );

            child.unref();

            return {
                success: true
            };

        } catch (error) {

            return {
                success: false,
                error:
                    error.message
            };
        }
    }
);


// ==========================================
// 🌴 JUNGLESCRIPT GO SERVER
// ==========================================

ipcMain.handle(
    "start-server",
    async (
        event,
        serverSize
    ) => {

        if (
            typeof serverSize !==
                "number" ||
            !Number.isInteger(
                serverSize
            ) ||
            serverSize < 1
        ) {

            return {

                success: false,

                error:
                    "Server size must be a positive whole number."
            };
        }

        const serverDirectory =
            path.join(
                __dirname,
                "Server"
            );

        return new Promise(
            (resolve) => {

                const server =
                    spawn(
                        "go",
                        [
                            "run",
                            "server.go",
                            String(serverSize)
                        ],
                        {

                            cwd:
                                serverDirectory,

                            detached: true,

                            stdio: "ignore",

                            windowsHide: false,

                            shell: false
                        }
                    );

                let settled = false;

                server.once(
                    "error",
                    (error) => {

                        if (settled) {
                            return;
                        }

                        settled = true;

                        resolve({

                            success: false,

                            error:
                                `Failed to start Go server: ${error.message}`
                        });
                    }
                );

                setTimeout(
                    () => {

                        if (settled) {
                            return;
                        }

                        settled = true;

                        server.unref();

                        resolve({

                            success: true,

                            message:
                                `JungleScript server started with capacity ${serverSize}.`
                        });

                    },
                    500
                );
            }
        );
    }
);


// ==========================================
// 🌴 JUNGLE HELPER
// PROGRAMMATIC SALESFORCE PREVIEW
// ==========================================

let jungleHelperSessionId = null;
let jungleHelperStartPromise = null;

// ==========================================
// RUN SALESFORCE CLI COMMAND
// ==========================================
function runSalesforce(args) {
    return new Promise((resolve, reject) => {
        const sfCli =
            "C:\\Program Files\\sf\\client\\bin\\run.js";

        console.log("🌴 Running Salesforce directly:");
        console.log("Command:", sfCli);
        console.log("Arguments:", args);

        const child = spawn(
            process.execPath,
            [sfCli, ...args],
            {
                cwd: JUNGLE_HELPER_PROJECT,
                windowsHide: true,
                stdio: ["ignore", "pipe", "pipe"]
            }
        );

        let stdout = "";
        let stderr = "";

        child.stdout.on("data", data => {
            stdout += data.toString();
        });

        child.stderr.on("data", data => {
            stderr += data.toString();
        });

        child.on("error", error => {
    console.error(
        "❌ Salesforce process error:",
        error
    );

    resolve({
        success: false,
        code: null,
        output: "",
        error: error.message,
        stdout: "",
        stderr: error.message
    });
});

        child.on("close", code => {
            console.log(
                "🌴 Salesforce exit code:",
                code
            );

            resolve({
                success: code === 0,
                code,
                output: stdout.trim(),
                error: stderr.trim(),
                stdout: stdout.trim(),
                stderr: stderr.trim()
            });
        });
    });
}


// ==========================================
// PARSE JSON FROM SALESFORCE
// ==========================================

function parseSalesforceJSON(
    text
) {

    if (!text) {
        return null;
    }

    try {

        return JSON.parse(
            text
        );

    } catch {

        // Salesforce CLI can sometimes
        // put extra terminal text around
        // the JSON output.

        const first =
            text.indexOf("{");

        const last =
            text.lastIndexOf("}");

        if (
            first !== -1 &&
            last !== -1 &&
            last > first
        ) {

            try {

                return JSON.parse(
                    text.slice(
                        first,
                        last + 1
                    )
                );

            } catch {
                return null;
            }
        }

        return null;
    }
}
// ==========================================
// 🌴 START JUNGLE HELPER IN BACKGROUND
// ==========================================

async function startJungleHelperSession() {

    // Already running
    if (jungleHelperSessionId) {
        return {
            success: true,
            sessionId: jungleHelperSessionId
        };
    }

    // Already starting
    // Reuse the same startup instead of launching
    // another Salesforce process.
    if (jungleHelperStartPromise) {
        return jungleHelperStartPromise;
    }

    eventSender(
        "jungle-ai-status",
        "starting"
    );

    jungleHelperStartPromise = (async () => {

        try {

            const result =
                await runSalesforce([
                    "agent",
                    "preview",
                    "start",

                    "--authoring-bundle",
                    "Jungle_Helper",

                    "--target-org",
                    "JungleHelper",

                    "--use-live-actions",

                    "--json"
                ]);

            if (!result.success) {

                eventSender(
                    "jungle-ai-status",
                    "stopped"
                );

                return {
                    success: false,
                    error:
                        result.error ||
                        result.output ||
                        "Salesforce preview could not start."
                };
            }

            const data =
                parseSalesforceJSON(
                    result.output
                );

            if (!data) {

                eventSender(
                    "jungle-ai-status",
                    "stopped"
                );

                return {
                    success: false,
                    error:
                        "Salesforce returned an unexpected response:\n" +
                        result.output
                };
            }

            jungleHelperSessionId =
                data.result?.sessionId ||
                data.sessionId ||
                data.result?.id ||
                data.id ||
                null;

            if (!jungleHelperSessionId) {

                eventSender(
                    "jungle-ai-status",
                    "stopped"
                );

                return {
                    success: false,
                    error:
                        "Salesforce started the preview but did not return a session ID.\n\n" +
                        result.output
                };
            }

            console.log(
                "🌴 Jungle Helper session ready:",
                jungleHelperSessionId
            );

            eventSender(
                "jungle-ai-status",
                "started"
            );

            return {
                success: true,
                sessionId:
                    jungleHelperSessionId
            };

        } catch (error) {

            console.error(
                "❌ Jungle Helper startup failed:",
                error
            );

            eventSender(
                "jungle-ai-status",
                "stopped"
            );

            return {
                success: false,
                error: error.message
            };

        } finally {

            jungleHelperStartPromise = null;

        }

    })();

    return jungleHelperStartPromise;
}


// ==========================================
// START JUNGLE HELPER SESSION
// ==========================================
ipcMain.handle(
    "jungle-ai-start",
    async () => {

        return startJungleHelperSession();

    }
);


// ==========================================
// SEND MESSAGE
// ==========================================

ipcMain.handle(
    "jungle-ai-send",
    async (
        event,
        message
    ) => {

        if (
            typeof message !==
                "string" ||
            !message.trim()
        ) {

            return {

                success: false,

                error:
                    "Message cannot be empty."
            };
        }

        if (
            !jungleHelperSessionId
        ) {

            return {

                success: false,

                error:
                    "Jungle Helper session is not running."
            };
        }

        const result =
            await runSalesforce(
                [
                    "agent",
                    "preview",
                    "send",

                    "--authoring-bundle",
                    "Jungle_Helper",

                    "--target-org",
                    "JungleHelper",

                    "--session-id",
                    jungleHelperSessionId,

                    "--utterance",
                    message.trim(),

                    "--json"
                ]
            );

        if (!result.success) {

            return {

                success: false,

                error:
                    result.error ||
                    result.output ||
                    "Jungle Helper failed to answer."
            };
        }

        const data =
            parseSalesforceJSON(
                result.output
            );

        if (!data) {

            return {

                success: false,

                error:
                    "Could not parse the Salesforce response.\n\n" +
                    result.output
            };
        }

        /*
         * Try the common response locations.
         */

        const response =
    data.result?.messages?.find(
        message => typeof message.message === "string"
    )?.message ||
    data.result?.response ||
    data.result?.message ||
    data.result?.output ||
    data.response ||
    data.message ||
    data.output ||
    data.result?.agentResponse ||
    "";

        if (!response) {

            return {

                success: false,

                error:
                    "Salesforce returned JSON, but no agent response was found.\n\n" +
                    result.output
            };
        }

        eventSender(
            "jungle-ai-output",
            response
        );

        return {

            success: true,

            response:
                String(response)
        };
    }
);


// ==========================================
// APP START
// ==========================================

app.whenReady().then(() => {

    createWindow();

    // ==========================================
    // 🌴 PRE-START JUNGLE HELPER
    // ==========================================
    // Start Salesforce in the background.
    // This does NOT block the Electron window.

    setTimeout(() => {

        startJungleHelperSession()
            .then(result => {

                if (result.success) {

                    console.log(
                        "🌴 Jungle Helper is ready before the user opens the AI panel."
                    );

                } else {

                    console.error(
                        "❌ Jungle Helper background startup failed:",
                        result.error
                    );

                }

            })
            .catch(error => {

                console.error(
                    "❌ Jungle Helper background startup error:",
                    error
                );

            });

    }, 500);


    // ==========================================
    // 🌴 MACOS WINDOW REACTIVATION
    // ==========================================

    app.on(
        "activate",
        () => {

            if (
                BrowserWindow
                    .getAllWindows()
                    .length === 0
            ) {

                createWindow();

            }

        }
    );

});


// ==========================================
// APP CLOSE
// ==========================================

app.on(
    "window-all-closed",
    () => {

        if (
            process.platform !== "darwin"
        ) {

            app.quit();

        }

    }
);