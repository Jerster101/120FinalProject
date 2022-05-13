class Level1 extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    
    preload() {
        this.load.image('enemy', './assets/Enemy.png');
        this.load.image('player', './assets/Player.png');
        this.load.image('tile', './assets/Tile.png');
    }


    create() {
        // variables and settings
        this.physics.world.gravity.y = GRAV;

        // make ground tiles
        this.tileSize = 5;
        this.ground = this.add.group();
        for(let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'tile').setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }

        // set up player
        this.player = this.physics.add.sprite(game.config.width/2, game.config.height/6, 'player').setScale(SCALE);
        this.player.setCollideWorldBounds(true);
        this.player.body.setMaxVelocity(400);

        // set up key input
        cursors = this.input.keyboard.createCursorKeys();
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // add physics collider
        this.physics.add.collider(this.player, this.ground);

        // add enemy
        this.enemy01 = new Enemy(this, 500, 700, 'enemy', 0);
    }

    update() {
        // movement
        if((cursors.left.isDown || keyA.isDown) && this.player.body.touching.down) {
            this.player.setAccelerationX(-MOVESPEED);
            this.player.setFlip(true, false);
        } else if((cursors.right.isDown || keyD.isDown) && this.player.body.touching.down) {
            this.player.setAccelerationX(MOVESPEED);
            this.player.resetFlip();
        } else if (this.player.body.touching.down) {
            this.player.body.setDragX(DRAG);
            this.player.setAccelerationX(0);
        }

        // jumping
        if ((cursors.up.isDown || cursors.space.isDown || keyW.isDown) && this.player.body.touching.down) {
            this.player.setVelocityY(-JUMPHEIGHT);
        }

        //menu
        if (keyESC.isDown) {
            this.scene.start("menuScene");
        }

        // check enemy collision
        if(this.checkCollision(this.player, this.enemy01)) {
            this.scene.start("menuScene");
        }
    }

    checkCollision(a, b) {
        if (a.x < b.x + b.width && 
            a.x + a.width > b.x && 
            a.y < b.y + b.height &&
            a.height + a.y > b.y) {
                return true;
        } else {
            return false;
        }
    }
}