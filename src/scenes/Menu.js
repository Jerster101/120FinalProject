class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {

        // menu text configuration
        let menuConfig = {
          fontFamily: 'Courier',
          fontSize: '30px',
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

        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'GAME NAME (wow!)', menuConfig).setOrigin(0.5);

        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding +100, 'Press SPACE to start\nPress ESC to return to the menu', menuConfig).setOrigin(0.5);
        
        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
          // Start game
          this.scene.start("levelOneScene");
        }
    }
}