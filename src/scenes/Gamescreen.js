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
        this.ground = this.add.group();
        for(let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'platformer_atlas', 'block').setScale(this.SCALE);
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
        //makes a group of tiles that the player can bounce on
        this.bouncy_ground = this.add.group();
        for(let i = tileSize*2; i < game.config.width-tileSize*13; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize*9, 'platformer_atlas', 'ground_rock').setScale(this.SCALE).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.bouncy_ground.add(groundTile);
        }

        this.bronze_coins = this.add.group();
        for(let i = 0; i < game.config.width; i += tileSize) {
            let coin = this.physics.add.sprite(i, game.config.height - tileSize*2, 'platformer_atlas', 'coin_bronze').setScale(this.SCALE);
            coin.body.allowGravity = false;
            this.bronze_coins.add(coin);
        }
        this.silver_coins = this.add.group();
        for(let i = tileSize*7; i < game.config.width-tileSize*4; i += tileSize) {
            let coin = this.physics.add.sprite(i, game.config.height - tileSize*6, 'platformer_atlas', 'coin_silver').setScale(this.SCALE).setOrigin(0);
            coin.body.allowGravity = false;
            this.silver_coins.add(coin);
        }
        this.gold_coins = this.add.group();
        for(let i = tileSize*2; i < game.config.width-tileSize*13; i += tileSize) {
            let coin = this.physics.add.sprite(i, game.config.height - tileSize*10, 'platformer_atlas', 'coin_gold').setScale(this.SCALE).setOrigin(0);
            coin.body.allowGravity = false;
            this.gold_coins.add(coin);
        }

        this.player = this.physics.add.sprite(game.config.width/2, game.config.height/3, 'platformer_atlas', 'front').setScale(this.SCALE);
        this.player.setMaxVelocity(this.MAX_X_VEL, this.MAX_Y_VEL);

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

        this.cursors = this.input.keyboard.createCursorKeys();

        // add physics collider
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.cloud01);
        this.physics.add.collider(this.player, this.cloud02);

        //coin collision
        this.physics.add.overlap(this.player, this.coins);
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

        //bounce collision
        this.player.setBounce(1, 1);
        this.physics.collide(this.player, this.bouncy_ground);
        this.player.setBounce(0, 0);

        this.cloud01.setBounce(1, 1);
        this.physics.collide(this.cloud01, this.bouncy_ground);
        this.cloud01.setBounce(0, 0);

        this.cloud02.setBounce(1, 1);
        this.physics.collide(this.cloud02, this.bouncy_ground);
        this.cloud02.setBounce(0, 0);

        //when colliding with a coin
        let minDistance = game.config.width;
        this.bronze_coins.getChildren().forEach(function(coin){
            let coinDistance = game.config.width - coin.x - coin.displayWidth /2;
            minDistance = Math.min(minDistance, coinDistance);

            if (this.checkCollision(this.player, coin)) {
                this.bronze_coins.killAndHide(coin);
                this.bronze_coins.remove(coin);
                //this.sound.play('fall');
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
                //this.sound.play('fall');
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
                //this.sound.play('fall');
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