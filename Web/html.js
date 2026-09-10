// ==========================================
// 🌐 JungleScript HTML Module
// ==========================================

class JungleHTML {

    constructor() {
        this.name = "HTML";
        this.version = "1.0.0";

        console.log("🌐 JungleHTML module loaded!");
    }

    // Create a basic HTML page
    createPage(title = "JungleScript Page") {
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
</head>
<body>
</body>
</html>`;
    }

    // Create an HTML element
    element(tag, content = "") {
        return `<${tag}>${content}</${tag}>`;
    }

    // Create a heading
    heading(text, level = 1) {
        return `<h${level}>${text}</h${level}>`;
    }

    // Create normal text
    text(content) {
        return `<p>${content}</p>`;
    }

    // Create a button
    button(text) {
        return `<button>${text}</button>`;
    }
}


// Make it available to JungleScript
window.JungleHTML = JungleHTML;

console.log("🌴 JungleHTML is ready!");