// ==========================================
// 🤖 JUNGLESCRIPT AI SERVICE
// ==========================================

class JungleAI {

    constructor() {
        console.log("🤖 Jungle AI Service loaded!");
    }

    generateGame(prompt) {

        console.log("🧠 AI analyzing:", prompt);

        const text = prompt.toLowerCase();

        // Default blueprint
        const game = {
            title: "Jungle Game",
            mode: "2D",
            type: "adventure",

            player: {
                enabled: true
            },

            enemies: [],
            objects: [],
            systems: []
        };

        // ==========================================
        // 🚀 SPACE GAME
        // ==========================================

        if (
            text.includes("space") ||
            text.includes("spaceship") ||
            text.includes("asteroid")
        ) {
            game.title = "Space Shooter";
            game.mode = "3D";
            game.type = "spaceShooter";

            game.player = {
                enabled: true,
                type: "spaceship"
            };

            if (text.includes("asteroid")) {
                game.objects.push({
                    type: "asteroid",
                    count: 20
                });
            }

            game.systems.push(
                "shooting",
                "collision",
                "score"
            );
        }

        // ==========================================
        // 🏃 PLATFORMER
        // ==========================================

        else if (
            text.includes("platformer") ||
            text.includes("platform")
        ) {
            game.title = "Jungle Platformer";
            game.mode = "2D";
            game.type = "platformer";

            game.player = {
                enabled: true,
                type: "character"
            };

            game.objects.push({
                type: "platform",
                count: 10
            });

            game.systems.push(
                "movement",
                "jumping",
                "collision",
                "score"
            );
        }

        // ==========================================
        // 🌴 JUNGLE GAME
        // ==========================================

        else if (
            text.includes("jungle") ||
            text.includes("forest")
        ) {
            game.title = "Jungle Adventure";
            game.mode = "3D";
            game.type = "exploration";

            game.objects.push(
                {
                    type: "tree",
                    count: 30
                },
                {
                    type: "rock",
                    count: 15
                }
            );

            game.systems.push(
                "movement",
                "exploration"
            );
        }

        // ==========================================
        // 📤 RETURN BLUEPRINT
        // ==========================================

        console.log("📋 Generated blueprint:", game);

        return game;
    }
}


// ==========================================
// 🌴 GLOBAL JUNGLE AI
// ==========================================

window.JungleAI = JungleAI;

console.log("🤖 JungleAI is ready!");