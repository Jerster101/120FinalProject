class Buttonscreen extends Phaser.Scene {
    constructor() {
        super("Tutorial3")
    }
    create() {
        this.cameras.main.setBackgroundColor('#FFFFFF');

        //grounds
        this.ground = this.add.group();
        for(let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'platformer_atlas', 'block').setScale(SCALE);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        for(let i = tileSize*3; i < game.config.width-tileSize*30; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize*4, 'platformer_atlas', 'block').setScale(SCALE);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        for(let i = tileSize*17; i < game.config.width-tileSize*10; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize*9, 'platformer_atlas', 'block').setScale(SCALE);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        for(let i = tileSize*4; i < game.config.width-tileSize*20; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize*13, 'platformer_atlas', 'block').setScale(SCALE);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        //platform that is partially see through and can't be interacted with until you press the button
        this.activatablePlatform = this.add.group();
        for(let i = tileSize*7; i < game.config.width-tileSize*16; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize*6, 'platformer_atlas', 'crate').setScale(SCALE);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.activatablePlatform.add(groundTile);
        }
        this.bluePlatform.setAlpha(0.5);

        this.player = this.physics.add.sprite(game.config.width/2, game.config.height/3, 'platformer_atlas', 'front').setScale(SCALE);
        this.player.setMaxVelocity(MAX_X_VEL, MAX_Y_VEL);

        this.blueButton = this.physics.add.sprite(155, game.config.height - tileSize * 5, 'platformer_atlas', 'switch_blue_off').setScale(SCALE);
        this.blueButton.setPushable(false);

        let pressedBlueButton = this.physics.add.sprite(155, game.config.height - tileSize * 5, 'platformer_atlas', 'switch_blue_on').setScale(SCALE);
        pressedBlueButton.setPushable(false);

        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.ground, this.blueButton);
        this.physics.add.collider(this.ground, pressedBlueButton);
        this.physics.add.collider(this.player, pressedBlueButton);
        //unique collision between player and switch
        this.physics.add.collider(this.player, this.blueButton, pressButton, null, this);

        //finally got the button pressing mechanic to work, it's stupid how it works though, so if you can get it to work differently that'd be fine
        function pressButton(player, button){
            if(player.x > button.x - 20 && player.x < button.x + 20) {
                button.destroy();
                this.activatablePlatform.setAlpha(1);
                this.physics.add.collider(this.player, this.activatablePlatform);
            }
        }

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

        this.player.body.collideWorldBounds = true;
    }
}