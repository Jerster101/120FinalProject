class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }
    preload() {
        this.load.image("credits_bkg", "./assets/menu/credits_bkg.jpg");
    }
    create() {
        var credits_bkg = this.add.sprite(game.config.width/2,game.config.height/2, "credits_bkg");
        credits_bkg.alpha = 0.8;
        // menu text configuration
        let menuConfig = {
          fontFamily: 'Square',
          fontSize: '15px',
          color: '#2b397c',
          stroke: '#15d681',
          strokeThickness: 4,
          align: 'center'
        }

        // create menu text
        this.creditText = this.add.text(game.config.width/2, game.config.height/1.1, 'RETURN TO MENU', menuConfig).setOrigin(0.5).setInteractive();
        this.creditText.on('pointerover', () => this.creditText.setStyle({fontSize: '20px', fill: '#d1405a'}))
        this.creditText.on('pointerout', () => this.creditText.setStyle({fontSize: '15px', fill: '#2b397c'}))
        this.creditText.on('pointerup', () => this.scene.start("menuScene"))
        menuConfig.color = '#15d681',
        menuConfig.stroke = '#15d68100',
        menuConfig.fontSize = '20px',
        this.add.text(game.config.width/2, game.config.height/2, 'Lyza Stevens - art, UI, and Level design\n\n\nJeremy Dahlberg - enemy AI and level design\n\n\nEamon Sherris-Watt - special platforms,\n music, and sound effects', menuConfig).setOrigin(0.5);  

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