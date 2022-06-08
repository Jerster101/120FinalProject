class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // setup Physics Sprite
        scene.add.existing(this);               // make it real
        scene.physics.add.existing(this);       // add physics body

        // set properties
        this.depth = 2;
        this.body.setMaxVelocity(MAX_X_VEL, MAX_Y_VEL);
        this.invincible = false;
        this.anims.play('player_idle', true);
        this.jumps = 1;
        this.jump = scene.sound.add('jump_sfx', {volume: 0.1});
        console.log(playerHealth);
    }

    create() {
        // turns area around player red but reveals green near player
        // used for following level crystal gained but not yet added to center
        //this.r1 = scene.add.image(this.x, this.y, 'circle');
        //this.r1.depth = 8;
        // erases area around player, could use opposed to desaturate
        //this.r1 = this.add.image(200, 1200, 'circle').setBlendMode(Phaser.BlendModes.ERASE);
        // desaturates area around player, used for when crystal is obtained
        //this.r2 = this.add.image(200, 1200, 'circle2').setBlendMode(Phaser.BlendModes.SATURATION);
        //this.r2.depth = 1;
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
        if ((Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(cursors.space) || Phaser.Input.Keyboard.JustDown(keyW)) && this.jumps > 0) {
            this.setVelocityY(-JUMPHEIGHT);
            this.jump.play();
            this.anims.play('player_jump_up', true);
            this.jumps -= 1;
        }

        if (this.body.onFloor() == true){
            this.jumps = 1;
        }

        // check for death scene
        if(playerHealth <= 0) {
            this.scene.launch("deathScene");
            this.scene.pause("currentScene");
        }

        // image masks follow player
        //if (this.heart1) {
        //    this.heart1.x = this.cameraX;
        //    this.heart1.y = this.cameraY;
        //}
       
    }

    setVulnerable() {
        this.invincible = false;
        this.setAlpha(1);
    }

}