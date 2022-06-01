/*******************************************************************
 * GAME NAME

 * Jeremy Dahlberg
 * Lyza Stevens
 * Eamon Sherris-Watt

******************************************************************/
let cursors;
let currentScene = 0;
const tileSize = 32;
const SCALE = 1;
const GRAV = 1300;
const MOVESPEED = 250;
const JUMPHEIGHT = 500;
const ACCELERATION = 200;
const MAX_X_VEL = 300;
const MAX_Y_VEL = 1000;
const DRAG = 3000;
let playerHealth = 0;
let spawnpoint = "start";

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 360,
    backgroundColor: "#03011b",
    autoCenter: true,
    autoCenter: true,
    pixelArt: true,
    zoom: 2,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            tileBias: 32,
        }
    },
    scene: [Menu, Credits, Death, Pause, Core, RedLevel, GreenLevel, BlueLevel]
}

let game = new Phaser.Game(config);


// set UI sizes
let borderUISize = game.config.height / 20;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let keyA, keyD, keySPACE, keyW, keyESC, keyR, keyQ;