const tileSize = 35;

let config = {
    type: Phaser.CANVAS,
    width: 1280,
    height: 640,
    backgroundColor: '#B7410E',
    autoCenter: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 2500},
            debug: false,
        }
    },
    scene: [ Load, Gamescreen ]
}

let game = new Phaser.Game(config);

let keyLEFT, keyRIGHT, keyA, keyD, keySPACE, keyESC;