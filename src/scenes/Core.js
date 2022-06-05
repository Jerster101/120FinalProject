class Core extends Phaser.Scene {
    constructor() {
        super("coreScene");
    }

    create() {
        currentScene = 'coreScene';
        
        //music configuration and playing for level
        let musicConfig = {
            volume: 0.7,
            loop: true,
        }
        this.coreMusic = this.sound.add('coreMusic');
        this.coreMusic.play(musicConfig);
        
        // add parallax background
        this.bkg_core = this.add.image(608, 352,'bkg').setScrollFactor(1);
        this.rocks = this.add.image(608, 352,'rocks').setScrollFactor(0.6);
        this.trees = this.add.image(608, 352,'trees').setScrollFactor(0.7);
        this.strings = this.add.image(608, 352,'strings').setScrollFactor(0.8);
        this.no_crystal = this.add.image(608, 352, 'no_crystal').setScrollFactor(1);
        
        // turns area around player red but reveals green near player
        // used for following level crystal gained but not yet added to center
        //this.r1 = this.add.image(200, 1200, 'circle').setBlendMode(Phaser.BlendModes.HUE);
        //this.r1.depth = 2;
        // erases area around player, could use opposed to desaturate
        //this.r1 = this.add.image(200, 1200, 'circle').setBlendMode(Phaser.BlendModes.ERASE);
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


        if (CurrentRoom == 0) {
            //tutorial graphics
            this.tutorial1 = this.add.sprite(start_spawn.x+30, start_spawn.y+50,"tut_move").setOrigin(0.5).setAlpha(0.6);
            this.tutorial2 = this.add.sprite(start_spawn.x+205, start_spawn.y+35, "tut_jump").setOrigin(0.5).setAlpha(0.6);
            this.tutorial3 = this.add.sprite(start_spawn.x+205, start_spawn.y+75, "tut_double_jump").setOrigin(0.5).setAlpha(0.6);
        
            spawnpoint = "start";
        } else if (CurrentRoom == 1) {
            spawnpoint = "red_spawn";
        } else if (CurrentRoom == 2) {
            spawnpoint = "red_spawn2";
        } else if (CurrentRoom == 3) {
            spawnpoint = "green_spawn";
        } else if (CurrentRoom == 4) {
            spawnpoint = "blue_spawn";
        }
        CurrentRoom = 0;


        // player spawn based upon previous boundary
        if (spawnpoint == "start") {
            console.log(spawnpoint);
            spawnpoint = "";
            this.player = new Player(this, start_spawn.x, start_spawn.y, 'idle', 0);
        } else if (spawnpoint == "red_spawn") {
            console.log(spawnpoint);
            spawnpoint = "";
            this.player = new Player(this, red_spawn.x, red_spawn.y, 'idle', 0);
        } else if (spawnpoint == "red_spawn2") {
            console.log(spawnpoint);
            spawnpoint = "";
            this.player = new Player(this, red_spawn2.x, red_spawn2.y, 'idle', 0);
        } else if (spawnpoint == "green_spawn") {
            console.log(spawnpoint);
            spawnpoint = "";
            this.player = new Player(this, green_spawn.x, green_spawn.y, 'idle', 0);
        } else if (spawnpoint == "blue_spawn") {
            console.log(spawnpoint);
            spawnpoint = "";
            this.player = new Player(this, blue_spawn.x, blue_spawn.y, 'idle', 0);
        }
        
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
        this.cameras.main.setRoundPixels(true);
        this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
    }

    update() {
        
        this.player.update();
        // image masks follow player
        if (this.r1) {
            this.r1.x = this.player.x;
            this.r1.y = this.player.y;
        }
        if (this.r2) {
            this.r2.x = this.player.x;
            this.r2.y = this.player.y;
        }

        // pause scene 
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.launch("pauseScene");
            this.scene.pause();
            this.coreMusic.pause();
            if(Phaser.Input.Keyboard.JustDown(keyESC)) {
                this.coreMusic.resume(musicConfig);
            }
        }

        if(this.checkCollision(this.player, this.green_bound)) {
            this.coreMusic.stop();
            spawnpoint = "core_spawnG";
            console.log(spawnpoint);
            this.scene.start("greenScene");
        }
        if(this.checkCollision(this.player, this.blue_bound)) {
            this.coreMusic.stop();
            spawnpoint = "core_spawnB";
            console.log(spawnpoint);
            this.scene.start("blueScene");
        }
        if(this.checkCollision(this.player, this.red_bound)) {
            this.coreMusic.stop();
            spawnpoint = "core_spawnR";
            console.log(spawnpoint);
            this.scene.start("redScene");
        }
        if(this.checkCollision(this.player, this.red_bound2)) {
            this.coreMusic.stop();
            spawnpoint = "core_spawnR2";
            console.log(spawnpoint);
            this.scene.start("redScene");
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

        //check gamestate
        if (GameState > 0) {
            this.tutorial1.visible = false;
            this.tutorial2.visible = false;
            this.tutorial3.visible = false;
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
