class Death extends Phaser.Scene {
    constructor() {
        super("deathScene");
    }

    create() {
        // ensure this scene displays above others
        this.scene.bringToTop();

        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '20px',
            fontStyle: 'italic',
            backgroundColor: '#000000',
            color: '#ffffff',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        // add text
        this.add.text(game.config.width/2, game.config.height/2, 'You have died.\nPress R to try again or Q to return to the menu', menuConfig).setOrigin(0.5);
        
        // define keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    }

    update() {
        if (keyQ.isDown) {
            this.scene.stop('coreScene');
            this.scene.start('menuScene');
        }
        if (keyR.isDown) {
            this.scene.start('coreScene');
        }
        
    }
}