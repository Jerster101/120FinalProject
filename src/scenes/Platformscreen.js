class Platformscreen extends Phaser.Scene {
    constructor() {
        super("Level2");
    }

    create() {

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

        this.player = this.physics.add.sprite(game.config.width/2, game.config.height/3, 'platformer_atlas', 'front').setScale(SCALE);
        this.player.setMaxVelocity(MAX_X_VEL, MAX_Y_VEL);

        cursors = this.input.keyboard.createCursorKeys();

        function checkOneWay(player, platform) {
            if(player.y < platform.y && !cursors.down.isDown) {
                return true;
            }
            else {
                return false;
            }
        }
        //should allow us to not fall through the platforms
        this.physics.add.collider(this.player, this.clouds, null, checkOneWay, this);
        //allows us to switch scenes
        this.input.keyboard.on('keydown', sceneSwitcher);
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
        }
        this.physics.world.wrap(this.player, 0);

        //bounce collision
        this.player.setBounce(1, 1);
        this.physics.collide(this.player, this.bouncy_ground);
        this.player.setBounce(0, 0);
    }
}