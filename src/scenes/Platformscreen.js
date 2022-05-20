class Platformscreen extends Phaser.Scene {
    constructor() {
        super("Tutorial2");
    }

    create() {

        //var alreadyShook;
        this.cameras.main.setBackgroundColor('#227B96');

        this.clouds = this.add.group();
        for(let i = 0; i < game.config.width; i += cloudSize) {
            let cloudTile = this.physics.add.sprite(i, game.config.height - cloudSize*3, 'platformer_atlas', 'cloud_3').setScale(SCALE);
            cloudTile.body.immovable = true;
            cloudTile.body.allowGravity = false;
            this.clouds.add(cloudTile);
        }
        //makes a group of tiles that the player can bounce on
        this.bouncy_ground = this.add.group();
        for(let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'platformer_atlas', 'ground_rock').setScale(SCALE);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.bouncy_ground.add(groundTile);
        }

        this.shaking_ground = this.add.group();
        for(let i = 0; i < game.config.width; i += tileSize) {
            let shakyTile = this.physics.add.sprite(i, game.config.height - tileSize*10, 'platformer_atlas', 'ground_sand').setScale(SCALE);
            shakyTile.body.immovable = true;
            shakyTile.body.allowGravity = false;
            this.shaking_ground.add(shakyTile);
        }

        this.player = this.physics.add.sprite(game.config.width/2, game.config.height/3, 'platformer_atlas', 'front').setScale(SCALE);
        this.player.setMaxVelocity(MAX_X_VEL, MAX_Y_VEL);

        cursors = this.input.keyboard.createCursorKeys();

        //should allow us to not fall through the platforms
        this.physics.add.collider(this.player, this.clouds, null, checkOneWay, this);
        //allows us to call a bounce function when the player lands on bouncy tiles
        this.physics.add.collider(this.player, this.bouncy_ground, bouncePlayer, null, this);
        //allows us to land on some tiles and start a reaction, note the fact that the functions are in two different places for the different platforms, this is very important
        this.physics.add.collider(this.player, this.shaking_ground, shakePlatform, null, this);
        //allows us to switch scenes
        this.input.keyboard.on('keydown', sceneSwitcher);

        //the function that allows us to stand on platforms as we wish, and fall through them when we want to as well
        function checkOneWay(player, platform) {
            if(player.y < platform.y && !cursors.down.isDown) {
                return true;
            }
            else {
                return false;
            }
        }

        //the player can bounce on select tiles with this function, and by holding down the jump button, can bounce higher
        function bouncePlayer(player, tile) {
            this.sound.play('temporaryBounce');
            if(cursors.up.isDown) {
                player.setVelocityY(-2000);
            }
            else {
                player.setVelocityY(-700);
            }
            this.tweens.add({
                targets: tile,
                yoyo: true,
                y: {
                    from: tile.y,
                    to: tile.y + 2 * 1
                },
                ease: 'Linear',
                duration: 50,
            });
        }
        //function to cause the platform to shake and then be destroyed
        function shakePlatform(player, platform) {
            /*trying to figure out how to get the audio to play once for each block you step on, and not loop
            or stop when running on multiple blocks, haven't worked it out yet
            if(!alreadyShook){
                this.sound.play('temporaryShake');
                alreadyShook = true;
            }*/
            if(player.body.blocked.down) {      //if the player is standing on the platform
                this.cameras.main.shake(200, 0.001);        //then shake the camera
                //this is a global variable we have to use so that Phaser doesn't get confused
                var ourScene = this;
                var tween = this.tweens.add({
                    targets: platform,
                    yoyo: true,
                    repeat: 10,
                    x: {    //if the player is not on the block, then shake the block 
                        from: platform.x,
                        to: platform.x + 2 *1
                    },
                    ease: 'Linear',
                    duration: 50,
                    onComplete: function() {
                        destroyPlatform.call(ourScene, platform);
                    }
                });
            }
        }
        //function to destroy the platforms specifically, not sure if this needs to be seperate, we can decide later
        function destroyPlatform(platform) {
            //alreadyShook = false;
            var tween = this.tweens.add({
                targets: platform,
                alpha: 0,
                y: "+=25",
                ease: 'Linear',
                duration: 100,
                onComplete: function() {
                    destroyGameObject(platform);
                }
            });
        }
        //function to destroy game objects, this one probably should be kept seperate
        function destroyGameObject(gameObject) {
            gameObject.destroy();
        }
    }

    update() {

        //player movements and animations
        if(cursors.left.isDown) {
            this.player.body.setAccelerationX(-ACCELERATION);
            this.player.setFlip(true, false);
            this.player.anims.play('walk', true);

        } else if(cursors.right.isDown) {
            this.player.body.setAccelerationX(ACCELERATION);
            this.player.resetFlip();
            this.player.anims.play('walk', true);

        } else {
            this.player.body.setAccelerationX(0);
            this.player.body.setDragX(DRAG);
            this.player.anims.play('idle');
        }

        if(!this.player.body.touching.down) {
            this.player.anims.play('jump', true);
        }
        //jumping
        if(this.player.body.touching.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.player.setVelocityY(-1000);
            this.sound.play('temporaryJump');
        }
        this.physics.world.wrap(this.player, 0);
    }
}