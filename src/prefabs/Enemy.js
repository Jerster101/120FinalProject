class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing scene
        // set properties
        //this.body.setImmovable();
        //this.setOrigin(0, 1);  
    
        // add custom properties    
        this.JUMP_VELOCITY = -600;              
        this.jumpDelay = 2000;
        this.jumpStartTime = Phaser.Math.Between(500, 2500);    // randomize to offset jumps

        // start jumpin'
        this.initJumpTimer(scene);
    }

    initJumpTimer(scene) {
        // attach timer event to scene context
        scene.jumpTimer = scene.time.addEvent({
            delay: this.jumpDelay,
            loop: true,
            startAt: this.jumpStartTime,
            callbackScope: this,    // keep callback scoped to Jumper object
            callback: () => {
                this.body.setVelocityY(this.JUMP_VELOCITY);
            }
        });
    }

    update() {
        // call Physics Sprite update
        super.update();
    }
}