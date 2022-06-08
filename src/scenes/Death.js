class Death extends Phaser.Scene {
    constructor() {
        super("deathScene");
    }

    create() {
        // ensure this scene displays above others
        this.scene.bringToTop();

        let menuConfig = {
            fontFamily: 'Square',
            fontSize: '30px',
            color: '#2b397c',
            stroke: '#15d681',
            strokeThickness: 4,
            align: 'center'
        }
        
        // add text
        this.restartText = this.add.text(game.config.width/2, game.config.height/2.2, 'RESTART', menuConfig).setOrigin(0.5).setInteractive()
        .on('pointerover', () => this.restartText.setStyle({fontSize: '35px', fill: '#d1405a'}))
        .on('pointerout', () => this.restartText.setStyle({fontSize: '30px', fill: '#2b397c'}))
        .on('pointerdown', () => this.restartText.setStyle({fontSize: '30px', fill: '#d1405a'}))
        .on('pointerup', () => {CurrentRoom = 0, this.scene.stop(currentScene), this.scene.start('coreScene'), playerHealth = maxHealth, currentScene = 'coreScene', spawnpoint = "start", CurrentRoom = 0;});
        this.menuText = this.add.text(game.config.width/2, game.config.height/1.7, 'MAIN MENU', menuConfig).setOrigin(0.5).setInteractive()
        .on('pointerover', () => this.menuText.setStyle({fontSize: '35px', fill: '#d1405a'}))
        .on('pointerout', () => this.menuText.setStyle({fontSize: '30px', fill: '#2b397c'}))
        .on('pointerdown', () => this.menuText.setStyle({fontSize: '30px', fill: '#d1405a'}))
        .on('pointerup', () => {this.scene.stop(currentScene), this.scene.start('menuScene'), playerHealth = maxHealth});
        menuConfig.fontSize = '15px';
        menuConfig.color = '#8a0303';
        this.add.text(game.config.width/2, game.config.height/3, 'You Have Died', menuConfig).setOrigin(0.5);
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