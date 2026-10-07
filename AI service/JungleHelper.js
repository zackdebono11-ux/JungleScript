// ==========================================
// 🌴 JUNGLESCRIPT LOCAL AI GAME HELPER
// ==========================================

class JungleAI {

    constructor() {

        console.log(
            "🤖 JungleAI game generator loaded!"
        );
    }

    // ==========================================
    // GENERATE GAME
    // ==========================================

    generateGame(prompt) {

        const request =
            String(prompt || "")
                .trim()
                .toLowerCase();

        console.log(
            "🤖 JungleAI request:",
            prompt
        );

        // ==========================================
        // SPACE SHOOTER
        // ==========================================

        if (
            request.includes("space") ||
            request.includes("spaceship") ||
            request.includes("asteroid") ||
            request.includes("shooter")
        ) {

            return {

                title: "Jungle Space Adventure",

                mode: "3D",

                type: "spaceShooter",

                player: {
                    type: "spaceship"
                },

                objects: [

                    {
                        type: "asteroid",
                        count: 15
                    }

                ],

                systems: [

                    "movement",
                    "asteroids",
                    "score"
                ]
            };
        }

        // ==========================================
        // PLATFORMER
        // ==========================================

        if (
            request.includes("platformer") ||
            request.includes("platform game") ||
            request.includes("jumping game")
        ) {

            return {

                title: "Jungle Platformer",

                mode: "2D",

                type: "platformer",

                player: {
                    type: "player"
                },

                objects: [

                    {
                        type: "platform"
                    },

                    {
                        type: "coin",
                        count: 10
                    }
                ],

                systems: [

                    "movement",
                    "jumping",
                    "coins"
                ]
            };
        }

        // ==========================================
        // EXPLORATION
        // ==========================================

        if (
            request.includes("explore") ||
            request.includes("exploration") ||
            request.includes("adventure") ||
            request.includes("jungle")
        ) {

            return {

                title: "Jungle Explorer",

                mode: "3D",

                type: "exploration",

                player: {
                    type: "explorer"
                },

                objects: [

                    {
                        type: "tree",
                        count: 10
                    },

                    {
                        type: "coin",
                        count: 5
                    }
                ],

                systems: [

                    "movement",
                    "exploration",
                    "collectibles"
                ]
            };
        }

        // ==========================================
        // DEFAULT GAME
        // ==========================================

        return {

            title: "My Jungle Game",

            mode: "2D",

            type: "platformer",

            player: {
                type: "player"
            },

            objects: [],

            systems: [
                "movement"
            ]
        };
    }
}

// ==========================================
// GLOBAL ACCESS
// ==========================================

window.JungleAI = JungleAI;

console.log(
    "🌴 JungleAI is ready!"
);