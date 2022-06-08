class End extends Phaser.Scene {
    constructor() {
        super("endScene");
    }

    create() {
        // ensure this scene displays above others
        this.scene.bringToTop();

        GameState = 0;

        // add color overlay background over game scene
        var end_bkg = this.add.sprite(game.config.width/2,game.config.height/2, "credits_bkg");
        end_bkg.alpha = 0.6;

        // add sound
        var hover = this.sound.add("menuHover_sfx");
        var click = this.sound.add("menuClick_sfx");

        // config menu text
        let menuConfig = {
            fontFamily: 'Square',
            fontSize: '15px',
            color: '#2b397c',
            stroke: '#15d681',
            strokeThickness: 4,
            align: 'center'
        }
        
        // add text
        this.menuText = this.add.text(game.config.width/2, game.config.height/1.7, 'MAIN MENU', menuConfig).setOrigin(0.5).setInteractive()
        .on('pointerover', () => (this.menuText.setStyle({fontSize: '20px', fill: '#d1405a'}), hover.play({volume:0.1})))
        .on('pointerout', () => this.menuText.setStyle({fontSize: '15px', fill: '#2b397c'}))
        .on('pointerdown', () => this.menuText.setStyle({fontSize: '15px', fill: '#d1405a'}))
        .on('pointerup', () => {this.scene.stop(currentScene), this.scene.start('menuScene'), playerHealth = maxHealth, click.play({volume:0.1})});
        menuConfig.fontSize = '35px';
        this.add.text(game.config.width/2, game.config.height/3, 'Color has been restored', menuConfig).setOrigin(0.5);
        // define keys
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }

    update() {
        if (keyESC.isDown) {
            this.scene.stop(currentScene);
            this.scene.start('menuScene');
        }
    }
}