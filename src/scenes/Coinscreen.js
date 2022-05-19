class Coinscreen extends Phaser.Scene {
    constructor() {
        super("Tutorial1");
    }

    create() {

        this.tall_trees = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'tall_trees').setOrigin(0);

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
        this.player.setBounce(0.0);

        this.score = 0;
        //score stuff
        let scoreConfig = {
            fontFamily: 'Romulus',
            fontSize: '44px',
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

        //coin collision
        this.physics.add.overlap(this.player, this.coins);

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
            this.sound.play('temporaryJump');
        }
        //world wrapping
        this.physics.world.wrap(this.cloud01, this.cloud01.width/2);
        this.physics.world.wrap(this.cloud02, this.cloud02.width/2);
        this.physics.world.wrap(this.player, 0);

        //when colliding with a coin
        let minDistance = game.config.width;
        this.bronze_coins.getChildren().forEach(function(coin){
            let coinDistance = game.config.width - coin.x - coin.displayWidth /2;
            minDistance = Math.min(minDistance, coinDistance);

            if (this.checkCollision(this.player, coin)) {
                this.bronze_coins.killAndHide(coin);
                this.bronze_coins.remove(coin);
                this.sound.play('temporaryCoin');
                this.score += 10;
                this.currentScore.text = 'SCORE: ' + `${this.score}`;
            }
        }, this);
        this.silver_coins.getChildren().forEach(function(coin){
            let coinDistance = game.config.width - coin.x - coin.displayWidth /2;
            minDistance = Math.min(minDistance, coinDistance);

            if (this.checkCollision(this.player, coin)) {
                this.silver_coins.killAndHide(coin);
                this.silver_coins.remove(coin);
                this.sound.play('temporaryCoin');
                this.score += 25;
                this.currentScore.text = 'SCORE: ' + `${this.score}`;
            }
        }, this);
        this.gold_coins.getChildren().forEach(function(coin){
            let coinDistance = game.config.width - coin.x - coin.displayWidth /2;
            minDistance = Math.min(minDistance, coinDistance);

            if (this.checkCollision(this.player, coin)) {
                this.gold_coins.killAndHide(coin);
                this.gold_coins.remove(coin);
                this.sound.play('temporaryCoin');
                this.score += 50;
                this.currentScore.text = 'SCORE: ' + `${this.score}`;
            }
        }, this);
    }
    checkCollision(player, coin) {
        if (player.x < coin.x + coin.width && 
            player.x + player.width > coin.x && 
            player.y < coin.y + coin.height &&
            player.height + player.y > coin.y) {
                return true;
        } else {
            return false;
        }
    }
}