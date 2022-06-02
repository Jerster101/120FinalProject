class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    preload() {
        this.load.image("menu_bkg", "./assets/core/RGB_crystal_core.png");
        this.load.image("menu_purple", "./assets/menu/rainbow_behindcore.jpg");
        this.load.spritesheet("title", "./assets/menu/title_spritesheet.png", {
            frameWidth: 483,
            frameHeight: 107
        });
    }
    create() {
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

        // create menu text
        this.startText = this.add.text(game.config.width/2, game.config.height/1.4, 'START', menuConfig).setOrigin(0.5).setInteractive()
            .on('pointerover', () => this.startText.setStyle({fontSize: '45px', fill: '#d1405a'}))
            .on('pointerout', () => this.startText.setStyle({fontSize: '40px', fill: '#2b397c'}))
            .on('pointerdown', () => this.startText.setStyle({fontSize: '40px', fill: '#d1405a'}))
            .on('pointerup', () => this.scene.start("coreScene"))
        menuConfig.fontSize = '15px';
        menuConfig.strokeThickness = 4;
        this.creditText = this.add.text(game.config.width/2, game.config.height/1.1, 'CREDITS', menuConfig).setOrigin(0.5).setInteractive();
        this.creditText.on('pointerover', () => this.creditText.setStyle({fontSize: '20px', fill: '#d1405a'}))
        this.creditText.on('pointerout', () => this.creditText.setStyle({fontSize: '15px', fill: '#2b397c'}))
        .on('pointerdown', () => this.creditText.setStyle({fontSize: '15px', fill: '#d1405a'}))
        this.creditText.on('pointerup', () => this.scene.start("creditsScene"))
        //this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding +100, 'Press ESC to return to the menu', menuConfig).setOrigin(0.5);  

        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {  
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
          // Start game
          this.scene.start("coreScene");
        }
    }
}