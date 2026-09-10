// ==========================================
// 🎮 JUNGLEGAME ENGINE v0.2.1
// ==========================================

class JungleGameRuntime {
    


    constructor(previewElement) {

        this.previewElement = previewElement;

        this.gameName = "Untitled JungleGame";

        this.player = null;
        this.entities = [];

        this.running = false;

        this.keys = {};

        this.speed = 4;
        this.enemySpeed = 1.5;

        this.score = 0;

        this.gameScreen = null;
        this.playerElement = null;
        this.scoreElement = null;

        console.log("🎮 JungleGame Engine v0.2.1 loaded!");

        this.setupKeyboard();

    }


    // ==========================================
    // ⌨️ KEYBOARD
    // ==========================================

    setupKeyboard() {

        window.addEventListener("keydown", (event) => {

            this.keys[event.key.toLowerCase()] = true;

        });

        window.addEventListener("keyup", (event) => {

            this.keys[event.key.toLowerCase()] = false;

        });

    }


    // ==========================================
    // ▶ EXECUTE COMMAND
    // ==========================================

    execute(line) {

        // ==========================================
        // 🎮 game()
        // ==========================================

        const gameMatch =
            line.match(/^game\("(.+)"\)$/);

        if (gameMatch) {

            this.gameName = gameMatch[1];

            console.log(
                `🎮 Game: ${this.gameName}`
            );

            this.createGameScreen();

            return true;

        }


        // ==========================================
        // 🧍 player()
        // ==========================================

        const playerMatch =
            line.match(/^player\("(.+)"\)$/);

        if (playerMatch) {

            this.player = {

                name: playerMatch[1],

                x: 100,
                y: 100,

                width: 40,
                height: 40

            };

            console.log(
                `🧍 Player created: ${this.player.name}`
            );

            this.renderPlayer();

            return true;

        }


        // ==========================================
        // 👾 enemy()
        // ==========================================

        const enemyMatch =
            line.match(/^enemy\("(.+)"\)$/);

        if (enemyMatch) {

            const enemy = {

                type: "enemy",

                name: enemyMatch[1],

                x: 300,
                y: 100,

                width: 40,
                height: 40,

                element: null

            };

            this.entities.push(enemy);

            console.log(
                `👾 Enemy created: ${enemy.name}`
            );

            this.renderEnemy(enemy);

            return true;

        }


        // ==========================================
        // 🟡 coin()
        // ==========================================

        if (line === "coin()") {

            const coin = {

                type: "coin",

                x: 200,
                y: 180,

                width: 30,
                height: 30,

                element: null

            };

            this.entities.push(coin);

            console.log(
                "🟡 Coin created!"
            );

            this.renderCoin(coin);

            return true;

        }


        // ==========================================
        // ▶ start()
        // ==========================================

        if (line === "start()") {

            this.running = true;

            console.log(
                "▶️ JungleGame started!"
            );

            this.startGameLoop();

            return true;

        }


        return false;

    }


    // ==========================================
    // 🖥️ GAME SCREEN
    // ==========================================

    createGameScreen() {

        this.previewElement.innerHTML = "";

        const game =
            document.createElement("div");

        game.id = "jungleGameScreen";

        game.style.position = "relative";
        game.style.width = "100%";
        game.style.height = "400px";
        game.style.background = "#101b16";
        game.style.border = "2px solid #3cff88";
        game.style.borderRadius = "12px";
        game.style.overflow = "hidden";
        game.style.boxSizing = "border-box";
        game.style.userSelect = "none";


        // ==========================================
        // 🎮 TITLE
        // ==========================================

        const title =
            document.createElement("div");

        title.textContent =
            "🎮 " + this.gameName;

        title.style.position = "absolute";
        title.style.top = "10px";
        title.style.left = "15px";
        title.style.color = "#3cff88";
        title.style.fontSize = "20px";
        title.style.fontWeight = "bold";
        title.style.zIndex = "10";

        game.appendChild(title);


        // ==========================================
        // 🏆 SCORE
        // ==========================================

        const score =
            document.createElement("div");

        score.textContent =
            "Score: 0";

        score.style.position = "absolute";
        score.style.top = "12px";
        score.style.right = "15px";
        score.style.color = "white";
        score.style.fontSize = "18px";
        score.style.fontWeight = "bold";
        score.style.zIndex = "10";

        game.appendChild(score);

        this.scoreElement = score;


        this.previewElement.appendChild(game);

        this.gameScreen = game;

    }


    // ==========================================
    // 🧍 PLAYER
    // ==========================================

    renderPlayer() {

        if (!this.gameScreen) {
            this.createGameScreen();
        }

        const playerElement =
            document.createElement("div");

        playerElement.textContent = "🧍";

        playerElement.style.position = "absolute";

        playerElement.style.left =
            this.player.x + "px";

        playerElement.style.top =
            this.player.y + "px";

        playerElement.style.width =
            this.player.width + "px";

        playerElement.style.height =
            this.player.height + "px";

        playerElement.style.fontSize = "35px";
        playerElement.style.lineHeight = "40px";
        playerElement.style.textAlign = "center";
        playerElement.style.zIndex = "5";

        playerElement.title =
            this.player.name;

        this.gameScreen.appendChild(
            playerElement
        );

        this.playerElement =
            playerElement;

    }


    // ==========================================
    // 👾 ENEMY
    // ==========================================

    renderEnemy(enemy) {

        if (!this.gameScreen) {
            this.createGameScreen();
        }

        const enemyElement =
            document.createElement("div");

        enemyElement.textContent = "👾";

        enemyElement.style.position = "absolute";

        enemyElement.style.left =
            enemy.x + "px";

        enemyElement.style.top =
            enemy.y + "px";

        enemyElement.style.width =
            enemy.width + "px";

        enemyElement.style.height =
            enemy.height + "px";

        enemyElement.style.fontSize = "35px";
        enemyElement.style.lineHeight = "40px";
        enemyElement.style.textAlign = "center";
        enemyElement.style.zIndex = "4";

        enemyElement.title =
            enemy.name;

        enemy.element =
            enemyElement;

        this.gameScreen.appendChild(
            enemyElement
        );

    }


    // ==========================================
    // 🟡 CUSTOM COIN
    // ==========================================

    renderCoin(coin) {

        if (!this.gameScreen) {
            this.createGameScreen();
        }

        const coinElement =
            document.createElement("div");

        coinElement.style.position = "absolute";

        coinElement.style.left =
            coin.x + "px";

        coinElement.style.top =
            coin.y + "px";

        coinElement.style.width =
            "28px";

        coinElement.style.height =
            "28px";

        coinElement.style.borderRadius =
            "50%";

        coinElement.style.background =
            "#ffd84d";

        coinElement.style.border =
            "4px solid #c99700";

        coinElement.style.boxSizing =
            "border-box";

        coinElement.style.boxShadow =
            "0 0 12px rgba(255, 216, 77, 0.8)";

        coinElement.style.zIndex =
            "3";

        coinElement.title =
            "Coin";

        coin.element =
            coinElement;

        this.gameScreen.appendChild(
            coinElement
        );

    }


    // ==========================================
    // 🔄 GAME LOOP
    // ==========================================

    startGameLoop() {

        const loop = () => {

            if (!this.running) {
                return;
            }

            this.update();

            requestAnimationFrame(loop);

        };

        requestAnimationFrame(loop);

    }


    // ==========================================
    // 🧠 UPDATE
    // ==========================================

    update() {

        if (!this.player) {
            return;
        }


        // ==========================================
        // 🧍 PLAYER MOVEMENT
        // ==========================================

        if (
            this.keys["w"] ||
            this.keys["arrowup"]
        ) {
            this.player.y -= this.speed;
        }

        if (
            this.keys["s"] ||
            this.keys["arrowdown"]
        ) {
            this.player.y += this.speed;
        }

        if (
            this.keys["a"] ||
            this.keys["arrowleft"]
        ) {
            this.player.x -= this.speed;
        }

        if (
            this.keys["d"] ||
            this.keys["arrowright"]
        ) {
            this.player.x += this.speed;
        }


        this.keepPlayerInsideGame();

        this.updatePlayerElement();


        // ==========================================
        // 👾 ENEMY AI
        // ==========================================

        this.updateEnemies();


        // ==========================================
        // 🟡 COIN COLLISION
        // ==========================================

        this.checkCoinCollisions();


        // ==========================================
        // 💥 ENEMY COLLISION
        // ==========================================

        this.checkEnemyCollisions();

    }


    // ==========================================
    // 👾 ENEMY CHASE AI
    // ==========================================

    updateEnemies() {

        for (const entity of this.entities) {

            if (
                entity.type !== "enemy" ||
                !entity.element
            ) {
                continue;
            }


            const dx =
                this.player.x - entity.x;

            const dy =
                this.player.y - entity.y;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (distance > 0) {

                entity.x +=
                    (dx / distance) *
                    this.enemySpeed;

                entity.y +=
                    (dy / distance) *
                    this.enemySpeed;

            }


            entity.element.style.left =
                entity.x + "px";

            entity.element.style.top =
                entity.y + "px";

        }

    }


    // ==========================================
    // 🟡 COIN COLLISION
    // ==========================================

    checkCoinCollisions() {

        for (const entity of this.entities) {

            if (entity.type !== "coin") {
                continue;
            }

            if (!entity.element) {
                continue;
            }


            if (
                this.isColliding(
                    this.player,
                    entity
                )
            ) {

                this.score++;

                console.log(
                    `🟡 Coin collected! Score: ${this.score}`
                );


                if (this.scoreElement) {

                    this.scoreElement.textContent =
                        "Score: " + this.score;

                }


                this.moveCoinRandomly(entity);

            }

        }

    }


    // ==========================================
    // 🎲 MOVE COIN RANDOMLY
    // ==========================================

    moveCoinRandomly(coin) {

        const maxX =
            this.gameScreen.clientWidth -
            coin.width -
            10;

        const maxY =
            this.gameScreen.clientHeight -
            coin.height -
            10;


        coin.x =
            Math.max(
                10,
                Math.floor(
                    Math.random() *
                    maxX
                )
            );

        coin.y =
            Math.max(
                50,
                Math.floor(
                    Math.random() *
                    maxY
                )
            );


        coin.element.style.left =
            coin.x + "px";

        coin.element.style.top =
            coin.y + "px";


        console.log(
            `🎲 Coin moved to ${coin.x}, ${coin.y}`
        );

    }


    // ==========================================
    // 💥 ENEMY COLLISION
    // ==========================================

    checkEnemyCollisions() {

        for (const entity of this.entities) {

            if (entity.type !== "enemy") {
                continue;
            }


            if (
                this.isColliding(
                    this.player,
                    entity
                )
            ) {

                this.running = false;

                console.log(
                    "💥 Game Over! The enemy caught the player."
                );

                this.showGameOver();

                return;

            }

        }

    }


    // ==========================================
    // 📐 COLLISION DETECTION
    // ==========================================

    isColliding(a, b) {

        return (

            a.x < b.x + b.width &&

            a.x + a.width > b.x &&

            a.y < b.y + b.height &&

            a.y + a.height > b.y

        );

    }


    // ==========================================
    // 🚧 KEEP PLAYER INSIDE GAME
    // ==========================================

    keepPlayerInsideGame() {

        const maxX =
            this.gameScreen.clientWidth -
            this.player.width;

        const maxY =
            this.gameScreen.clientHeight -
            this.player.height;


        if (this.player.x < 0) {
            this.player.x = 0;
        }

        if (this.player.y < 0) {
            this.player.y = 0;
        }

        if (this.player.x > maxX) {
            this.player.x = maxX;
        }

        if (this.player.y > maxY) {
            this.player.y = maxY;
        }

    }


    // ==========================================
    // 🎯 UPDATE PLAYER ELEMENT
    // ==========================================

    updatePlayerElement() {

        if (!this.playerElement) {
            return;
        }

        this.playerElement.style.left =
            this.player.x + "px";

        this.playerElement.style.top =
            this.player.y + "px";

    }


    // ==========================================
    // 💀 GAME OVER
    // ==========================================

    // ==========================================
// 💀 GAME OVER + RESTART
// ==========================================

showGameOver() {

    const overlay =
        document.createElement("div");

    overlay.style.position =
        "absolute";

    overlay.style.inset =
        "0";

    overlay.style.display =
        "flex";

    overlay.style.alignItems =
        "center";

    overlay.style.justifyContent =
        "center";

    overlay.style.flexDirection =
        "column";

    overlay.style.background =
        "rgba(0, 0, 0, 0.75)";

    overlay.style.color =
        "white";

    overlay.style.zIndex =
        "100";


    const title =
        document.createElement("div");

    title.textContent =
        "GAME OVER";

    title.style.fontSize =
        "40px";

    title.style.fontWeight =
        "bold";


    const score =
        document.createElement("div");

    score.textContent =
        "Score: " + this.score;

    score.style.fontSize =
        "22px";

    score.style.marginTop =
        "10px";


    // ==========================================
    // 🔄 RESTART BUTTON
    // ==========================================

    const restartButton =
        document.createElement("button");

    restartButton.textContent =
        "🔄 Restart";

    restartButton.style.marginTop =
        "20px";

    restartButton.style.padding =
        "12px 24px";

    restartButton.style.fontSize =
        "18px";

    restartButton.style.fontWeight =
        "bold";

    restartButton.style.cursor =
        "pointer";

    restartButton.style.border =
        "none";

    restartButton.style.borderRadius =
        "8px";


    restartButton.addEventListener(
        "click",
        () => {

            this.restartGame();

        }
    );


    overlay.appendChild(title);

    overlay.appendChild(score);

    overlay.appendChild(restartButton);

    this.gameScreen.appendChild(
        overlay
    );

}


// ==========================================
// 🔄 RESTART GAME
// ==========================================

restartGame() {

    console.log(
        "🔄 Restarting JungleGame..."
    );


    this.score = 0;

    this.running = true;


    if (this.scoreElement) {

        this.scoreElement.textContent =
            "Score: 0";

    }


    // Reset player

    if (this.player) {

        this.player.x = 100;

        this.player.y = 100;

    }


    // Reset enemies

    for (const entity of this.entities) {

        if (entity.type === "enemy") {

            entity.x = 300;

            entity.y = 100;

        }

    }


    // Move coins to new positions

    for (const entity of this.entities) {

        if (entity.type === "coin") {

            this.moveCoinRandomly(entity);

        }

    }


    // Remove game-over overlay

    const overlay =
        this.gameScreen.querySelector(
            'div[style*="rgba(0, 0, 0"]'
        );

    if (overlay) {

        overlay.remove();

    }


    this.updatePlayerElement();


    // Update enemy positions

    for (const entity of this.entities) {

        if (
            entity.type === "enemy" &&
            entity.element
        ) {

            entity.element.style.left =
                entity.x + "px";

            entity.element.style.top =
                entity.y + "px";

        }

    }


    this.startGameLoop();

 }
 // ==========================================
// 🤖 AI GAME GENERATOR
// ==========================================
// ==========================================
// 🤖 AI GAME GENERATOR
// ==========================================

aiCreateGame(prompt) {

    console.log(
        "🤖 AI Game Generator:",
        prompt
    );

    if (typeof JungleAI === "undefined") {

        console.error(
            "❌ Jungle AI service is not loaded."
        );

        return;
    }

    const ai = new JungleAI();

    const blueprint =
        ai.generateGame(prompt);

    console.log(
        "📋 JungleGame received blueprint:",
        blueprint
    );

    this.buildGeneratedGame(
        blueprint
    );
}


// ==========================================
// 🎮 BUILD GENERATED GAME
// ==========================================

// ==========================================
// 🎮 BUILD GENERATED GAME
// ==========================================

buildGeneratedGame(blueprint) {

    console.log(
        "🎯 JungleGame preview element:",
        this.previewElement
    );

    console.log(
        "🎮 Sending blueprint to GameBuilder..."
    );

    if (
        typeof JungleGameBuilder === "undefined"
    ) {
        console.error(
            "❌ JungleGameBuilder is not loaded."
        );

        return;
    }

    console.log(
        "🔎 Value being passed to GameBuilder:",
        this.previewElement
    );

    const builder =
        new JungleGameBuilder(
            this.previewElement
        );

    const generatedGame =
        builder.build(blueprint);

    console.log(
        "🎮 Generated game:",
        generatedGame
    );

    return generatedGame;
}

}
