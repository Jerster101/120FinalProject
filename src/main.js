/*******************************************************************
 * GAME NAME

 * Jeremy Dahlberg
 * Lyza Stevens
 * Eamon Sherris-Watt

******************************************************************/
let cursors;
let currentScene = 0;
const tileSize = 35;
const SCALE = 1.2;
const GRAV = 1000;
const DRAG = 950;
const MOVESPEED = 250;
const JUMPHEIGHT = 500;
let playerHealth = 0;

let config = {
    type: Phaser.WebGL,
    width: 640,
    height: 360,
    autoCenter: true,
    backgroundColor: '#D56F59',
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
    scene: [Menu, Death, Pause, Level1]
}

let game = new Phaser.Game(config);


// set UI sizes
let borderUISize = game.config.height / 20;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let keyA, keyD, keySPACE, keyW, keyESC, keyR, keyQ;