class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // setup Physics Sprite
        scene.add.existing(this);               // make it real
        scene.physics.add.existing(this);       // add physics body

        // set properties
        this.depth = 2;
        this.body.setMaxVelocity(MAX_X_VEL, MAX_Y_VEL);
        playerHealth = 99;
        this.invincible = false;
    }

    update() {
        // movement
        if(cursors.left.isDown || keyA.isDown) {
            this.anims.play('player_run', true);
            if (this.body.velocity.x > 0) {
                this.body.setDragX(DRAG);
                this.setAccelerationX(0);
            } else {
                this.setAccelerationX(-ACCELERATION);
                this.setFlip(true, false);
            }
        } else if((cursors.right.isDown || keyD.isDown) && this.body.onFloor) {
            this.anims.play('player_run', true);
            if (this.body.velocity.x < 0) {
                this.body.setDragX(DRAG);
                this.setAccelerationX(0);
            } else {
            this.setAccelerationX(ACCELERATION);
            this.resetFlip();
            }

        } else if (this.body.onFloor) {
            this.body.setDragX(DRAG);
            this.setAccelerationX(0);
            if (this.anims.isPlaying && this.anims.currentAnim.key == 'player_run') {
                this.anims.play('player_idle', true);
            }
        }

        // jumping
        if (Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(cursors.space) || Phaser.Input.Keyboard.JustDown(keyW) && this.body.onFloor) {
            this.setVelocityY(-JUMPHEIGHT);
            this.anims.play('player_jump_up', true);

        }
    }
}