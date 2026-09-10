// ==========================================
// 🌴 JUNGLE 3D HANDLER
// Gameplay systems for Jungle3D
// ==========================================

class Jungle3DHandler {

    constructor(engine) {

        this.engine = engine;

        // ==========================================
        // 🎮 GAME STATE
        // ==========================================

        this.running = false;
        this.gameOver = false;

        // ==========================================
        // 🏆 SCORE
        // ==========================================

        this.score = 0;

        // ==========================================
        // ❤️ PLAYER
        // ==========================================

        this.playerHealth = 100;

        // ==========================================
        // 🔫 WEAPONS
        // ==========================================

        this.bullets = [];

        this.bulletSpeed = 1.5;

        // ==========================================
        // ☄️ ASTEROIDS
        // ==========================================

        this.asteroids = [];

        this.asteroidSpeed = 0.05;

        // ==========================================
        // 🕹️ INPUT
        // ==========================================

        this.keys = {};

        this.mouse = {
            x: 0,
            y: 0,
            down: false
        };

        // ==========================================
        // ⚙️ SETTINGS
        // ==========================================

        this.playerSpeed = 0.15;

        this.fireCooldown = 0;

        // ==========================================
        // 🎮 SETUP
        // ==========================================

        this.setupKeyboard();
        this.setupMouse();

        console.log(
            "🎮 Jungle3D Handler loaded!"
        );
    }


    // ==========================================
    // 🕹️ KEYBOARD
    // ==========================================

    setupKeyboard() {

        window.addEventListener(
            "keydown",
            (event) => {

                this.keys[
                    event.key.toLowerCase()
                ] = true;

            }
        );


        window.addEventListener(
            "keyup",
            (event) => {

                this.keys[
                    event.key.toLowerCase()
                ] = false;

            }
        );


        // Prevent stuck keys when window loses focus

        window.addEventListener(
            "blur",
            () => {

                this.keys = {};

            }
        );
    }


    // ==========================================
    // 🖱️ MOUSE
    // ==========================================

    setupMouse() {

        window.addEventListener(
            "mousemove",
            (event) => {

                this.mouse.x = event.clientX;
                this.mouse.y = event.clientY;

            }
        );


        window.addEventListener(
            "mousedown",
            () => {

                this.mouse.down = true;

            }
        );


        window.addEventListener(
            "mouseup",
            () => {

                this.mouse.down = false;

            }
        );
    }


    // ==========================================
    // 🚀 START GAME
    // ==========================================

    start() {

        this.running = true;
        this.gameOver = false;

        this.score = 0;
        this.playerHealth = 100;

        this.bullets = [];

        console.log(
            "🚀 Jungle3D Handler started!"
        );
    }


    // ==========================================
    // 🕹️ PLAYER MOVEMENT
    // ==========================================

    updatePlayer() {

        if (
            !this.running ||
            this.gameOver ||
            !this.engine.player
        ) {
            return;
        }

        let x = 0;
        let y = 0;

        // WASD

        if (this.keys["a"]) {
            x -= 1;
        }

        if (this.keys["d"]) {
            x += 1;
        }

        if (this.keys["w"]) {
            y += 1;
        }

        if (this.keys["s"]) {
            y -= 1;
        }


        // Arrow keys

        if (this.keys["arrowleft"]) {
            x -= 1;
        }

        if (this.keys["arrowright"]) {
            x += 1;
        }

        if (this.keys["arrowup"]) {
            y += 1;
        }

        if (this.keys["arrowdown"]) {
            y -= 1;
        }


        // Apply movement

        this.engine.player.position.x +=
            x * this.playerSpeed;

        this.engine.player.position.y +=
            y * this.playerSpeed;
    }


    // ==========================================
    // 🖱️ AIM
    // ==========================================

    updateAim() {

        if (
            !this.running ||
            this.gameOver ||
            !this.engine.player
        ) {
            return;
        }

        // Mouse aiming can be connected
        // to the Jungle3D camera system here.

    }


    // ==========================================
    // 🔫 SHOOT
    // ==========================================

    shoot() {

        if (
            !this.running ||
            this.gameOver ||
            !this.engine.player
        ) {
            return;
        }

        console.log(
            "🔫 Jungle3D Handler: FIRE!"
        );

        // Bullet creation will be connected
        // to the Jungle3D scene here.
    }


    // ==========================================
    // ☄️ ASTEROIDS
    // ==========================================

    updateAsteroids() {

        if (
            !this.running ||
            this.gameOver
        ) {
            return;
        }

        if (!this.engine.asteroids) {
            return;
        }

        for (
            const asteroid
            of this.engine.asteroids
        ) {

            // Move asteroids toward player

            asteroid.position.z +=
                this.asteroidSpeed;

            asteroid.rotation.x += 0.01;
            asteroid.rotation.y += 0.01;
        }
    }


    // ==========================================
    // 💥 COLLISIONS
    // ==========================================

    checkCollisions() {

        if (
            !this.engine.player ||
            !this.engine.asteroids
        ) {
            return;
        }

        for (
            const asteroid
            of this.engine.asteroids
        ) {

            const distance =
                this.engine.player.position.distanceTo(
                    asteroid.position
                );

            if (distance < 1.5) {

                this.playerHealth -= 10;

                console.log(
                    "💥 Player hit! Health:",
                    this.playerHealth
                );

                if (
                    this.playerHealth <= 0
                ) {

                    this.endGame();

                }

            }
        }
    }


    // ==========================================
    // 🏆 SCORE
    // ==========================================

    addScore(amount) {

        this.score += amount;

        console.log(
            "🏆 Score:",
            this.score
        );
    }


    // ==========================================
    // 🎮 GAME OVER
    // ==========================================

    endGame() {

        this.running = false;
        this.gameOver = true;

        console.log(
            "🎮 GAME OVER"
        );

        console.log(
            "🏆 Final Score:",
            this.score
        );
    }


    // ==========================================
    // 🔄 RESTART
    // ==========================================

    restart() {

        console.log(
            "🔄 Restarting Jungle3D game..."
        );

        this.start();
    }


    // ==========================================
    // 🔁 UPDATE
    // ==========================================

    update() {

        if (
            !this.running ||
            this.gameOver
        ) {
            return;
        }

        this.updatePlayer();

        this.updateAim();

        this.updateAsteroids();

        this.checkCollisions();

    }

}


// ==========================================
// 🌴 GLOBAL ACCESS
// ==========================================

window.Jungle3DHandler =
    Jungle3DHandler;

console.log(
    "🌴 Jungle3D Handler is ready!"
);