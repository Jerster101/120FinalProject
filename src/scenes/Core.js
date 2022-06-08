class Core extends Phaser.Scene {
    constructor() {
        super("coreScene");
    }

    create() {
        currentScene = 'coreScene';
        
        //music configuration and playing for level
        let musicConfig = {
            volume: 0.2,
            loop: true,
        }
        this.coreMusic = this.sound.add('coreMusic');
        this.crystal_sfx = this.sound.add('crystal_sfx');
        this.coreMusic.play(musicConfig);
        
        // add parallax background
        this.bkg_core = this.add.image(608, 352,'bkg').setScrollFactor(1).setDepth(-5);
        this.rocks = this.add.image(608, 352,'rocks').setScrollFactor(0.6).setDepth(-4);
        this.trees = this.add.image(608, 352,'trees').setScrollFactor(0.7).setDepth(-3);
        this.strings = this.add.image(608, 352,'strings').setScrollFactor(0.8).setDepth(-2);
        this.no_crystal = this.add.image(608, 352, 'no_crystal').setScrollFactor(1).setDepth(-1);
        
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
            this.tutorial4 = this.add.sprite(start_spawn.x-115, start_spawn.y+50, "tut_pause").setOrigin(0.5).setAlpha(0.6);
            this.tutorial5 = this.add.sprite(start_spawn.x-125, start_spawn.y-60, "tut_start").setOrigin(0.5).setAlpha(0.6);
            

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
            spawnpoint = "";
            this.player = new Player(this, start_spawn.x, start_spawn.y, 'idle', 0);
            this.cameras.main.fadeIn(1500, 0, 0, 0)
        } else if (spawnpoint == "red_spawn") {
            spawnpoint = "";
            this.player = new Player(this, red_spawn.x, red_spawn.y, 'idle', 0);
            this.cameras.main.fadeIn(500, 0, 0, 0)
        } else if (spawnpoint == "red_spawn2") {
            spawnpoint = "";
            this.player = new Player(this, red_spawn2.x, red_spawn2.y, 'idle', 0);
            this.cameras.main.fadeIn(500, 0, 0, 0)
        } else if (spawnpoint == "green_spawn") {;
            spawnpoint = "";
            this.player = new Player(this, green_spawn.x, green_spawn.y, 'idle', 0);
            this.cameras.main.fadeIn(500, 0, 0, 0)
        } else if (spawnpoint == "blue_spawn") {
            spawnpoint = "";
            this.player = new Player(this, blue_spawn.x, blue_spawn.y, 'idle', 0);
            this.cameras.main.fadeIn(500, 0, 0, 0)
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

        // set boundaries
        this.green_bound = map.findObject("boundary", obj => obj.name === "green boundary");
        this.red_bound = map.findObject("boundary", obj => obj.name === "red boundary");
        this.red_bound2 = map.findObject("boundary", obj => obj.name === "red boundary 2");
        this.blue_bound = map.findObject("boundary", obj => obj.name === "blue boundary");

        // set up core boundary
        this.crystalCore = map.findObject("core", obj => obj.name === "core");

        // camera
        this.cameras.main.setBounds(0,0,1216, 704);
        this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
        
        // create three hearts
        this.hearts1 = this.add.sprite(game.config.width/2, game.config.height/2, 'heart').setDepth(5);
        this.hearts2 = this.add.sprite(game.config.width/2 + 40, game.config.height/2, 'heart').setDepth(5);
        this.hearts3 = this.add.sprite(game.config.width/2 + 80, game.config.height/2, 'heart').setDepth(5);
        hearts = [this.hearts1, this.hearts2, this.hearts3];
        this.updateHearts();
    }

    update() {
        
        this.player.update();
        this.cam_pos_x = this.cameraPos(null).x;
        this.cam_pos_y = this.cameraPos(null).y;

        // pause scene 
        
        if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.launch("pauseScene");
            this.scene.pause();
        }

        this.events.on('pause', function() {
            this.coreMusic.pause();
        }, this);
        this.events.on('resume', function() {
            this.coreMusic.resume();
        }, this);

        if(this.checkCollision(this.player, this.green_bound)) {
            this.coreMusic.stop();
            spawnpoint = "core_spawnG";
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.scene.start("greenScene");
        }
        if(this.checkCollision(this.player, this.blue_bound)) {
            this.coreMusic.stop();
            spawnpoint = "core_spawnB";
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.scene.start("blueScene");
        }
        if(this.checkCollision(this.player, this.red_bound)) {
            this.coreMusic.stop();
            spawnpoint = "core_spawnR";
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.scene.start("redScene");
        }
        if(this.checkCollision(this.player, this.red_bound2)) {
            this.coreMusic.stop();
            spawnpoint = "core_spawnR2";
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.scene.start("redScene");
        }

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
            this.tutorial4.visible = false;
        }
        if (GameState == 0) {
            this.no_crystal.destroy();
            this.no_crystal = this.add.image(608, 352, 'no_crystal').setScrollFactor(1).setDepth(-1);
        } else if (GameState == 2) {
            this.no_crystal.destroy();
            this.no_crystal = this.add.image(608, 352, 'R_crystal').setScrollFactor(1).setDepth(-1);
        } else if (GameState == 4) {
            this.no_crystal.destroy();
            this.no_crystal = this.add.image(608, 352, 'RG_crystal').setScrollFactor(1).setDepth(-1);
        }

        if (this.hearts1) {
            this.hearts1.x = this.cam_pos_x;
            this.hearts1.y = this.cam_pos_y;
        }
        if (this.hearts2) {
            this.hearts2.x = this.cam_pos_x + 40;
            this.hearts2.y = this.cam_pos_y;
        }
        if (this.hearts3) {
            this.hearts3.x = this.cam_pos_x + 80;
            this.hearts3.y = this.cam_pos_y;
        }

        // core state change
        if(this.checkCollision(this.player, this.crystalCore)) {
            if (GameState == 1) {
                GameState = 2;
                console.log(GameState);
                this.player.recolor(this);
                this.no_crystal.destroy();
                this.no_crystal = this.add.image(608, 352, 'R_crystal').setScrollFactor(1).setDepth(-1);
                this.sound.play('crystal_sfx', {volume: 0.3});
            } else if (GameState == 3) {
                GameState = 4;
                this.player.recolor(this);
                this.no_crystal.destroy();
                this.no_crystal = this.add.image(608, 352, 'RG_crystal').setScrollFactor(1).setDepth(-1);
                this.sound.play('crystal_sfx', {volume: 0.3});
            } else if (GameState == 5) {
                GameState = 6;
                this.player.recolor(this);
                this.no_crystal.destroy();
                this.no_crystal = this.add.image(608, 352, 'RGB_crystal').setScrollFactor(1).setDepth(-1).setDepth(-1);
                this.sound.play('crystal_sfx', {volume: 0.3});
                this.scene.pause();
                this.coreMusic.stop();
                this.scene.launch("endScene");
                //this.time.delayedCall(000, this.scene.launch("endScene"), [], this);
            }; 
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

    cameraPos() {
        return {
            x: this.cameras.main.worldView.x + 30,
            y: this.cameras.main.worldView.y + 30
        }
    }
    
    updateHearts() {
        if (playerHealth == 99) {
            this.hearts1.setAlpha(1);
            this.hearts2.setAlpha(1);
            this.hearts3.setAlpha(1);
        } else if (playerHealth == 66) {
            this.hearts1.setAlpha(1);
            this.hearts2.setAlpha(1);
            this.hearts3.setAlpha(0);
        } else if (playerHealth == 33) {
            this.hearts1.setAlpha(1);
            this.hearts2.setAlpha(0);
            this.hearts3.setAlpha(0);
        } else if (playerHealth == 0) {
            this.hearts1.setAlpha(0);
            this.hearts1.setAlpha(0);
            this.hearts1.setAlpha(0);
        }
    }
}
