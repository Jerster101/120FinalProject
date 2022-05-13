class Pause extends Phaser.Scene {
    constructor() {
        super("pauseScene");
    }

    create() {

        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '35px',
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
        
        //add text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'Game is paused\nPress R to resume or Q to return to the menu', menuConfig).setOrigin(0.5);
        
        // define keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    }

    update() {
        if (keyQ.isDown) {
            this.scene.stop('levelOneScene');
            this.scene.start('menuScene');
        }
        if (keyR.isDown) {
            this.scene.resume('levelOneScene');
            this.scene.stop();
        }
        
    }
}