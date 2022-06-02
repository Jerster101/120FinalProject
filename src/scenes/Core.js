class Core extends Phaser.Scene {
    constructor() {
        super("coreScene");
    }
    
    preload() {
        this.load.path = 'assets/';
        this.load.image('player', 'player/Player.png');
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
        this.load.tilemapTiledJSON('map', 'core/core_map.json');
        //load music
        this.load.audio('redMusic', 'music_sfx/level1Music.wav');
    }

    create() {
        const gui = new dat.GUI();
        gui.addFolder("Main Camera");
        gui.add(this.cameras.main, 'scrollX');
        gui.add(this.cameras.main, 'scrollY');
        gui.add(this.cameras.main, 'zoom');

        this.CAMWIDTH = 640;
        this.CAMHEIGHT = 360;

        //music configuration and playing for level
        let musicConfig = {
            volume: 0.1,
            loop: true,
        }

        this.redMusic = this.sound.add('redMusic');

        this.redMusic.play(musicConfig);
        
        // turns area around player red but reveals green near player
        // used for following level crystal gained but not yet added to center
        //this.r1 = this.add.image(200, 1200, 'circle').setBlendMode(Phaser.BlendModes.HUE);
        //this.r1.depth = 2;
        // erases area around player, could use opposed to desaturate
        //this.r1 = this.add.image(200, 1200, 'circle').setBlendMode(Phaser.BlendModes.ERASE);
        
        this.bkg_core = this.add.image(608, 352,'bkg').setScrollFactor(1);
        this.rocks = this.add.image(608, 352,'rocks').setScrollFactor(0.6);
        this.trees = this.add.image(608, 352,'trees').setScrollFactor(0.7);
        this.strings = this.add.image(608, 352,'strings').setScrollFactor(0.8);
        this.no_crystal = this.add.image(608, 352, 'no_crystal').setScrollFactor(1);
        // desaturates area around player, used for when crystal is obtained
        //this.r2 = this.add.image(200, 1200, 'circle2').setBlendMode(Phaser.BlendModes.SATURATION);
        //this.r2.depth = 1;
        
        // variables and settings
        this.physics.world.gravity.y = GRAV;

        // add a tilemap
        const map = this.add.tilemap('map');
        // add a tileset to the map
        const tileset = map.addTilesetImage('core_tileset','tiles');
        // create tilemap layers
        const platformLayer = map.createLayer('platforms', tileset, 0, 0);
        // set map collisions
        platformLayer.setCollisionByProperty({
            collides: true,
        });
        
        // set up player spawn
        const start_spawn = map.findObject("spawn", obj => obj.name === "start spawn");
        const red_spawn = map.findObject("spawn", obj => obj.name === "red spawn");
        const red_spawn2 = map.findObject("spawn", obj => obj.name === "red spawn 2");
        const green_spawn = map.findObject("spawn", obj => obj.name === "green spawn");
        const blue_spawn = map.findObject("spawn", obj => obj.name === "blue spawn");

        // player spawn based upon previous boundary
        if (spawnpoint == "start") {
            console.log(spawnpoint);
            spawnpoint = "";
            this.player = this.physics.add.sprite(start_spawn.x, start_spawn.y, 'player');
        } else if (spawnpoint == "green_spawn") {
            console.log(spawnpoint);
            spawnpoint = "";
            this.player = this.physics.add.sprite(green_spawn.x, green_spawn.y, 'player');
        };
        this.player.depth = 2;
        this.player.body.setMaxVelocity(MAX_X_VEL, MAX_Y_VEL);
        playerHealth = 99;
        this.invincible = false;
        //this.player.setCollideWorldBounds(true);
        

        // add physics collider
        this.physics.add.collider(this.player, platformLayer);

        // set up key input
        cursors = this.input.keyboard.createCursorKeys();
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);


        this.green_bound = map.findObject("boundary", obj => obj.name === "green boundary");
        this.red_bound = map.findObject("boundary", obj => obj.name === "red boundary");
        this.red_bound2 = map.findObject("boundary", obj => obj.name === "red boundary 2");
        this.blue_bound = map.findObject("boundary", obj => obj.name === "blue boundary");
        
        // add enemy
        //this.enemy01 = new EnemyJumper(this, 570, 1100, 'enemy', 0)
        //this.enemy01.depth = 2;
        //this.physics.add.collider(this.enemy01, platformLayer);

        //this.enemy02 = new EnemyPatroller(this, 700, 1100, 'enemy', 0);
        //this.enemy02.depth = 2;
        //this.physics.add.collider(this.enemy02, platformLayer);

        // camera
        this.cameras.main.setBounds(0,0,1216, 704);
        this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
    }

    update() {
        
        //this.enemy02.update();
        // image masks follow player
        if (this.r1) {
            this.r1.x = this.player.x;
            this.r1.y = this.player.y;
        }
        if (this.r2) {
            this.r2.x = this.player.x;
            this.r2.y = this.player.y;
        }
        // movement
        if((cursors.left.isDown || keyA.isDown) && this.player.body.onFloor) {
            //if (this.player.body.velocity.x < 0) {
            //    this.player.body.setDragX(DRAG*2);
            //}
            this.player.setAccelerationX(-ACCELERATION);
            this.player.setFlip(true, false);
            
        } else if((cursors.right.isDown || keyD.isDown) && this.player.body.onFloor) {
            //if (this.player.body.velocity.x > 0) {
            //    this.player.body.setDragX(DRAG*2);
            //}
            this.player.setAccelerationX(ACCELERATION);
            this.player.resetFlip();

        } else if (this.player.body.onFloor) {
            this.player.body.setDragX(DRAG);
            this.player.setAccelerationX(0);
        }

        // jumping
        if (Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(cursors.space) || Phaser.Input.Keyboard.JustDown(keyW) && this.player.body.onFloor) {
            this.player.setVelocityY(-JUMPHEIGHT);
        }

        //menu
        if (keyESC.isDown) {
            this.scene.launch("pauseScene");
            this.scene.pause();
            this.redMusic.pause()
            if(keyR.isDown) {
                this.redMusic.resume(musicConfig);
            }
        }

        if(this.checkCollision(this.player, this.green_bound)) {
            this.redMusic.stop();
            spawnpoint = "core_spawnG";
            console.log(spawnpoint);
            this.scene.switch("greenScene");
        }

        if(this.checkCollision(this.player, this.blue_bound)) {
            this.redMusic.stop();
            spawnpoint = "core_spawnB";
            console.log(spawnpoint);
            this.scene.switch("blueScene");
        }
        /*
        if(this.checkCollision(this.player, this.blue_bound)) {
            spawnpoint = "blue_bound";
            console.log(spawnpoint);
            this.scene.launch("blueScene");
            this.scene.sleep();
            this.scene.setVisible(false);
        }
        if(this.checkCollision(this.player, this.red_bound)) {
            spawnpoint = "red_bound";
            console.log(spawnpoint);
            this.scene.launch("redScene");
            this.scene.sleep();
            this.scene.setVisible(false);
        }
        if(this.checkCollision(this.player, this.red_bound2)) {
            spawnpoint = "red_bound2";
            console.log(spawnpoint);
            this.scene.launch("redScene");
            this.scene.sleep();
            this.scene.setVisible(false);
        }
        */

        // check enemy collision
        /*if(this.checkCollision(this.player, this.enemy01) || this.checkCollision(this.player, this.enemy02)) {
            if (!this.invincible) {
                playerHealth -=33;
                this.player.setVelocityX(500);
                this.invincible = true;
                this.player.setAlpha(0.5);
                this.timedEvent = this.time.addEvent({ delay: 1500, callback: this.setVulnerable, callbackScope: this, loop: false});
            }
        }*/

        // check for death scene
        if(playerHealth <= 0) {
            this.scene.launch("deathScene");
            this.scene.pause();
        }
    }

    checkCollision(a, b) {
        if (a.x < b.x + b.width && 
            a.x + a.width > b.x && 
            a.y < b.y + b.height &&
            a.height + a.y > b.y) {
                return true;
        } else {
            return false;
        }
    }

    setVulnerable() {
        this.invincible = false;
        this.player.setAlpha(1);
    }
}