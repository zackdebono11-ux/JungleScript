
// ==========================================
// 🌴 JUNGLESCRIPT ENGINE v0.2
// ==========================================

const codeBox = document.getElementById("code");
const runButton = document.getElementById("runButton");
const downloadButton = document.getElementById("downloadButton");

const previewOutput = document.getElementById("previewOutput");
const consoleOutput = document.getElementById("consoleOutput");
const lineNumbers = document.getElementById("lineNumbers");
const highlightedCode = document.getElementById("highlightedCode");

const fileList = document.getElementById("fileList");
const newFileButton = document.getElementById("newFileButton");


// ==========================================
// 📁 FILE SYSTEM
// ==========================================

const files = {
    "main.jls": codeBox.value
};

let currentFile = "main.jls";


// ==========================================
// 🔢 LINE NUMBERS
// ==========================================

function updateLineNumbers() {

    const lines = codeBox.value.split("\n").length;

    let numbers = "";

    for (let i = 1; i <= lines; i++) {
        numbers += i + "\n";
    }

    lineNumbers.textContent = numbers;
}


// ==========================================
// 🎨 SYNTAX HIGHLIGHTING
// ==========================================







// ==========================================
// 💾 SAVE CURRENT FILE
// ==========================================

function saveCurrentFile() {

    files[currentFile] = codeBox.value;
}


// ==========================================
// 📂 OPEN FILE
// ==========================================

function openFile(filename) {

    saveCurrentFile();

    currentFile = filename;

    codeBox.value = files[filename] || "";

    updateLineNumbers();
    

    document.querySelectorAll(".file").forEach(file => {
        file.classList.remove("active");
    });

    const selectedFile = document.querySelector(
        `[data-file="${filename}"]`
    );

    if (selectedFile) {
        selectedFile.classList.add("active");
    }

    consoleMessage(
        `Opened ${filename}`,
        "success"
    );
}


// ==========================================
// 📜 EXISTING FILES
// ==========================================

document.querySelectorAll(".file").forEach(file => {

    file.addEventListener("click", () => {

        const filename = file.dataset.file;

        openFile(filename);

    });

});


// ==========================================
// 🧠 CONSOLE
// ==========================================

function consoleMessage(message, type = "info") {

    const line = document.createElement("div");

    line.className = "consoleLine " + type;

    line.textContent = "> " + message;

    consoleOutput.appendChild(line);

    consoleOutput.scrollTop =
        consoleOutput.scrollHeight;
}


// ==========================================
// 🌴 RUN JUNGLESCRIPT
// ==========================================

function runJungleScript() {

    saveCurrentFile();

    const code = codeBox.value;

    const lines = code.split("\n");

    const loadedObjects = new Set();

    previewOutput.innerHTML = "";
    consoleOutput.innerHTML = "";

    consoleMessage(
        "Starting JungleScript...",
        "info"
    );


    for (
        let lineNumber = 0;
        lineNumber < lines.length;
        lineNumber++
    ) {

        const line = lines[lineNumber].trim();


        if (line === "") {
            continue;
        }


        // ==========================================
        // 🌴 use("JungleWeb")
        // ==========================================

        const useMatch =
            line.match(/^use\("(.+)"\)$/);


        if (useMatch) {

            const objectName = useMatch[1];


            if (objectName === "JungleWeb") {

                loadedObjects.add(objectName);

                consoleMessage(
                    "JungleWeb loaded!",
                    "success"
                );

            } else {

                consoleMessage(
                    `Line ${lineNumber + 1}: Unknown module "${objectName}"`,
                    "error"
                );
            }

            continue;
        }


        // ==========================================
        // 🔒 CHECK JUNGLEWEB
        // ==========================================

        if (!loadedObjects.has("JungleWeb")) {

            consoleMessage(
                `Line ${lineNumber + 1}: JungleWeb is not loaded.`,
                "error"
            );

            continue;
        }


        // ==========================================
        // 🌐 page("...")
        // ==========================================

        const pageMatch =
            line.match(/^page\("(.+)"\)$/);


        if (pageMatch) {

            document.title =
                pageMatch[1];

            consoleMessage(
                `Page title: ${pageMatch[1]}`,
                "success"
            );

            continue;
        }


        // ==========================================
        // 📰 heading("...")
        // ==========================================

        const headingMatch =
            line.match(/^heading\("(.+)"\)$/);


        if (headingMatch) {

            const heading =
                document.createElement("h1");

            heading.textContent =
                headingMatch[1];

            previewOutput.appendChild(
                heading
            );

            continue;
        }


        // ==========================================
        // 📝 text("...")
        // ==========================================

        const textMatch =
            line.match(/^text\("(.+)"\)$/);


        if (textMatch) {

            const paragraph =
                document.createElement("p");

            paragraph.textContent =
                textMatch[1];

            previewOutput.appendChild(
                paragraph
            );

            continue;
        }


        // ==========================================
        // 🔘 button("...")
        // ==========================================

        const buttonMatch =
            line.match(/^button\("(.+)"\)$/);


        if (buttonMatch) {

            const webButton =
                document.createElement("button");

            webButton.textContent =
                buttonMatch[1];

            webButton.style.padding =
                "10px 16px";

            webButton.style.margin =
                "8px 0";

            webButton.style.cursor =
                "pointer";


            webButton.addEventListener(
                "click",
                () => {

                    consoleMessage(
                        `Button "${buttonMatch[1]}" clicked!`,
                        "success"
                    );

                }
            );


            previewOutput.appendChild(
                webButton
            );

            continue;
        }


        // ==========================================
        // 📥 download("file.jls")
        // ==========================================

        const downloadMatch =
            line.match(/^download\("(.+)"\)$/);


        if (downloadMatch) {

            let filename =
                downloadMatch[1];


            if (!filename.endsWith(".jls")) {
                filename += ".jls";
            }


            downloadJungleFile(
                filename,
                code
            );


            consoleMessage(
                `Downloaded ${filename}`,
                "success"
            );

            continue;
        }


        // ==========================================
        // 📄 createFile("file.jls")
        // ==========================================

        const createFileMatch =
            line.match(/^createFile\("(.+)"\)$/);


        if (createFileMatch) {

            let filename =
                createFileMatch[1];


            if (!filename.includes(".")) {
                filename += ".jls";
            }


            if (Object.prototype.hasOwnProperty.call(files, filename)) {

                consoleMessage(
                    `Line ${lineNumber + 1}: File "${filename}" already exists.`,
                    "error"
                );

                continue;
            }


            files[filename] = "";


            const fileElement =
                document.createElement("div");


            fileElement.className =
                "file";


            fileElement.dataset.file =
                filename;


            fileElement.textContent =
                "📄 " + filename;


            fileElement.addEventListener(
                "click",
                () => {

                    openFile(filename);

                }
            );


            fileList.appendChild(
                fileElement
            );


            consoleMessage(
                `Created ${filename}`,
                "success"
            );


            continue;
        }


        // ==========================================
        // ❌ UNKNOWN COMMAND
        // ==========================================

        consoleMessage(
            `Line ${lineNumber + 1}: Unknown command "${line}"`,
            "error"
        );
    }


    consoleMessage(
        "Program finished.",
        "success"
    );
}


// ==========================================
// ▶ RUN BUTTON
// ==========================================

runButton.addEventListener(
    "click",
    runJungleScript
);


// ==========================================
// 💾 DOWNLOAD FUNCTION
// ==========================================

function downloadJungleFile(filename, content) {

    const blob =
        new Blob(
            [content],
            { type: "text/plain" }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download = filename;


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    setTimeout(() => {

        URL.revokeObjectURL(url);

    }, 100);
}


// ==========================================
// 💾 DOWNLOAD BUTTON
// ==========================================

downloadButton.addEventListener(
    "click",
    () => {

        saveCurrentFile();


        let filename =
            prompt(
                "Enter a name for your JungleScript file:",
                currentFile
            );


        if (!filename) {
            return;
        }


        filename = filename.trim();


        if (!filename.endsWith(".jls")) {
            filename += ".jls";
        }


        downloadJungleFile(
            filename,
            codeBox.value
        );


        consoleMessage(
            `Downloaded ${filename}`,
            "success"
        );
    }
);


// ==========================================
// ➕ NEW FILE BUTTON
// ==========================================

if (newFileButton) {

    newFileButton.addEventListener(
        "click",
        () => {

            let filename =
                prompt(
                    "Enter a filename:",
                    "newfile.jls"
                );


            if (!filename) {
                return;
            }


            filename = filename.trim();


            if (!filename) {
                return;
            }


            if (!filename.endsWith(".jls")) {
                filename += ".jls";
            }


            if (Object.prototype.hasOwnProperty.call(files, filename)) {

                consoleMessage(
                    `File "${filename}" already exists.`,
                    "error"
                );

                return;
            }


            saveCurrentFile();


            files[filename] = "";


            const fileElement =
                document.createElement("div");


            fileElement.className =
                "file";


            fileElement.dataset.file =
                filename;


            fileElement.textContent =
                "📄 " + filename;


            fileElement.addEventListener(
                "click",
                () => {

                    openFile(filename);

                }
            );


            fileList.appendChild(
                fileElement
            );


            consoleMessage(
                `Created ${filename}`,
                "success"
            );


            openFile(filename);
        }
    );
}


// ==========================================
// ⌨️ TAB SUPPORT
// ==========================================

codeBox.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Tab") {
            return;
        }


        event.preventDefault();


        const start =
            codeBox.selectionStart;

        const end =
            codeBox.selectionEnd;


        codeBox.value =
            codeBox.value.substring(0, start) +
            "    " +
            codeBox.value.substring(end);


        codeBox.selectionStart =
            start + 4;

        codeBox.selectionEnd =
            start + 4;


        updateLineNumbers();

        
    }
);


// ==========================================
// ✏️ CODE CHANGES
// ==========================================

codeBox.addEventListener(
    "input",
    () => {

        updateLineNumbers();

        

    }
);


// ==========================================
// 📜 SYNCHRONIZED SCROLLING
// ==========================================

codeBox.addEventListener(
    "scroll",
    () => {

        lineNumbers.scrollTop =
            codeBox.scrollTop;


        highlightedCode.scrollTop =
            codeBox.scrollTop;


        highlightedCode.scrollLeft =
            codeBox.scrollLeft;

    }
);


// ==========================================
// 🚀 STARTUP
// ==========================================

updateLineNumbers();



consoleMessage(
    "JungleScript ready!",
    "success"
);

console.log(
    "🌴 JungleScript v0.2 loaded!"
);

