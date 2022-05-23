class Level1 extends Phaser.Scene {
    constructor() {
        super("levelOneScene");
    }
    
    preload() {
        this.load.path = 'assets/';
        this.load.image('enemy', 'Enemy.png');
        this.load.image('player', 'Player.png');
        this.load.image('tiles', 'red_ground.png');
        this.load.tilemapTiledJSON('map', 'red_map.json');
    }

    create() {
        const gui = new dat.GUI();
        gui.addFolder("Main Camera");
        gui.add(this.cameras.main, 'scrollX');
        gui.add(this.cameras.main, 'scrollY');
        gui.add(this.cameras.main, 'zoom');

        this.CAMWIDTH = 640;
        this.CAMHEIGHT = 360;
        
        // variables and settings
        this.physics.world.gravity.y = GRAV;

        // add a tilemap
        const map = this.add.tilemap('map');
        // add a tileset to the map
        const tileset = map.addTilesetImage('red_ground','tiles');
        // create tilemap layers
        const platformLayer = map.createLayer('platform', tileset, 0, 0);
        // set map collisions
        platformLayer.setCollisionByProperty({
            collides: true,
        });
        
        // set up player
        this.player = this.physics.add.sprite(200, 1168, 'player');
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

        // add enemy
        this.enemy01 = new EnemyJumper(this, 570, 1100, 'enemy', 0);
        this.physics.add.collider(this.enemy01, platformLayer);

        this.enemy02 = new EnemyPatroller(this, 700, 1100, 'enemy', 0);
        this.physics.add.collider(this.enemy02, platformLayer);

        // camera
        this.cameras.main.setBounds(0,0,1216, 1280);
        this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
    }

    update() {

        this.enemy02.update();

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
        }

        // check enemy collision
        if(this.checkCollision(this.player, this.enemy01) || this.checkCollision(this.player, this.enemy02)) {
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