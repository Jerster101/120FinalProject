class BlueLevel extends Phaser.Scene {
    constructor() {
        super("blueScene");
    }

    create() {
        currentScene = 'blueScene';
        CurrentRoom = 4;

        //music configuration and playing for level
        let musicConfig = {
            volume: 0.2,
            loop: true,
        }
        this.blueMusic = this.sound.add('blueMusic');
        this.blueMusic.play(musicConfig);

        // sfx config
        let sfxConfig = {
            volume: 0.3,
            loop: false
        }
        this.shard_sfx = this.sound.add('shard_sfx');
        this.bounce_sfx = this.sound.add('bounce_sfx');
        this.damage_sfx = this.sound.add('damage_sfx');
        this.crystal_sfx = this.sound.add('crystal_sfx');

        // add parallax background
        this.blue_bkg1 = this.add.image(1216, 640,'blue_bkg1');
        this.blue_bkg2 = this.add.image(1216, 640,'blue_bkg2').setScrollFactor(0.3);
        this.blue_bkg3 = this.add.image(1216, 640,'blue_bkg3').setScrollFactor(0.5);
        this.blue_bkg4 = this.add.image(1216, 640,'blue_bkg4').setScrollFactor(0.7);
        this.blue_bkg5 = this.add.image(1216, 640,'blue_bkg5').setScrollFactor(0.8);
        
        // variables and settings
        this.physics.world.gravity.y = GRAV;

        // add a tilemap
        const map = this.add.tilemap('blue_map');
        // add a tileset to the map
        const tileset = map.addTilesetImage('blue_tileset','blue_tiles');
        // create tilemap layers
        const sceneryLayer = map.createLayer('scenery', tileset, 0, 0);
        const platformLayer = map.createLayer('platforms', tileset, 0, 0);
        //make the mushrooms bounceable objects
        this.mushrooms = map.createFromObjects("bouncy", {
            name: "bouncy",
            key: "blue_tiles",
            frame: 46
        });
        this.physics.world.enable(this.mushrooms, Phaser.Physics.Arcade.STATIC_BODY);
        this.bouncePlatforms = this.add.group(this.mushrooms);
        
        // set map collisions
        platformLayer.setCollisionByProperty({
            collides: true,
        });
        
        // spawn player at point
        const core_spawnB = map.findObject("spawn", obj => obj.name === "core spawn");
        const green_spawnB = map.findObject("spawn", obj => obj.name === "green spawn");
        if (spawnpoint == "core_spawnB") {
            spawnpoint = "";
            this.player = new Player(this, core_spawnB.x, core_spawnB.y, 'idle', 0);
            this.cameras.main.fadeIn(500, 0, 0, 0)
        } else if (spawnpoint == "green_spawn") {
            spawnpoint = "";
            this.player = new Player(this, green_spawnB.x, green_spawnB.y, 'idle', 0);
            this.cameras.main.fadeIn(500, 0, 0, 0)
        }

        // set up boundaries
        this.core_boundG = map.findObject("boundary", obj => obj.name === "core boundary");
        this.green_boundG = map.findObject("boundary", obj => obj.name === "green boundary");

        // layer foreground over player & all backgrounds
        this.blue_bkg6 = this.add.image(1216, 640,'blue_bkg6').setDepth(6).setScrollFactor(1.1,1);

        // bounce tutorial
        this.tutorial5 = this.add.sprite(core_spawnB.x+180, core_spawnB.y+300, "tut_bounce").setOrigin(0.5).setAlpha(0.6);

        // add physics collider
        this.physics.add.collider(this.player, platformLayer);
        this.physics.add.collider(this.player, this.bouncePlatforms, bouncePlayer, null, this);

        // set up key input
        cursors = this.input.keyboard.createCursorKeys();
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        //the player can bounce on the mushrooms, and by holding down the jump button, can bounce higher
        function bouncePlayer(player, tile) {
            this.sound.play('bounce_sfx', {volume: 0.5});
            if(cursors.up.isDown || cursors.space.isDown || keyW.isDown) {
                player.setVelocityY(-1000);
            }
            else {
                player.setVelocityY(-700);
            }
            this.tweens.add({
                targets: tile,
                yoyo: true,
                y: {
                    from: tile.y,
                    to: tile.y + 2 * 1
                },
                ease: 'Linear',
                duration: 50,
            });
        }

        // add enemy jumpers from object layer
        this.enemy01 = map.createFromObjects("enemy", {
            name: "jumper",
            key: "jumper",
            classType: EnemyJumper,
            frame: 0
            });
        this.physics.world.enable(this.enemy01, Phaser.Physics.Arcade.STATIC_BODY);
        this.enemy01.depth = 5;
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
        this.enemy02.depth = 5;
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
        this.shardGroup.setDepth(5);
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
            console.log(playerHealth);
            if (playerHealth < maxHealth) {
                playerHealth += 33;
                this.updateHearts();
            }
            obj2.destroy();
        });
        this.physics.add.collider(this.shard, platformLayer);

        // add blue chroma crystal 
        const blueCrystal = map.findObject("crystal", obj => obj.name === "crystal");
        this.blueCrystal = this.add.sprite(blueCrystal.x, blueCrystal.y, 'blue_crystal').setOrigin(0.5, 0);
        this.blueCrystal.anims.play("blue_float", true);
        this.blueCrystal.setDepth(5);
        this.physics.world.enable(this.blueCrystal, Phaser.Physics.Arcade.STATIC_BODY);
        this.blueCrystalVfxManager = this.add.particles('blue_crystal', 0);
        this.blueCrystalVfxEffect = this.blueCrystalVfxManager.createEmitter({
            follow: this.player,
            quantity: 20,
            scale: {start: 0.5, end: 0.0},
            speed: {min: 100, max: 200},
            lifespan: 800,
            on: false
        });
        this.physics.add.overlap(this.player, this.blueCrystal, (obj1, obj2) => {
            this.sound.play('crystal_sfx', sfxConfig);
            this.blueCrystalVfxEffect.explode();
            GameState = 5;
            this.player.recolor(this);
            obj2.destroy();
        });
        this.physics.add.collider(this.blueCrystal, platformLayer);

        // camera
        this.cameras.main.setBounds(0,0,2432, 1280);
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
        

        //enemy collision
        this.enemy01Group.getChildren().forEach(function(enemy) {
            if (this.checkCollision(this.player, enemy)) {
                if (!this.player.invincible) {
                    playerHealth -=33;
                    this.sound.play('damage_sfx', {volume: 0.3});
                    this.updateHearts();
                    this.player.setVelocityX(500);
                    this.player.invincible = true;
                    this.player.setAlpha(0.5);
                    this.timedEvent = this.time.addEvent({ delay: 1500, callback: this.setVulnerable, callbackScope: this, loop: false});
                }
            }
        }, this);

        this.enemy02Group.getChildren().forEach(function(enemy) {
            if (this.checkCollision(this.player, enemy)) {
                if (!this.player.invincible) {
                    playerHealth -=33;
                    this.sound.play('damage_sfx', {volume: 0.3});
                    this.updateHearts();
                    this.player.setVelocityX(500);
                    this.player.invincible = true;
                    this.player.setAlpha(0.5);
                    this.timedEvent = this.time.addEvent({ delay: 1500, callback: this.setVulnerable, callbackScope: this, loop: false});
                }
            }
        }, this);

         // pause scene 
         if (Phaser.Input.Keyboard.JustDown(keyESC)) {
            this.scene.launch("pauseScene");
            this.scene.pause();
        }

        this.events.on('pause', function() {
            this.blueMusic.pause();
        }, this);

        this.events.on('resume', function() {
            this.blueMusic.resume();
        }, this);

        // check enemy collision
        if(this.checkCollision(this.player, this.enemy01) || this.checkCollision(this.player, this.enemy02)) {
            if (!this.invincible) {
                playerHealth -=33;
                this.updateHearts();
                this.sound.play('damage_sfx', {volume: 0.3});
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
            this.blueMusic.stop();
        }

        // movement between scenes
        if(this.checkCollision(this.player, this.core_boundG)) {
            spawnpoint = "blue_spawn";
            this.blueMusic.stop();
            this.cameras.main.fadeOut(500, 0, 0, 0)
            this.scene.start("coreScene");
        }
        if(this.checkCollision(this.player, this.green_boundG)) {
            spawnpoint = "blue_spawn";
            this.blueMusic.stop();
            this.cameras.main.fadeOut(500, 0, 0, 0)
            this.scene.start("greenScene");
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
        this.player.invincible = false;
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


