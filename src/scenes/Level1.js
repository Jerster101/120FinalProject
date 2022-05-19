class Level1 extends Phaser.Scene {
    constructor() {
        super("Level1");
    }

    create() {
        const gui = new dat.GUI();
        gui.addFolder("Main Camera");
        gui.add(this.cameras.main, 'scrollX');
        gui.add(this.cameras.main, 'scrollY');
        gui.add(this.cameras.main, 'zoom');

        this.CAMWIDTH = 640;
        this.CAMHEIGHT = 360;

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
        this.player = this.physics.add.sprite(200, 1168, 'player').setScale(SCALE);

        cursors = this.input.keyboard.createCursorKeys();

        //add collider
        this.physics.add.collider(this.player, platformLayer);

        // camera
        this.cameras.main.setBounds(0,0,1216, 1280);
        this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
    }

    update() {
        //character animations
        if(cursors.left.isDown) {
            this.player.body.setAccelerationX(-ACCELERATION);
            this.player.setFlip(true, false);
            this.player.anims.play('walk', true);

        } else if(cursors.right.isDown) {
            this.player.body.setAccelerationX(ACCELERATION);
            this.player.resetFlip();
            this.player.anims.play('walk', true);

        } else {
            this.player.body.setAccelerationX(0);
            this.player.body.setDragX(DRAG);
            this.player.anims.play('idle');

        }

        if(!this.player.body.touching.down) {
            this.player.anims.play('jump', true);
        }
        //jumping
        if(this.player.body.touching.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.player.setVelocityY(-1000);
            this.sound.play('temporaryJump');
        }
    }
}