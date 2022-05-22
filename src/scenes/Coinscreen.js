class Coinscreen extends Phaser.Scene {
    constructor() {
        super("Tutorial1");
    }

    create() {

        this.duskSky = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'duskSky').setOrigin(0);
        this.duskSky.setDepth(-2);

        //predecessor to collapsing platforms
        this.cloud01 = this.physics.add.sprite(600, 200, 'platformer_atlas', 'cloud_1');
        this.cloud01.body.setAllowGravity(false).setVelocityX(25);
        this.cloud02 = this.physics.add.sprite(200, 250, 'platformer_atlas', 'cloud_2');
        this.cloud02.body.setAllowGravity(false).setVelocityX(45);

        //some ground
        this.ground = this.add.group();
        for(let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'platformer_atlas', 'block').setScale(SCALE);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        for(let i = tileSize*7; i < game.config.width-tileSize*4; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize*5, 'platformer_atlas', 'block').setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        for(let i = tileSize*2; i < game.config.width-tileSize*13; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize*9, 'platformer_atlas', 'block').setScale(SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }

        this.bronze_coins = this.add.group();
        for(let i = 0; i < game.config.width; i += tileSize) {
            let coin = this.physics.add.sprite(i, game.config.height - tileSize*2, 'platformer_atlas', 'coin_bronze').setScale(SCALE);
            coin.body.allowGravity = false;
            this.bronze_coins.add(coin);
        }
        this.silver_coins = this.add.group();
        for(let i = tileSize*7; i < game.config.width-tileSize*4; i += tileSize) {
            let coin = this.physics.add.sprite(i, game.config.height - tileSize*6, 'platformer_atlas', 'coin_silver').setScale(SCALE).setOrigin(0);
            coin.body.allowGravity = false;
            this.silver_coins.add(coin);
        }
        this.gold_coins = this.add.group();
        for(let i = tileSize*2; i < game.config.width-tileSize*13; i += tileSize) {
            let coin = this.physics.add.sprite(i, game.config.height - tileSize*10, 'platformer_atlas', 'coin_gold').setScale(SCALE).setOrigin(0);
            coin.body.allowGravity = false;
            this.gold_coins.add(coin);
        }

        this.player = this.physics.add.sprite(game.config.width/2, game.config.height/3, 'platformer_atlas', 'front').setScale(SCALE);
        this.player.setMaxVelocity(MAX_X_VEL, MAX_Y_VEL);

        //jump particles
        let particles = this.add.particles('star');
        particles.setDepth(-1);
    
        this.jumpEmitter = particles.createEmitter({
            follow: this.player,
            quantity: 30,
            scale: {start: 1.0, end: 0.25},  // start big, end small
            lifespan: 1600,
            setBlendMode: Phaser.BlendModes.ADD,
        });

        this.score = 0;
        //score stuff
        let scoreConfig = {
            fontFamily: 'Romulus',
            fontSize: '44px',
            backgroundColor: '#000000',
            color: '#F0F306',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
        }
        this.currentScore = this.add.text(50, 20, 'SCORE: ' + `${this.score}`, scoreConfig);

        //this needs to be made in order for the control inputs to work (as far as I can figure anyway)
        cursors = this.input.keyboard.createCursorKeys();

        // add physics collider
        this.physics.add.collider(this.player, this.ground);

        //some colored objects to show the polish that we might want to add
        var r1 = this.add.rectangle(150, 200, 200, 150, 0xff0000).setBlendMode(Phaser.BlendModes.MULTIPLY);
        var r2 = this.add.rectangle(350, 200, 200, 150, 0xff7519).setBlendMode(Phaser.BlendModes.MULTIPLY);
        var r3 = this.add.rectangle(550, 200, 200, 150, 0xffff00).setBlendMode(Phaser.BlendModes.MULTIPLY);
        var r4 = this.add.rectangle(750, 200, 200, 150, 0x00ff00).setBlendMode(Phaser.BlendModes.MULTIPLY);
        var r5 = this.add.rectangle(950, 200, 200, 150, 0x0000ff).setBlendMode(Phaser.BlendModes.MULTIPLY);
        var r6 = this.add.rectangle(1150, 200, 200, 150, 0x080080).setBlendMode(Phaser.BlendModes.MULTIPLY);

        //coin collision, this is different for each coin, and doesn't result in any issues with distance detection
        this.physics.add.overlap(this.player, this.bronze_coins, (obj1, obj2) => {
            this.sound.play('temporaryCoin');
            this.score += 10;
            this.currentScore.text = 'SCORE: ' + `${this.score}`;
            obj2.destroy();

        });

        this.physics.add.overlap(this.player, this.silver_coins, (obj1, obj2) => {
            this.sound.play('temporaryCoin');
            this.score += 25;
            this.currentScore.text = 'SCORE: ' + `${this.score}`;
            obj2.destroy();

        });

        this.physics.add.overlap(this.player, this.gold_coins, (obj1, obj2) => {
            this.sound.play('temporaryCoin');
            this.score += 50;
            this.currentScore.text = 'SCORE: ' + `${this.score}`;
            obj2.destroy();

        });
        //allows us to switch scenes
        this.input.keyboard.on('keydown', sceneSwitcher);
    }

    update() {

        //character animations
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
            //this.jumpEmitter.explode();
            this.sound.play('temporaryJump');
        }
        //world wrapping
        this.physics.world.wrap(this.cloud01, this.cloud01.width/2);
        this.physics.world.wrap(this.cloud02, this.cloud02.width/2);
        this.physics.world.wrap(this.player, 0);

    }
}