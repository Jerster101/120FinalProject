let config = {
    type: Phaser.CANVAS,
    width: 1280,
    height: 520,
    width: 750,
    height: 500,
    autoCenter: true,
    backgroundColor: '#B7410E',
    autoCenter: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: false,
        }
    },
    scene: [Menu, Gamescreen1, Gamescreen2]
}

let game = new Phaser.Game(config);

let keyLEFT, keyRIGHT, keyA, keyD, keySPACE, keyESC;