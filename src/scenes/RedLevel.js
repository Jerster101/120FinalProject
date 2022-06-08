class RedLevel extends Phaser.Scene {
    constructor() {
        super("redScene");
    }

    create() {
        currentScene = 'redScene';
        //music configuration and playing for level
        let musicConfig = {
            volume: 0.05,
            loop: true,
        }
        this.redMusic = this.sound.add('redMusic');
        this.redMusic.play(musicConfig);

        // sfx config
        let sfxConfig = {
            volume: 0.3,
            loop: false
        }
        this.shard_sfx = this.sound.add('shard_sfx');
        this.collapse_sfx = this.sound.add('collapse_sfx', {volume:0.1, loop: false});
        
        // add scrolling clouds & parallax environment
        this.bkg1 = this.add.image(1216, 944,'red_bkg1').setScrollFactor(1);
        this.bkg2 = this.add.image(1216, 944,'red_bkg2').setScrollFactor(0.4);
        this.bkg3 = this.physics.add.sprite(1216, 944, 'red_bkg3');
        this.bkg3.body.setAllowGravity(false).setVelocityX(25);
        this.bkg4 = this.physics.add.sprite(1216, 944, 'red_bkg4');
        this.bkg4.body.setAllowGravity(false).setVelocityX(45);
        this.bkg5 = this.add.image(1216, 944,'red_bkg5').setScrollFactor(0.6);
        this.bkg6 = this.add.image(1216, 944,'red_bkg6').setScrollFactor(0.8);
        
        // variables and settings
        this.physics.world.gravity.y = GRAV;

        // add a tilemap
        const map = this.add.tilemap('red_map');
        //to allow us to us the map outside of create
        this.map = map;
        // add a tileset to the map
        const tileset = map.addTilesetImage('red_tileset','red_tiles');
        // create tilemap layers
        const sceneryLayer = map.createLayer('decorations', tileset, 0, 0);
        const platformLayer = map.createLayer('platforms', tileset, 0, 0);
        // add animated crystal 
        const redCrystal = map.findObject("crystal", obj => obj.name === "crystal");
        this.redCrystal = this.add.sprite(redCrystal.x, redCrystal.y, 'red_crystal').setOrigin(0.5, 0);
        this.redCrystal.anims.play("red_float", true);

        //since we have 3 different designs for the collapsible platforms, we compile them all into one group while processing each induvidually
        this.collapse1 = map.createFromObjects("collapsible", {
            name: "collapse1",
            key: "red_tiles",
            frame: 9
        });

        console.log(this.collapse1);

        this.collapse2 = map.createFromObjects("collapsible", {
            name: "collapse2",
            key: "red_tiles",
            frame: 15
        });
        this.collapse3 = map.createFromObjects("collapsible", {
            name: "collapse3",
            key: "red_tiles",
            frame: 21
        });
        //redundant, but probably necessary
        this.physics.world.enable(this.collapse1, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.collapse2, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.collapse3, Phaser.Physics.Arcade.STATIC_BODY);
        this.shakyGround1 = this.add.group(this.collapse1);
        this.shakyGround2 = this.add.group(this.collapse2);
        this.shakyGround3 = this.add.group(this.collapse3);

        // set map collisions
        platformLayer.setCollisionByProperty({
            collides: true,
        });
        
        // spawn player at point
        const core_spawnR = map.findObject("spawn", obj => obj.name === "core spawn");
        const core_spawn2R = map.findObject("spawn", obj => obj.name === "core spawn 2");
        const green_spawn = map.findObject("spawn", obj => obj.name === "green spawn");

        CurrentRoom = 2;

        if (spawnpoint == "core_spawnR") {
            console.log(spawnpoint);
            spawnpoint = "";
            this.player = new Player(this, core_spawnR.x, core_spawnR.y, 'idle', 0);
            this.cameras.main.fadeIn(500, 0, 0, 0)
        } else if (spawnpoint == "core_spawnR2") {
            console.log(spawnpoint);
            spawnpoint = "";
            this.player = new Player(this, core_spawn2R.x, core_spawn2R.y, 'idle', 0);
            this.cameras.main.fadeIn(500, 0, 0, 0)
        } else if (spawnpoint == "green_spawn") {
            console.log(spawnpoint);
            spawnpoint = "";
            this.player = new Player(this, green_spawn.x, green_spawn.y, 'idle', 0);
            this.cameras.main.fadeIn(500, 0, 0, 0)
        }
        
        // add physics collider
        this.physics.add.collider(this.player, platformLayer);
        //physics colliders for the collapsing platforms
        this.physics.add.collider(this.player, this.shakyGround1, this.shakePlatform, this.checkOneWay, this);
        this.physics.add.collider(this.player, this.shakyGround2, this.shakePlatform, this.checkOneWay, this);
        this.physics.add.collider(this.player, this.shakyGround3, this.shakePlatform, this.checkOneWay, this);

        // set up key input
        cursors = this.input.keyboard.createCursorKeys();
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);


        this.green_boundR = map.findObject("boundary", obj => obj.name === "green boundary");
        this.core_boundR = map.findObject("boundary", obj => obj.name === "core boundary");
        this.core_bound2R = map.findObject("boundary", obj => obj.name === "core boundary 2");
    
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
        this.cameras.main.setBounds(0,0,2432, 1888);
        this.cameras.main.startFollow(this.player, true, 0.25, 0.25);

        //variable that creates a timed event that will hopefully allow us to respawn the platforms a few seconds after they collapse
        var timer = this.time.addEvent({
            delay: 7000,
            callback: this.regenPlatforms,
            callbackScope: this,
            loop: true,
        });
    }

    /*this whole function will allow the collapsed platforms to regenerate and have proper physics and collision after being respawned
    it's not very flashy when doing so, but I doubt it really matters
    many thanks to Storm for helping me work through this*/
    regenPlatforms(){
        console.log("Regenerate Platforms");
        var i = 0;
        var anyDestroyed = false;
        while (i < this.collapse1.length && !anyDestroyed){
            if (!this.collapse1[i].active){
                anyDestroyed = true;
            }
            i += 1;
        }
        while (i < this.collapse2.length && !anyDestroyed){
            if (!this.collapse2[i].active){
                anyDestroyed = true;
            }
            i += 1;
        }
        while (i < this.collapse3.length && !anyDestroyed){
            if (!this.collapse3[i].active){
                anyDestroyed = true;
            }
            i += 1;
        }

        if (anyDestroyed){
            i = 0;
            var j = 0;
            var k = 0;
            while (i < this.collapse1.length){
                destroyGameObject(this.collapse1[i]);
                i += 1;
            }
            this.collapse1 = this.map.createFromObjects("collapsible", {
                name: "collapse1",
                key: "red_tiles",
                frame: 9
            });
            this.physics.world.enable(this.collapse1, Phaser.Physics.Arcade.STATIC_BODY);
            this.shakyGround1 = this.add.group(this.collapse1);
            this.physics.add.collider(this.player, this.shakyGround1, this.shakePlatform, this.checkOneWay, this);

            while (j < this.collapse2.length){
                destroyGameObject(this.collapse2[j]);
                j += 1;
            }
            this.collapse2 = this.map.createFromObjects("collapsible", {
                name: "collapse2",
                key: "red_tiles",
                frame: 15
            });
            this.physics.world.enable(this.collapse2, Phaser.Physics.Arcade.STATIC_BODY);
            this.shakyGround2 = this.add.group(this.collapse2);
            this.physics.add.collider(this.player, this.shakyGround2, this.shakePlatform, this.checkOneWay, this);

            while (k < this.collapse3.length){
                destroyGameObject(this.collapse3[k]);
                k += 1;
            }
            this.collapse3 = this.map.createFromObjects("collapsible", {
                name: "collapse3",
                key: "red_tiles",
                frame: 21
            });
            this.physics.world.enable(this.collapse3, Phaser.Physics.Arcade.STATIC_BODY);
            this.shakyGround3 = this.add.group(this.collapse3);
            this.physics.add.collider(this.player, this.shakyGround3, this.shakePlatform, this.checkOneWay, this);
        }
    }

    update() {

        this.player.update();

        //enemy collision
        this.enemy01Group.getChildren().forEach(function(enemy) {
            if (this.checkCollision(this.player, enemy)) {
                if (!this.player.invincible) {
                    playerHealth -=33;
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

        if(this.checkCollision(this.player, this.core_boundR)) {
            spawnpoint = "red_spawn";
            console.log(spawnpoint);
            CurrentRoom = 1
            this.redMusic.stop();
            this.cameras.main.fadeOut(500, 0, 0, 0)
            this.scene.start("coreScene");
        }
        if(this.checkCollision(this.player, this.core_bound2R)) {
            spawnpoint = "red_spawn";
            console.log(spawnpoint);
            this.redMusic.stop();
            this.cameras.main.fadeOut(500, 0, 0, 0)
            this.scene.start("coreScene");
        }
        if(this.checkCollision(this.player, this.green_boundR)) {
            spawnpoint = "red_spawn";
            console.log(spawnpoint);
            CurrentRoom = 5;
            this.redMusic.stop();
            this.cameras.main.fadeOut(500, 0, 0, 0)
            this.scene.start("greenScene");
        }

        //cloud wrapping
        this.physics.world.wrap(this.bkg3, this.bkg3.width);
        this.physics.world.wrap(this.bkg4, this.bkg4.width);

        // check for death scene
        if(playerHealth <= 0) {
            this.scene.launch("deathScene");
            this.scene.pause();
            this.redMusic.stop();
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

    shakePlatform(player, platform) {
        this.sound.play('collapse_sfx', {volume: 0.05});
        /*stupidly long series of functions that allow the platforms to collapse,
        as well as, hopefully soon, having them respawn a few moments later*/
        if(player.body.blocked.down) {      //if the player is standing on the platform
            this.cameras.main.shake(200, 0.001);        //then shake the camera
            //this is a global variable we have to use so that Phaser doesn't get confused
            var ourScene = this;
            var tween = this.tweens.add({
                targets: platform,
                yoyo: true,
                repeat: 10,
                x: {    //if the player is not on the block, then shake the block 
                    from: platform.x,
                    to: platform.x + 2 *1
                },
                ease: 'Linear',
                duration: 50,
                onComplete: function() {
                    ourScene.destroyPlatform(platform);
                }
            });
        }
    }    
    //function to destroy the platforms specifically, not sure if this needs to be seperate, we can decide later
    destroyPlatform(platform) {
        var tween = this.tweens.add({
            targets: platform,
            alpha: 0,
            y: "+=25",
            ease: 'Linear',
            duration: 100,
            onComplete: function() {
                destroyGameObject(platform);
            }
        });
    }
    //this function here is used to allow us to pass though the collapsing platforms from below, we may want to get rid of this.
    checkOneWay(player, platform) {
        if(player.y < platform.y) {
            return true;
        }
        else {
            return false;
        }
    }
}
