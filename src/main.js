//making some permanent variables so I don't have to keep doing "this.something"
let cursors;
const tileSize = 35;
const cloudSize = 65;
var SCALE = 0.5,
ACCELERATION = 500,
DRAG = 900,
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
    scene: [ Load, Coinscreen, Platformscreen, Buttonscreen, Level1 ]
}

let game = new Phaser.Game(config);

let sceneSwitcher = (event) => {
    //console.log("Key is: " + event.key);
    switch(event.key) {
        /*can't get this page to work yet, so I'm gonna just block off access until I can get it to work
        case '1':
            game.scene.start('Level1');
            game.scene.bringToTop('Level1');
            game.scene.pause('Tutorial1');
            game.scene.pause('Tutorial2');
            break;
            */
        case '1':
            game.scene.start('Tutorial1');
            game.scene.bringToTop('Tutorial1');
            game.scene.pause('Level1');
            game.scene.pause('Tutorial2');
            game.scene.pause('Tutorial3');
            break;
        case '2':
            game.scene.start('Tutorial2');
            game.scene.bringToTop('Tutorial2');
            game.scene.pause('Level1');
            game.scene.pause('Tutorial1');
            game.scene.pause('Tutorial3');
            break;
        case '3':
            game.scene.start('Tutorial3');
            game.scene.bringToTop('Tutorial3');
            game.scene.pause('Level1');
            game.scene.pause('Tutorial1');
            game.scene.pause('Tutorial2');
        default:
            break;
    }
}

