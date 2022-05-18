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
        this.load.audio('temp_menu_sfx', 'temp_menu_sfx.wav');
        this.load.audio('temp_jump_sfx', 'temp_jump_sfx.wav');
        this.load.audio('music', 'background_music.m4a');
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

        let musicConfig = {
            volume: 0.1,
            loop: true,
        }

        this.music = this.sound.add('music');

        this.music.play(musicConfig);

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
        this.player.body.setMaxVelocity(300);
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
        //this.enemy01 = new Enemy(this, 500, 700, 'enemy', 0);

        // camera
        this.cameras.main.setBounds(0,0,1216, 1280);
        this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
    }

    update() {
        // movement
        if((cursors.left.isDown || keyA.isDown) && this.player.body.onFloor) {
            this.player.setAccelerationX(-MOVESPEED);
            this.player.setFlip(true, false);
        } else if((cursors.right.isDown || keyD.isDown) && this.player.body.onFloor) {
            this.player.setAccelerationX(MOVESPEED);
            this.player.resetFlip();
        } else if (this.player.body.onFloor) {
            this.player.body.setDragX(DRAG);
            this.player.setAccelerationX(0);
        }

        // jumping
        if ((cursors.up.isDown || cursors.space.isDown || keyW.isDown) && this.player.body.onFloor) {
            //this.sound.play('temp_jump_sfx');
            this.player.setVelocityY(-JUMPHEIGHT);
        }

        //menu
        if (keyESC.isDown) {
            this.sound.play('temp_menu_sfx');
            this.scene.launch("pauseScene");
            this.scene.pause();
        }

        // check enemy collision
        //if(this.checkCollision(this.player, this.enemy01)) {
        //    this.scene.launch("deathScene");
        //    this.scene.pause();
        //}
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
}