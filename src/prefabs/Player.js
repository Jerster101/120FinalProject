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
    create() {
        // create three hearts
        var heart1 = this.add.sprite(game.config.width/2, game.config.height/2, 'heart').BringToTop();
        var heart2 = this.add.sprite(this, this, 'heart');
        var heart3 = this.add.sprite(400, 40, 'heart');
        hearts = [heart1, heart2, heart3];
        hearts.fixedtoCamera = true;

        // create three outlined hearts
        var heartOutline1 = this.add.sprite(0, 0, 'heart_outline');
        var heartOutline2 = this.add.sprite(400, 40, 'heart_outline');
        var heartOutline3 = this.add.sprite(400, 40, 'heart_outline');
        heartOutlines = [heartOutline1, heartOutline2, heartOutline3];

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

        // check for death scene
        if(playerHealth <= 0) {
            this.scene.launch("deathScene");
            this.scene.pause("currentScene");
        }
    }

    setVulnerable() {
        this.invincible = false;
        this.setAlpha(1);
    }
}