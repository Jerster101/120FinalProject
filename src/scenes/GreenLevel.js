class GreenLevel extends Phaser.Scene {
    constructor() {
        super("greenScene");
    }

    create() {
        // 
        currentScene = 'greenScene';
        CurrentRoom = 3;

        //music configuration and playing for level
        let musicConfig = {
            volume: 0.8,
            loop: true,
        }
        this.greenMusic = this.sound.add('greenMusic');
        this.greenMusic.play(musicConfig);
        
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

        // add parallax background
        this.green_bkg1 = this.add.image(608, 1008,'green_bkg1');
        this.green_bkg2 = this.add.image(608, 1008,'green_bkg2').setScrollFactor(0.5);
        this.green_bkg3 = this.add.image(608, 1008,'green_bkg3').setScrollFactor(0.7);
        this.green_bkg4 = this.add.image(608, 1008,'green_bkg4').setScrollFactor(0.9);
       

        // add a tilemap
        const map = this.add.tilemap('map2');
        // add a tileset to the map
        const tileset = map.addTilesetImage('green_tileset','tiles2');
        // create tilemap layers
        const sceneryLayer = map.createLayer('scenery', tileset, 0, 0);
        const branchesLayer = map.createLayer('branches', tileset, 0, 0);
        const platformLayer = map.createLayer('platforms', tileset, 0, 0);
        const greeneryLayer = map.createLayer('greenery', tileset, 0, 0);
        const spikesLayer = map.createLayer('spikes', tileset, 0, 0);
        const hiddenLayer = map.createLayer('hidden', tileset, 0, 0);
        const greenCrystal = map.findObject("crystal", obj => obj.name === "crystal");
        this.add.image(greenCrystal.x, greenCrystal.y, 'green_crystal').setOrigin(0.5, 0.3);
        this.vinePlatforms = map.createFromObjects("Passable Platforms", {
            name: "vines",
            key: "tiles2",
            frame: 29
        });
        this.physics.world.enable(this.vinePlatforms, Phaser.Physics.Arcade.STATIC_BODY);
        this.passPlatforms = this.add.group(this.vinePlatforms)
        this.vinePlatforms.depth = 3;
        // set map collisions
        platformLayer.setCollisionByProperty({
            collides: true,
        });
        
        // spawn player at point
        const core_spawnG = map.findObject("spawn", obj => obj.name === "core spawn");
        const red_spawnG = map.findObject("spawn", obj => obj.name === "red spawn");
        const blue_spawnG = map.findObject("spawn", obj => obj.name === "blue spawn");
        if (spawnpoint == "core_spawnG") {
            console.log(spawnpoint);
            spawnpoint = "";
            this.player = new Player(this, core_spawnG.x, core_spawnG.y, 'idle', 0);
        } else if (spawnpoint == "red_spawn") {
            console.log(spawnpoint);
            spawnpoint = "";
            this.player = new Player(this, red_spawnG.x, red_spawnG.y, 'idle', 0);
        } else if (spawnpoint == "blue_spawn") {
            console.log(spawnpoint);
            spawnpoint = "";
            this.player = new Player(this, blue_spawnG.x, blue_spawnG.y, 'idle', 0);
        }
        
        // tutorial text
        let menuConfig = {
            fontFamily: 'Square',
            fontSize: '15px',
            color: '#2b397c',
            stroke: '#15d681',
            strokeThickness: 5,
            align: 'center'
          }

        this.tutorial = this.add.text(core_spawnG.x+100, core_spawnG.y-60, 'Press S or ↓ to fall\nthrough grassy platforms' , menuConfig).setOrigin(0.5);
        
        // add physics collider
        this.physics.add.collider(this.player, platformLayer);
        //collider for the passable platforms and the main player
        this.physics.add.collider(this.player, this.passPlatforms, null, checkOneWay, this);

        // set up key input
        cursors = this.input.keyboard.createCursorKeys();
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        //the function that allows us to stand on platforms as we wish, and fall through them when we want to as well
        function checkOneWay(player, platform) {
            if(player.y < platform.y && (cursors.down.isDown || keyS.isDown)) {
                player.anims.play('player_fall', false);
                return false;
            }
            else if(player.y < platform.y) {
                return true;
            }
            else {
                return false;
            }
        }

        // set up boundaries
        this.core_boundG = map.findObject("boundary", obj => obj.name === "core boundary");
        this.blue_boundG = map.findObject("boundary", obj => obj.name === "blue boundary");
        this.red_boundG = map.findObject("boundary", obj => obj.name === "red boundary");
       
        // add enemy
        this.enemy01 = new EnemyJumper(this, 512, 1424, 'jumper', 0)
        this.enemy01.depth = 2;
        this.physics.add.collider(this.enemy01, platformLayer);

        //this.enemy02 = new EnemyPatroller(this, 700, 1100, 'enemy', 0);
        //this.enemy02.depth = 2;
        //this.physics.add.collider(this.enemy02, platformLayer);

        // camera
        this.cameras.main.setBounds(0,0,1216, 2016);
        this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
    }

    update() {
        
        this.player.update();
        this.enemy01.update();
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
        }

        if(this.checkCollision(this.player, this.core_boundG)) {
            spawnpoint = "green_spawn";
            console.log(spawnpoint);
            this.greenMusic.stop();
            this.scene.start("coreScene");
        }
        if(this.checkCollision(this.player, this.blue_boundG)) {
            spawnpoint = "green_spawn";
            console.log(spawnpoint);
            this.greenMusic.stop();
            this.scene.start("blueScene");
        }
        if(this.checkCollision(this.player, this.red_boundG)) {
            spawnpoint = "green_spawn";
            console.log(spawnpoint);
            this.greenMusic.stop();
            this.scene.start("redScene");
        }

        // check enemy collision
        if(this.checkCollision(this.player, this.enemy01)) {
            if (!this.invincible) {
                playerHealth -=33;
                this.player.setVelocityX(500);
                this.invincible = true;
                this.player.setAlpha(0.5);
                this.timedEvent = this.time.addEvent({ delay: 1500, callback: this.setVulnerable, callbackScope: this, loop: false});
            }
        }

        // check for death scene
        if(playerHealth <= 0) {
            this.scene.launch("deathScene");
            this.scene.pause();
            this.greenMusic.stop();
        }

        if (GameState > 2) {
            this.tutorial.visible = false;
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