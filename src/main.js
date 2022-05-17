//making some permanent variables so I don't have to keep doing "this.something"
let cursors;
const tileSize = 35;
const cloudSize = 65;
var SCALE = 0.5,
ACCELERATION = 500,
DRAG = 600,
MAX_X_VEL = 500,
MAX_Y_VEL = 5000;

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
    scene: [ Load, Coinscreen, Platformscreen ]
}

let game = new Phaser.Game(config);

let keyLEFT, keyRIGHT, keyA, keyD, keySPACE, keyESC;

let sceneSwitcher = (event) => {
    //console.log("Key is: " + event.key);
    switch(event.key) {
        case '1':
            game.scene.start('Level1');
            game.scene.bringToTop('Level1');
            game.scene.pause('Level2');
            break;
        case '2':
            game.scene.start('Level2');
            game.scene.bringToTop('Level2');
            game.scene.pause('Level1');
        default:
            break;
    }
}