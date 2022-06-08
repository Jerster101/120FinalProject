class EnemyPatroller extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, frame) {
        // call Phaser Physics Sprite constructor
        super(scene, x, y, key, frame);
        // setup Physics Sprite
        scene.add.existing(this);               // make it real
        scene.physics.add.existing(this);       // add physics body

        // set properties
        //this.body.setImmovable();
        //this.setOrigin(0, 1);
        this.anims.play('patroller_anim');

        // custom properties
        this.movingRight = true;
        this.MOVESPEED = 50;
        this.patrolDelay = 2000;
        //this.patrolStartTime = Phaser.Math.Between(500, 2500);    // randomize to offset jumps

        this.initPatrolTimer(scene);
    }

    initPatrolTimer(scene) {
        // attach timer event to scene context
        scene.patrolTimer = scene.time.addEvent({
            delay: this.patrolDelay,
            loop: true,
            startAt: 0,
            callbackScope: this,    // keep callback scoped to Jumper object
            callback: () => {
                if (this.movingRight) {
                    this.body.setVelocityX(-this.MOVESPEED);
                    this.movingRight = false;
                } else {

                    this.body.setVelocityX(this.MOVESPEED);
                    this.movingRight = true;
                
                }
                this.anims.play('patroller_anim', true);
            }
        });
    }
}