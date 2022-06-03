class Pause extends Phaser.Scene {
    constructor() {
        super("pauseScene");
    }

    create() {
        // ensure this scene displays above others
        this.scene.bringToTop();

        var credits_bkg = this.add.sprite(game.config.width/2,game.config.height/2, "credits_bkg");
        credits_bkg.alpha = 0.5;

        let menuConfig = {
            fontFamily: 'Square',
            fontSize: '30px',
            color: '#2b397c',
            stroke: '#15d681',
            strokeThickness: 4,
            align: 'center'
          }
        
        // create menu text
        this.resumeText = this.add.text(game.config.width/2, game.config.height/2.2, 'RESUME', menuConfig).setOrigin(0.5).setInteractive()
            .on('pointerover', () => this.resumeText.setStyle({fontSize: '35px', fill: '#d1405a'}))
            .on('pointerout', () => this.resumeText.setStyle({fontSize: '30px', fill: '#2b397c'}))
            .on('pointerdown', () => this.resumeText.setStyle({fontSize: '30px', fill: '#d1405a'}))
            .on('pointerup', () => {this.scene.stop(), this.scene.resume(currentScene)});
        this.menuText = this.add.text(game.config.width/2, game.config.height/1.7, 'MAIN MENU', menuConfig).setOrigin(0.5).setInteractive()
            .on('pointerover', () => this.menuText.setStyle({fontSize: '35px', fill: '#d1405a'}))
            .on('pointerout', () => this.menuText.setStyle({fontSize: '30px', fill: '#2b397c'}))
            .on('pointerdown', () => this.menuText.setStyle({fontSize: '30px', fill: '#d1405a'}))
            .on('pointerup', () => {this.scene.stop(currentScene), this.scene.start('menuScene')});
        menuConfig.fontSize = '15px';
        this.add.text(game.config.width/2, game.config.height/3, 'Paused', menuConfig).setOrigin(0.5);

        // define keys
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update() {
        // return to game if ESC is pressed again
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.resume(currentScene);
            this.scene.stop();
        }
        
    }
}

