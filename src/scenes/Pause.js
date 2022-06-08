class Pause extends Phaser.Scene {
    constructor() {
        super("pauseScene");
    }

    create() {
        // ensure this scene displays above others
        this.scene.bringToTop();

        // add color overlay background over game scene
        var credits_bkg = this.add.sprite(game.config.width/2,game.config.height/2, "credits_bkg");
        credits_bkg.alpha = 0.6;

        // add sound
        var hover = this.sound.add("menuHover_sfx");
        var click = this.sound.add("menuClick_sfx");

        // config menu text
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
            .on('pointerover', () => (this.resumeText.setStyle({fontSize: '35px', fill: '#d1405a'}), hover.play({volume:0.1})))
            .on('pointerout', () => this.resumeText.setStyle({fontSize: '30px', fill: '#2b397c'}))
            .on('pointerdown', () => this.resumeText.setStyle({fontSize: '30px', fill: '#d1405a'}))
            .on('pointerup', () => {this.scene.stop(), this.scene.resume(currentScene), this.scene.stop(), click.play({volume:0.1})});
        this.menuText = this.add.text(game.config.width/2, game.config.height/1.7, 'MAIN MENU', menuConfig).setOrigin(0.5).setInteractive()
            .on('pointerover', () => (this.menuText.setStyle({fontSize: '35px', fill: '#d1405a'}), hover.play({volume:0.1})))
            .on('pointerout', () => this.menuText.setStyle({fontSize: '30px', fill: '#2b397c'}))
            .on('pointerdown', () => this.menuText.setStyle({fontSize: '30px', fill: '#d1405a'}))
            .on('pointerup', () => {this.scene.stop(currentScene), this.scene.start('menuScene'), click.play({volume:0.1})});
        menuConfig.fontSize = '15px';
        this.add.text(game.config.width/2, game.config.height/3, 'Paused', menuConfig).setOrigin(0.5);
    }
}

