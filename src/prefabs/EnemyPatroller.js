class EnemyPatroller extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, frame, patrol) {
        // call Phaser Physics Sprite constructor
        super(scene, x, y, key, frame);
        // setup Physics Sprite
        scene.add.existing(this);               // make it real
        scene.physics.add.existing(this);       // add physics body

        // set properties
        //this.body.setImmovable();
        //this.setOrigin(0, 1);

        // custom properties
        this.movingRight = true;
        this.MOVESPEED = 100;
        this.timedEvent = scene.time.addEvent({ delay: patrol, callback: this.changeMovement, callbackScope: this, loop: true});
    }

    update() {
        if (this.movingRight) {
            this.body.setVelocityX(this.MOVESPEED);
        } else {
            this.body.setVelocityX(-this.MOVESPEED);
        }
    }

    changeMovement() {
        if (this.movingRight) this.movingRight = false;
        else this.movingRight = true;
    }
}