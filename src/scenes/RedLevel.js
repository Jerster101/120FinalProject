class RedLevel extends Phaser.Scene {
    constructor() {
        super("redScene");
    }
    
    preload() {
        // load assets
        this.load.path = 'assets/';
        this.load.image('enemy', 'enemies/Enemy.png');
        this.load.image('player', 'player/Player.png');
        this.load.image('red_bkg1', 'red_level/red_bkg1.png');
        this.load.image('red_bkg2', 'red_level/red_bkg2.png');
        this.load.image('red_bkg3', 'red_level/red_bkg3.png');
        this.load.image('red_bkg4', 'red_level/red_bkg4.png');
        this.load.image('red_bkg5', 'red_level/red_bkg5.png');
        this.load.image('red_bkg6', 'red_level/red_bkg6.png');
        this.load.spritesheet('red_tiles', 'red_level/red_tileset.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.tilemapTiledJSON('red_map', 'red_level/red_map.json');
        //load music
        this.load.audio('redMusic', 'music_sfx/LavaLevel.wav');
    }

    create() {
        const gui = new dat.GUI();
        gui.addFolder("Main Camera");
        gui.add(this.cameras.main, 'scrollX');
        gui.add(this.cameras.main, 'scrollY');
        gui.add(this.cameras.main, 'zoom');

        this.CAMWIDTH = 640;
        this.CAMHEIGHT = 360;

        currentScene = 'redScene';
        //music configuration and playing for level
        let musicConfig = {
            volume: 0.1,
            loop: true,
        }

        let redMusic = this.sound.add('redMusic');

        redMusic.play(musicConfig);
        
        // turns area around player red but reveals green near player
        // used for following level crystal gained but not yet added to center
        //this.r1 = this.add.image(200, 1200, 'circle').setBlendMode(Phaser.BlendModes.HUE);
        //this.r1.depth = 2;
        // erases area around player, could use opposed to desaturate
        //this.r1 = this.add.image(200, 1200, 'circle').setBlendMode(Phaser.BlendModes.ERASE);
        
        // add scrolling clouds & parallax environment
        this.bkg1 = this.add.image(1216, 944,'red_bkg1').setScrollFactor(1);
        this.bkg2 = this.add.image(1216, 944,'red_bkg2').setScrollFactor(0.4);
        this.bkg3 = this.physics.add.sprite(1216, 944, 'red_bkg3');
        this.bkg3.body.setAllowGravity(false).setVelocityX(25);
        this.bkg4 = this.physics.add.sprite(1216, 944, 'red_bkg4');
        this.bkg4.body.setAllowGravity(false).setVelocityX(45);
        this.bkg5 = this.add.image(1216, 944,'red_bkg5').setScrollFactor(0.6);
        this.bkg6 = this.add.image(1216, 944,'red_bkg6').setScrollFactor(0.8);


        // desaturates area around player, used for when crystal is obtained
        //this.r2 = this.add.image(200, 1200, 'circle2').setBlendMode(Phaser.BlendModes.SATURATION);
        //this.r2.depth = 1;
        
        // variables and settings
        this.physics.world.gravity.y = GRAV;

        // add a tilemap
        const map = this.add.tilemap('red_map');
        // add a tileset to the map
        const tileset = map.addTilesetImage('red_tileset','red_tiles');
        // create tilemap layers
        const platformLayer = map.createLayer('platforms', tileset, 0, 0);
        //background1Layer = map.createLayer('background', 'bkg1', 0, 0);
        //strings2Layer = map.createLayer('strings_2', 'bkg2', 0, 0);
        //strings1Layer = map.createLayer('strings_1', 'bkg3', 0, 0);
        // set map collisions
        platformLayer.setCollisionByProperty({
            collides: true,
        });
        
        // spawn player at point
        const core_spawnR = map.findObject("spawn", obj => obj.name === "core spawn");
        if (spawnpoint == "core_spawnR") {
            console.log(spawnpoint);
            spawnpoint = "";
            this.player = this.physics.add.sprite(core_spawnR.x, core_spawnR.y, 'player');
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
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);


        this.green_boundR = map.findObject("boundary", obj => obj.name === "green boundary");
        this.core_boundR = map.findObject("boundary", obj => obj.name === "core boundary");
        this.core_bound2R = map.findObject("boundary", obj => obj.name === "core boundary 2");
    
        // add enemy
        //this.enemy01 = new EnemyJumper(this, 570, 1100, 'enemy', 0)
        //this.enemy01.depth = 2;
        //this.physics.add.collider(this.enemy01, platformLayer);

        //this.enemy02 = new EnemyPatroller(this, 700, 1100, 'enemy', 0);
        //this.enemy02.depth = 2;
        //this.physics.add.collider(this.enemy02, platformLayer);

        // camera
        this.cameras.main.setBounds(0,0,2432, 1888);
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
            if (this.player.body.velocity.x > 0) {
                this.player.body.setDragX(DRAG);
                this.player.setAccelerationX(0);
            } else {
                this.player.setAccelerationX(-ACCELERATION);
                this.player.setFlip(true, false);
            }
        } else if((cursors.right.isDown || keyD.isDown) && this.player.body.onFloor) {
            if (this.player.body.velocity.x < 0) {
                this.player.body.setDragX(DRAG);
                this.player.setAccelerationX(0);
            } else {
            this.player.setAccelerationX(ACCELERATION);
            this.player.resetFlip();
            }

        } else if (this.player.body.onFloor) {
            this.player.body.setDragX(DRAG);
            this.player.setAccelerationX(0);
        }

        // jumping
        if (Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(cursors.space) || Phaser.Input.Keyboard.JustDown(keyW) && this.player.body.onFloor) {
            this.player.setVelocityY(-JUMPHEIGHT);
        }

         // pause scene 
         if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.launch("pauseScene");
            this.scene.pause();
        }

        if(this.checkCollision(this.player, this.core_boundR)) {
            spawnpoint = "red_spawn";
            console.log(spawnpoint);
            this.scene.switch("coreScene");
        }
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

