let config = {
    type: Phaser.CANVAS,
    width: 1280,
    height: 640,
    backgroundColor: '#B7410E',
    autoCenter: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: false,
        }
    },
    scene: [ Gamescreen ]
}

let game = new Phaser.Game(config);

let keyLEFT, keyRIGHT, keyA, keyD, keySPACE, keyESC;