class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    create() {
        // add background image
        var credits_bkg = this.add.sprite(game.config.width/2,game.config.height/2, "credits_bkg");
        credits_bkg.alpha = 0.8;

        // add sound
        var hover = this.sound.add("menuHover_sfx");
        var click = this.sound.add("menuClick_sfx");

        // menu text configuration
        let menuConfig = {
          fontFamily: 'Square',
          fontSize: '15px',
          color: '#2b397c',
          stroke: '#15d681',
          strokeThickness: 4,
          align: 'center'
        }

        // create interactive return to menu text
        this.creditText = this.add.text(game.config.width/2, game.config.height/1.2, 'RETURN TO MENU', menuConfig).setOrigin(0.5).setInteractive()
            .on('pointerover', () => (this.creditText.setStyle({fontSize: '20px', fill: '#d1405a'}), hover.play({volume:0.1})))
            .on('pointerout', () => this.creditText.setStyle({fontSize: '15px', fill: '#2b397c'}))
            .on('pointerdown', () => this.creditText.setStyle({fontSize: '15px', fill: '#d1405a'}))
            .on('pointerup', () => (this.scene.start("menuScene"), click.play({volume:0.1})))
        menuConfig.color = '#15d681',
        menuConfig.stroke = '#15d68100',
        menuConfig.fontSize = '20px',
        this.add.text(game.config.width/2, game.config.height/2.3, 'Lyza Stevens - art, UI,\nlevel design, and sound effects\n\n\nJeremy Dahlberg - enemy AI and level design\n\n\nEamon Sherris-Watt - special platforms and music', menuConfig).setOrigin(0.5);  
    }
}