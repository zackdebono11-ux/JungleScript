// ==========================================
// 🚀 JUNGLE 3D ROCKET
// ==========================================

class Jungle3DRocket {

    constructor(engine) {

        this.engine = engine;
        this.rocket = null;

        console.log("🚀 Jungle3DRocket loaded!");
    }


    // ==========================================
    // 🚀 CREATE ROCKET
    // ==========================================

    create() {

        if (!this.engine) {
            console.error(
                "❌ Jungle3DRocket: Jungle3D engine missing."
            );
            return null;
        }

        if (!this.engine.scene) {
            console.error(
                "❌ Jungle3DRocket: Jungle3D scene missing."
            );
            return null;
        }


        // Remove old rocket

        if (this.rocket) {

            this.engine.scene.remove(
                this.rocket
            );

            this.rocket.geometry.dispose();
            this.rocket.material.dispose();

            this.rocket = null;
        }


        // ==========================================
        // 🚀 ROCKET BODY
        // ==========================================

        const geometry =
            new THREE.ConeGeometry(
                0.7,
                2,
                4
            );

        const material =
            new THREE.MeshStandardMaterial({
                color: 0x00ffff
            });


        this.rocket =
            new THREE.Mesh(
                geometry,
                material
            );


        // ==========================================
        // 📍 START POSITION
        // ==========================================

        this.rocket.position.set(
            0,
            0,
            0
        );
        this.rocket.scale.set(
    3,
    3,
    3
);


        // ==========================================
        // 🔄 ORIENTATION
        // ==========================================

        this.rocket.rotation.x =
            -Math.PI / 2;


        // ==========================================
        // 🌴 ADD TO JUNGLE3D SCENE
        // ==========================================

        this.engine.scene.add(
            this.rocket
        );
        console.log(
    "🚀 ROCKET DEBUG:",
    "position =", this.rocket.position,
    "visible =", this.rocket.visible,
    "scale =", this.rocket.scale,
    "parent =", this.rocket.parent
);


        // Tell Jungle3D about the rocket

        this.engine.player =
            this.rocket;


        console.log(
            "🚀 Spaceship created:",
            this.rocket
        );

        return this.rocket;
    }


    // ==========================================
    // 📍 POSITION
    // ==========================================

    setPosition(x, y, z) {

        if (!this.rocket) {
            return;
        }

        this.rocket.position.set(
            x,
            y,
            z
        );
    }


    // ==========================================
    // 🔄 ROTATION
    // ==========================================

    setRotation(x, y, z) {

        if (!this.rocket) {
            return;
        }

        this.rocket.rotation.set(
            0,
            0,
            0
        );
    }


    // ==========================================
    // 🗑️ REMOVE
    // ==========================================

    remove() {

        if (!this.rocket) {
            return;
        }

        this.engine.scene.remove(
            this.rocket
        );

        this.rocket.geometry.dispose();
        this.rocket.material.dispose();

        this.rocket = null;

        console.log(
            "🚀 Spaceship removed."
        );
    }
}


// ==========================================
// 🌴 GLOBAL ACCESS
// ==========================================

window.Jungle3DRocket =
    Jungle3DRocket;

console.log(
    "🚀 Jungle3DRocket is ready!"
);