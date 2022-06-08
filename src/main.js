/*******************************************************************
 * CHROMA

 * Jeremy Dahlberg
 * Lyza Stevens
 * Eamon Sherris-Watt

******************************************************************/
let cursors;
let currentScene;
let GameState = 5;
let CurrentRoom = 0;
let playerHealth = 99;
let maxHealth = 99;
let spawnpoint = "start";
hearts = [];
const tileSize = 32;
const SCALE = 1;
const GRAV = 1300;
const MOVESPEED = 250;
const JUMPHEIGHT = 510;
const ACCELERATION = 450;
const MAX_X_VEL = 300;
const MAX_Y_VEL = 1000;
const DRAG = 2000;

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
    scene: [Load, Menu, Credits, Death, Pause, Core, RedLevel, GreenLevel, BlueLevel]
}

let game = new Phaser.Game(config);

// reserve keyboard variables
let keyA, keyD, keySPACE, keyW, keyS, keyESC, keyR, keyQ;

function destroyGameObject(gameObject) {
    gameObject.destroy();
}