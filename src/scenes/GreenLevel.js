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
            volume: 0.2,
            loop: true,
        }
        this.greenMusic = this.sound.add('greenMusic');
        this.greenMusic.play(musicConfig);

        // sfx config
        let sfxConfig = {
            volume: 0.3,
            loop: false
        }
        this.shard_sfx = this.sound.add('shard_sfx');
        
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
        // add animated crystal 
        const greenCrystal = map.findObject("crystal", obj => obj.name === "crystal");
        this.greenCrystal = this.add.sprite(greenCrystal.x, greenCrystal.y, 'green_crystal').setOrigin(0.5, 0);
        this.greenCrystal.anims.play("green_float", true);
        this.vinePlatforms = map.createFromObjects("Passable Platforms", {
            name: "vines",
            key: "tiles2",
            frame: 29
        });
        //THIS CODE IS REALLY IMPORTANT BECAUSE IT ENSURES THAT THE OBJECTS WILL BE TREATED LIKE PLATFORMS, DO NOT FORGET IT
        this.physics.world.enable(this.vinePlatforms, Phaser.Physics.Arcade.STATIC_BODY);
        this.passPlatforms = this.add.group(this.vinePlatforms);
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
            this.cameras.main.fadeIn(500, 0, 0, 0)
        } else if (spawnpoint == "red_spawn") {
            console.log(spawnpoint);
            spawnpoint = "";
            this.player = new Player(this, red_spawnG.x, red_spawnG.y, 'idle', 0);
            this.cameras.main.fadeIn(500, 0, 0, 0)
        } else if (spawnpoint == "blue_spawn") {
            console.log(spawnpoint);
            spawnpoint = "";
            this.player = new Player(this, blue_spawnG.x, blue_spawnG.y, 'idle', 0);
            this.cameras.main.fadeIn(500, 0, 0, 0)
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

        this.tutorial = this.add.sprite(core_spawnG.x-35, core_spawnG.y+90, "tut_fall").setOrigin(0.5).setAlpha(0.6);
        
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
       
        // add enemy jumpers from object layer
        this.enemy01 = map.createFromObjects("enemy", {
            name: "jumper",
            key: "jumper",
            classType: EnemyJumper,
            frame: 0
        });
        this.physics.world.enable(this.enemy01, Phaser.Physics.Arcade.STATIC_BODY);
        this.enemy01.depth = 2;
        this.physics.add.collider(this.enemy01, platformLayer);
        this.enemy01Group = this.add.group(this.enemy01);
        this.enemy01Group.setOrigin(0.5);
    
        // add enemy patrollers from object layer
        this.enemy02 = map.createFromObjects("enemy", {
            name: "patroller",
            key: "patroller",
            classType: EnemyPatroller,
            frame: 0
        });
        this.physics.world.enable(this.enemy02, Phaser.Physics.Arcade.STATIC_BODY);
        this.enemy02.depth = 2;
        this.physics.add.collider(this.enemy02, platformLayer);
        this.enemy02Group = this.add.group(this.enemy02);
        this.enemy02Group.setOrigin(0.5);

        // add health shard
        this.shard = map.createFromObjects("shard", {
            name: "shard",
            key: "shard",
            frame: 0
        });
        this.physics.world.enable(this.shard, Phaser.Physics.Arcade.STATIC_BODY);
        this.shard.map((shard) => {
            shard.body.setCircle(12).setOffset(4,4);
        })
        this.shardGroup = this.add.group(this.shard);
        for (var i = 0; i < this.shard.length; i++) {
            this.shard[i].anims.play("shard_float");
        }
        this.shardVfxManager = this.add.particles('shard', 0);
        this.shardVfxEffect = this.shardVfxManager.createEmitter({
            follow: this.player,
            quantity: 20,
            scale: {start: 0.5, end: 0.0},
            speed: {min: 50, max: 100},
            lifespan: 800,
            on: false
        });
        this.physics.add.overlap(this.player, this.shardGroup, (obj1, obj2) => {
            this.sound.play('shard_sfx', sfxConfig);
            this.shardVfxEffect.explode();
            playerHealth += 33;
            obj2.destroy();
        });
        this.physics.add.collider(this.shard, platformLayer);

        // camera
        this.cameras.main.setBounds(0,0,1216, 2016);
        this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
    }

    update() {
        
        this.player.update();

         // pause scene 
         if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.launch("pauseScene");
            this.scene.pause();
        }

        if(this.checkCollision(this.player, this.core_boundG)) {
            spawnpoint = "green_spawn";
            console.log(spawnpoint);
            this.greenMusic.stop();
            this.cameras.main.fadeOut(500, 0, 0, 0)
            this.scene.start("coreScene");
        }
        if(this.checkCollision(this.player, this.blue_boundG)) {
            spawnpoint = "green_spawn";
            console.log(spawnpoint);
            this.greenMusic.stop();
            this.cameras.main.fadeOut(500, 0, 0, 0)
            this.scene.start("blueScene");
        }
        if(this.checkCollision(this.player, this.red_boundG)) {
            spawnpoint = "green_spawn";
            console.log(spawnpoint);
            this.greenMusic.stop();
            this.cameras.main.fadeOut(500, 0, 0, 0)
            this.scene.start("redScene");
        }

        // check enemy collision
        if(this.checkCollision(this.player, this.enemy01) || this.checkCollision(this.player, this.enemy02)) {
            if (!this.invincible) {
                playerHealth -=33;
                if ((this.player.x < this.enemy01) || (this.player.x < this.enemy02)) {
                    this.player.setVelocityX(-500);
                } else {
                    this.player.setVelocityX(500);
                }
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