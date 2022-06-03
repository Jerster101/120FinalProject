class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
        // set currentScene var for pause use
        currentScene = 'menuScene';

        // config title anims
        var titleConfig = {
            key: "float",
            frames: this.anims.generateFrameNumbers("title", {
                start: 0, 
                end: 9, 
                first: 0
            }),
            frameRate: 6,
            repeat: -1
        };
        // add background images & title anim
        var menu_purple = this.add.sprite(game.config.width/2,game.config.height/2, "menu_purple");
        menu_purple.alpha = 0.5;
        var menu_bkg = this.add.sprite(game.config.width/2,game.config.height/2, "menu_bkg");
        menu_bkg.alpha = 0.4;
        this.anims.create(titleConfig);
        this.add.sprite(game.config.width/2,game.config.height/2.5, "title").play("float");

        // menu text configuration
        let menuConfig = {
          fontFamily: 'Square',
          fontSize: '40px',
          color: '#2b397c',
          stroke: '#15d681',
          strokeThickness: 5,
          align: 'center'
        }

        // create interactive menu text
        this.startText = this.add.text(game.config.width/2, game.config.height/1.4, 'START', menuConfig).setOrigin(0.5).setInteractive()
            .on('pointerover', () => this.startText.setStyle({fontSize: '45px', fill: '#d1405a'}))
            .on('pointerout', () => this.startText.setStyle({fontSize: '40px', fill: '#2b397c'}))
            .on('pointerdown', () => this.startText.setStyle({fontSize: '40px', fill: '#d1405a'}))
            .on('pointerup', () => this.scene.start("coreScene"))
        menuConfig.fontSize = '30px';
        menuConfig.strokeThickness = 4;
        this.creditText = this.add.text(game.config.width/2, game.config.height/1.15, 'CREDITS', menuConfig).setOrigin(0.5).setInteractive();
        this.creditText.on('pointerover', () => this.creditText.setStyle({fontSize: '35px', fill: '#d1405a'}))
        this.creditText.on('pointerout', () => this.creditText.setStyle({fontSize: '30px', fill: '#2b397c'}))
        .on('pointerdown', () => this.creditText.setStyle({fontSize: '30px', fill: '#d1405a'}))
        this.creditText.on('pointerup', () => this.scene.start("creditsScene"))
    }
}


