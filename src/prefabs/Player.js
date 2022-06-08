class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // setup Physics Sprite
        scene.add.existing(this);               // make it real
        scene.physics.add.existing(this);       // add physics body

        // set properties
        this.depth = 5;
        this.body.setMaxVelocity(MAX_X_VEL, MAX_Y_VEL);
        this.invincible = false;
        this.anims.play('player_idle', true);
        this.jumps = 1;
        this.jump = scene.sound.add('jump_sfx', {volume: 0.1});
        this.colorMask = scene.add.image(this.x, this.y, 'white_fill').setBlendMode(Phaser.BlendModes.MULTIPLY).setDepth(4); 
        this.recolor(scene);
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

        // color masks follow player
        if (this.colorMask) {
            this.colorMask.x = this.x;
            this.colorMask.y = this.y;
        }
    }

    setVulnerable() {
        this.invincible = false;
        this.setAlpha(1);
    }

    recolor(scene) {
        // color revealing mask set to game state
        if (GameState == 0) {   
            //black & white full mask
            this.colorMask = scene.add.image(this.x, this.y, 'white_fill').setBlendMode(Phaser.BlendModes.HUE).setDepth(4);
        } else if (GameState == 1) {                        
            //red circle mask
            this.colorMask.destroy();
            this.colorMask = scene.add.image(this.x, this.y, 'red_circle_white').setBlendMode(Phaser.BlendModes.COLOR).setDepth(4);    
        } else if (GameState == 2) {                 
            //red full mask
            this.colorMask.destroy();
            this.colorMask = scene.add.image(this.x, this.y, 'red_fill').setBlendMode(Phaser.BlendModes.HUE).setDepth(4);     
        } else if (GameState == 3) {    
            //red & green circle mask
            this.colorMask.destroy();
            this.colorMask = scene.add.image(this.x, this.y, 'red_yellow').setBlendMode(Phaser.BlendModes.MULTIPLY).setDepth(4);    
        } else if (GameState == 4) {    
            //red & green full mask
            this.colorMask.destroy();
            this.colorMask = scene.add.image(this.x, this.y, 'yellow_fill').setBlendMode(Phaser.BlendModes.MULTIPLY).setDepth(4);    
        } else if (GameState == 5) {    
            //rgb circle mask
            this.colorMask.destroy();
            this.colorMask = scene.add.image(this.x, this.y, 'yellow_border').setBlendMode(Phaser.BlendModes.MULTIPLY).setDepth(4);    
        } else if (GameState == 6) {    
            // invisible mask, full color
            this.colorMask.destroy();
            this.colorMask = scene.add.image(this.x, this.y, 'white_fill').setBlendMode(Phaser.BlendModes.MULTIPLY).setDepth(4);   
        }
    }
}