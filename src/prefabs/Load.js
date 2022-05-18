class Load extends Phaser.Scene {
    constructor() {
        super('loading');
    }

    preload() {
        //sets a loading path
        this.load.path = "assets/";

        this.load.atlas('platformer_atlas', 'kenny_sheet.png', 'kenny_sheet.json');
        this.load.image('groundScroll', 'ground.png');
        this.load.image('tall_trees', 'talltrees.png');

        this.load.audio('temporaryJump', 'temp_jump.wav');
        this.load.audio('temporaryCoin', 'temp_coin.wav');
        this.load.audio('temporaryShake', 'temp_shake.wav');
        this.load.audio('temporaryBounce', 'temp_bounce.wav');
    }

    create() {
        this.anims.create({ 
            key: 'walk', 
            frames: this.anims.generateFrameNames('platformer_atlas', {      
                prefix: 'walk',
                start: 1,
                end: 11,
                suffix: '',
                zeroPad: 4 
            }), 
            frameRate: 20,
            repeat: -1 
        });
        this.anims.create({
            key: 'idle',
            defaultTextureKey: 'platformer_atlas',
            frames: [
                { frame: 'front' }
            ],
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            defaultTextureKey: 'platformer_atlas',
            frames: [
                { frame: 'jump' }
            ],
        });
        this.scene.start("Level1");
    }
}