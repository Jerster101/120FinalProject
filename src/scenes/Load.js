class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        //sets a loading path
        this.load.path = "assets/";

        // blue level
        this.load.image('blue_bkg1', 'blue_level/blue_bkg1.png');
        this.load.image('blue_bkg2', 'blue_level/blue_bkg2.png');
        this.load.image('blue_bkg3', 'blue_level/blue_bkg3.png');
        this.load.image('blue_bkg4', 'blue_level/blue_bkg4.png');
        this.load.image('blue_bkg5', 'blue_level/blue_bkg5.png');
        this.load.image('blue_bkg6', 'blue_level/blue_bkg6.png');
        this.load.image('blue_crystal', 'blue_level/blue_crystal.png');
        this.load.spritesheet('blue_tiles', 'blue_level/blue_tileset.png', {frameWidth: 32, frameHeight: 32});
        this.load.tilemapTiledJSON('blue_map', 'blue_level/blue_map.json');

        // core level
        this.load.image('tiles', 'core/core_tileset.png');
        this.load.image('circle', 'color_masks/red2.png');
        this.load.image('circle2', 'color_masks/whiteborder.png');
        this.load.image('bkg', 'core/rainbowcircle_bkg.png');
        this.load.image('no_crystal', 'core/no_crystal_core.png');
        this.load.image('R_crystal', 'core/R_crystal_core.png');
        this.load.image('RG_crystal', 'core/RG_crystal_core.png');
        this.load.image('RGB_crystal', 'core/RGB_crystal_core.png');
        this.load.image('rocks', 'core/rocks_core.png');
        this.load.image('strings', 'core/strings_core.png');
        this.load.image('trees', 'core/trees_core.png');
        this.load.spritesheet('idle', 'player/player_idle.png', {frameWidth: 26, frameHeight: 33, startFrame: 0, endFrame: 4});
        this.load.tilemapTiledJSON('map', 'core/core_map.json');

        // green level
        this.load.image('enemy', 'enemies/Enemy.png');
        this.load.spritesheet('tiles2', 'green_level/green_tileset.png', {frameWidth: 32, frameHeight: 32});
        this.load.image('circle', 'color_masks/red2.png');
        this.load.image('circle2', 'color_masks/whiteborder.png');
        this.load.image('green_bkg1', 'green_level/green_bkg1.png');
        this.load.image('green_bkg2', 'green_level/green_bkg2.png');
        this.load.image('green_bkg3', 'green_level/green_bkg3.png');
        this.load.image('green_bkg4', 'green_level/green_bkg4.png');
        this.load.image('green_crystal', 'green_level/green_crystal.png');
        this.load.tilemapTiledJSON('map2', 'green_level/green_map.json');


        // red level
        this.load.image('enemy', 'enemies/Enemy.png');
        this.load.image('red_bkg1', 'red_level/red_bkg1.png');
        this.load.image('red_bkg2', 'red_level/red_bkg2.png');
        this.load.image('red_bkg3', 'red_level/red_bkg3.png');
        this.load.image('red_bkg4', 'red_level/red_bkg4.png');
        this.load.image('red_bkg5', 'red_level/red_bkg5.png');
        this.load.image('red_bkg6', 'red_level/red_bkg6.png');
        this.load.image('red_crystal', 'red_level/red_crystal.png');
        this.load.spritesheet('red_tiles', 'red_level/red_tileset.png', {frameWidth: 32, frameHeight: 32});
        this.load.tilemapTiledJSON('red_map', 'red_level/red_map.json');
        
        // music
        this.load.audio('blueMusic', 'music_sfx/CaveLevel.wav');
        this.load.audio('redMusic', 'music_sfx/LavaLevel.m4a');
        this.load.audio('greenMusic', 'music_sfx/ForestLevel.m4a');
        this.load.audio('coreMusic', 'music_sfx/coreLevel.mp3');

        // sfx
        this.load.audio('temp_menu_sfx', 'temp_menu_sfx.wav');

        // credits
        this.load.image("credits_bkg", "menu/credits_bkg.jpg");

        // menu
        this.load.image("menu_bkg", "core/RGB_crystal_core.png");
        this.load.image("menu_purple", "menu/rainbow_behindcore.jpg");
        this.load.spritesheet("title", "menu/title_spritesheet.png", {frameWidth: 483, frameHeight: 107});

        // pause
        this.load.image("credits_bkg", "menu/credits_bkg.jpg");

        // health UI
        this.load.image("heart", "player/heart.png");
        this.load.image("heart_outline", "player/heart_outline.png");

        //enemies
        this.load.spritesheet('jumper', 'enemies/jumper_anim.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 18});

        // player
        this.load.spritesheet('run', 'player/player_run.png', {frameWidth: 26, frameHeight: 32, startFrame: 0, endFrame: 7});
        this.load.spritesheet('idle', 'player/player_idle.png', {frameWidth: 26, frameHeight: 32, startFrame: 0, endFrame: 4});
        this.load.spritesheet('fall', 'player/player_fall.png', {frameWidth: 26, frameHeight: 32, startFrame: 0, endFrame: 3});
        this.load.spritesheet('jump_up', 'player/temp_player_jump_up.png', {frameWidth: 26, frameHeight: 32, startFrame: 0, endFrame: 0});
        this.load.spritesheet('jump_down', 'player/temp_player_jump_down.png', {frameWidth: 26, frameHeight: 32, startFrame: 0, endFrame: 0});
    }

    create() {
        this.createAnimations();
        console.log('loading done');
        this.scene.start("menuScene");
    }

    createAnimations() {
        this.anims.create({
            key: 'player_run',
            frames: this.anims.generateFrameNumbers('run', {start: 0, end: 7, first: 0}),
            frameRate: 12,
            repeat: -1
        })
        this.anims.create({
            key: 'player_fall',
            frames: this.anims.generateFrameNumbers('fall', {start: 0, end: 3, first: 0}),
            frameRate: 8
        })
        this.anims.create({
            key: 'player_jump_up',
            frames: this.anims.generateFrameNumbers('fall', {start: 0, end: 0, first: 0}),
            frameRate: 8
        })
        this.anims.create({
            key: 'player_jump_down',
            frames: this.anims.generateFrameNumbers('fall', {start: 0, end: 0, first: 0}),
            frameRate: 8
        })
        this.anims.create({
            key: 'player_idle',
            frames: this.anims.generateFrameNumbers('idle', {start: 0, end: 4, first: 0}),
            frameRate: 8,
            repeat: -1,
            repeatDelay: 3000
        })
        this.anims.create({
            key: 'jumper_anim',
            frames: this.anims.generateFrameNumbers('jumper', {start: 0, end: 18, first: 0}),
            frameRate: 14
            //repeatDelay: 1000
        })
    }
}