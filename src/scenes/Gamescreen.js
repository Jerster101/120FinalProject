class Gamescreen extends Phaser.Scene {
    constructor() {
        super("Level1");
    }

    preload(){
        this.load.atlas('player_atlas', 'Character_actions.png', 'sprites.json');
    }

    create(){

        this.VELOCITY = 500;
        this.AVATAR_SCALE = 0.5;

        this.anims.create({
            key: 'Walk_left',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'Walk_left_',
                frames: [1, 2, 3, 2],
                suffix: '',
                zeroPad: 3
            }),
            frameRate: 20,
            repeat: -1,
        });
        this.anims.create({
            key: 'Walk_right',
            frames: this.anims.generateFrameNames('player_atlas', {
                prefix: 'Walk_right_',
                frames: [1, 2, 3, 2],
                suffix: '',
                zeroPad: 3
            }),
            frameRate: 20,
            repeat: -1,
        });


        this.player = this.physics.add.sprite(game.config.width/2, game.config.height/2, 'player_atlas', 'Idle_001').setScale(this.AVATAR_SCALE);

        cursors = this.input.keyboard.createCursorKeys();
    }

    update(){
        if(cursors.left.isDown) {
            this.player.body.setVelocityX(-this.VELOCITY);
            this.player.anims.play('Walk_left', true);

        } else if(cursors.right.isDown) {
            this.player.body.setVelocityX(this.VELOCITY);
            this.player.anims.play('Walk_right', true);
        }
    }
}