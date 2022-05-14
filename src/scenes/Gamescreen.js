class Gamescreen extends Phaser.Scene {
    constructor() {
        super("Level1");
    }

    create(){

        this.ACCELERATION = 500;
        this.MAX_X_VEL = 500;   // pixels/second
        this.MAX_Y_VEL = 5000;
        this.DRAG = 600;
        this.SCALE = 0.5;

        //predecessor to collapsing platforms
        this.cloud01 = this.physics.add.sprite(600, 200, 'platformer_atlas', 'cloud_1');
        this.cloud01.body.setAllowGravity(false).setVelocityX(25);
        this.cloud02 = this.physics.add.sprite(200, 250, 'platformer_atlas', 'cloud_2');
        this.cloud02.body.setAllowGravity(false).setVelocityX(45);

        //some ground
        this.ground =this.add.group();
        for(let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'platformer_atlas', 'block').setScale(this.SCALE)
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        for(let i = tileSize*7; i < game.config.width-tileSize*4; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize*5, 'platformer_atlas', 'block').setScale(this.SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        for(let i = tileSize*2; i < game.config.width-tileSize*13; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize*9, 'platformer_atlas', 'block').setScale(this.SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        this.player = this.physics.add.sprite(game.config.width/2, game.config.height/3, 'platformer_atlas', 'front').setScale(this.SCALE);
        this.player.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);

        this.cursors = this.input.keyboard.createCursorKeys();

        // add physics collider
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.cloud02);
    }

    update() {

        //character animations
        if(this.cursors.left.isDown) {
            this.player.body.setAccelerationX(-this.ACCELERATION);
            this.player.setFlip(true, false);
            this.player.anims.play('walk', true);

        } else if(this.cursors.right.isDown) {
            this.player.body.setAccelerationX(this.ACCELERATION);
            this.player.resetFlip();
            this.player.anims.play('walk', true);

        } else {
            this.player.body.setAccelerationX(0);
            this.player.body.setDragX(this.DRAG);
            this.player.anims.play('idle');

        }

        if(!this.player.body.touching.down) {
            this.player.anims.play('jump', true);
        }
        //jumping
        if(this.player.body.touching.down && Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            this.player.setVelocityY(-1000);
        }
        //world wrapping
        this.physics.world.wrap(this.cloud01, this.cloud01.width/2);
        this.physics.world.wrap(this.cloud02, this.cloud02.width/2);
        this.physics.world.wrap(this.player, 0);

        this.player.setBounce(0, 4);
        this.physics.collide(this.player, this.cloud01);
        this.player.setBounce(0, 0);
    }
}