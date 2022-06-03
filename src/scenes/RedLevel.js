class RedLevel extends Phaser.Scene {
    constructor() {
        super("redScene");
    }

    create() {
        currentScene = 'redScene';
        //music configuration and playing for level
        let musicConfig = {
            volume: 0.1,
            loop: true,
        }
        let redMusic = this.sound.add('redMusic');
        redMusic.play(musicConfig);
        
        // add scrolling clouds & parallax environment
        this.bkg1 = this.add.image(1216, 944,'red_bkg1').setScrollFactor(1);
        this.bkg2 = this.add.image(1216, 944,'red_bkg2').setScrollFactor(0.4);
        this.bkg3 = this.physics.add.sprite(1216, 944, 'red_bkg3');
        this.bkg3.body.setAllowGravity(false).setVelocityX(25);
        this.bkg4 = this.physics.add.sprite(1216, 944, 'red_bkg4');
        this.bkg4.body.setAllowGravity(false).setVelocityX(45);
        this.bkg5 = this.add.image(1216, 944,'red_bkg5').setScrollFactor(0.6);
        this.bkg6 = this.add.image(1216, 944,'red_bkg6').setScrollFactor(0.8);

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
        const map = this.add.tilemap('red_map');
        // add a tileset to the map
        const tileset = map.addTilesetImage('red_tileset','red_tiles');
        // create tilemap layers
        const sceneryLayer = map.createLayer('decorations', tileset, 0, 0);
        const platformLayer = map.createLayer('platforms', tileset, 0, 0);
        // set map collisions
        platformLayer.setCollisionByProperty({
            collides: true,
        });
        
        // spawn player at point
        const core_spawnR = map.findObject("spawn", obj => obj.name === "core spawn");
        if (spawnpoint == "core_spawnR") {
            console.log(spawnpoint);
            spawnpoint = "";
            this.player = new Player(this, core_spawnR.x, core_spawnR.y, 'idle', 0);
        };
        
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

        this.player.update();
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

        //cloud wrapping
        this.physics.world.wrap(this.bkg3, this.bkg3.width);
        this.physics.world.wrap(this.bkg4, this.bkg4.width);

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

