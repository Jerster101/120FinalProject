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
const MOVESPEED = 300;
const JUMPHEIGHT = 5000;

let config = {
    type: Phaser.CANVAS,
    width: 1500,
    height: 800,
    autoCenter: true,
    backgroundColor: '#8a8a8a',
    autoCenter: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        }
    },
    scene: [Menu, Level1]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 20;
let borderPadding = borderUISize / 3;

// reserve keyboard variables
let  keyA, keyD, keySPACE, keyW, keyESC;