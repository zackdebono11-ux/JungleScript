// ==========================================
// 🎮 JUNGLESCRIPT GAME BUILDER
// ==========================================

class JungleGameBuilder {

   constructor(previewElement) {
    this.previewElement = previewElement;

    console.log(
        "🎯 GameBuilder received preview:",
        this.previewElement
    );

    this.engine = null;

    console.log("🏗️ Jungle Game Builder loaded!");
}


    // ==========================================
    // 🏗️ MAIN BUILD FUNCTION
    // ==========================================

    build(blueprint) {

        console.log(
            "🏗️ GameBuilder received:",
            blueprint
        );

        if (!blueprint) {

            console.error(
                "❌ No game blueprint received."
            );

            return;
        }


        // 3D SPACE SHOOTER
        if (blueprint.type === "spaceShooter") {

            return this.buildSpaceShooter(
                blueprint
            );
        }


        // 2D PLATFORMER
        if (blueprint.type === "platformer") {

            return this.buildPlatformer(
                blueprint
            );
        }


        // 3D EXPLORATION
        if (blueprint.type === "exploration") {

            return this.buildExploration(
                blueprint
            );
        }


        // DEFAULT
        console.log(
            "🎮 Building default game..."
        );

        return {

            type: "default",

            blueprint: blueprint

        };
    }


    // ==========================================
    // 🚀 3D SPACE SHOOTER
    // ==========================================

    buildSpaceShooter(blueprint) {

        console.log(
            "🚀 Building Space Shooter..."
        );


        const game = {

            title:
                blueprint.title,

            mode:
                blueprint.mode,

            type:
                blueprint.type,


            player: {

                type:
                    blueprint.player?.type ||
                    "spaceship",

                enabled: true

            },


            asteroids: [],


            systems:
                blueprint.systems || []

        };


        // ==========================================
        // ☄️ CREATE ASTEROIDS
        // ==========================================

        const asteroidObject =
            blueprint.objects?.find(
                object =>
                    object.type === "asteroid"
            );


        if (asteroidObject) {

            const count =
                asteroidObject.count || 10;


            for (
                let i = 0;
                i < count;
                i++
            ) {

                game.asteroids.push({

                    id: i,

                    type: "asteroid",

                    x:
                        Math.random() * 40 - 20,

                    y:
                        Math.random() * 20 - 10,

                    z:
                        Math.random() * -50

                });

            }

        }


        console.log(
            "☄️ Created",
            game.asteroids.length,
            "asteroids"
        );


        // ==========================================
        // 🧊 CONNECT TO JUNGLE 3D
        // ==========================================

        if (
            typeof window.Jungle3D ===
            "undefined"
        ) {

            console.error(
                "❌ Jungle3D is not loaded."
            );

            return game;

        }


        if (!this.previewElement) {

            console.error(
                "❌ No 3D preview element."
            );

            return game;

        }


        console.log(
            "🧊 Connecting GameBuilder to Jungle3D..."
        );


        // Create the 3D engine

        this.engine =
            new window.Jungle3D(
                this.previewElement
            );


        // Start the engine

        this.engine.start();


        // Send the generated game
        // to the 3D engine

        if (
            typeof this.engine.buildSpaceShooter ===
            "function"
        ) {

            this.engine.buildSpaceShooter(
                game
            );

        } else {

            console.error(
                "❌ Jungle3D Space Shooter builder is missing."
            );

        }


        console.log(
            "🎮 3D Space Shooter connected!"
        );


        console.log(
            "📦 Final game:",
            game
        );


        return game;
    }


    // ==========================================
    // 🏃 PLATFORMER
    // ==========================================

    buildPlatformer(blueprint) {

        console.log(
            "🏃 Building Platformer..."
        );


        return {

            title:
                blueprint.title,

            type:
                "platformer",

            player:
                blueprint.player,

            systems:
                blueprint.systems || [],

            objects:
                blueprint.objects || []

        };
    }


    // ==========================================
    // 🌴 EXPLORATION GAME
    // ==========================================

    buildExploration(blueprint) {

        console.log(
            "🌴 Building Exploration Game..."
        );


        return {

            title:
                blueprint.title,

            type:
                "exploration",

            player:
                blueprint.player,

            objects:
                blueprint.objects || [],

            systems:
                blueprint.systems || []

        };
    }

}


// ==========================================
// 🌎 GLOBAL ACCESS
// ==========================================

window.JungleGameBuilder =
    JungleGameBuilder;


console.log(
    "🏗️ JungleGameBuilder is ready!"
);