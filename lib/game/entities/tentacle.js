ig.module('game.entities.tentacle')
.requires('impact.entity')
.defines(function () {
    EntityTentacle = ig.Entity.extend({
        animSheet: null,
        type: ig.Entity.TYPE.B,
        position: {x:0, y:0},
        tentacleIndex: 0,
        lowerArm: false,
        upperArm: false,
        stop: false,

        init: function (x, y, settings) {
            this.tentacleIndex = settings.tentacleIndex;
            this.position.x = x;
            this.position.y = y;

            // based on the index, load the appropriate sprite sheet.
            switch (this.tentacleIndex) {
                case 1:
                    this.animSheet = new ig.AnimationSheet("media/sprites/tentacleSprite1.png", 74, 60);                    
                    this.addAnim('tentacleLower', ig.game.tentacleSpeed, [0, 1, 2, 3, 4, 3, 2, 1, 0], true);
                    this.addAnim('tentacleUpper', ig.game.tentacleSpeed, [0, 1, 5, 6, 5, 1, 0], true);
                    break;
                case 2:
                    this.animSheet = new ig.AnimationSheet("media/sprites/tentacleSprite2.png", 32, 65);
                    this.addAnim('tentacle', ig.game.tentacleSpeed, [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0], true);
                    this.addAnim('grabbed', 1, [6], true);
                    break;
                case 3:
                    this.animSheet = new ig.AnimationSheet("media/sprites/tentacleSprite3.png", 20, 53);
                    this.addAnim('tentacle', ig.game.tentacleSpeed, [0, 1, 2, 3, 4, 3, 2, 1, 0], true);
                    break;
                case 4:
                    this.animSheet = new ig.AnimationSheet("media/sprites/tentacleSprite4.png", 30, 40);
                    this.addAnim('tentacle', ig.game.tentacleSpeed, [0, 1, 2, 3, 2, 1, 0], true);
                    break;
            }

            this.addAnim('tentacleIdle', 0.1, [0], true);
            this.currentAnim = this.anims.tentacleIdle;
            this.animateTentacle();

            this.parent();
        },

        update: function () {
            this.pos.x = this.position.x;
            this.pos.y = this.position.y;            
            
            // random tentalce animation.
            if (this.currentAnim.loopCount > 0 & this.stop == false) {
                this.currentAnim = this.anims.tentacleIdle
                this.animateTentacle();
            }

            if (this.deathTimer != null && this.deathTimer.delta() > 2 && ig.game.lives > 0) {
                this.currentAnim = this.anims.tentacle;
                this.stop = false;
                this.deathTimer.pause();
            }

            this.parent();
        },

        animateTentacle: function () {
            var rndNumber = Math.floor(Math.random() * 100) + 1;
            
            if (rndNumber == 2) {
                if (this.tentacleIndex == 1) {
                    if ((Math.floor(Math.random() * 2) + 1) == 2) {
                        this.currentAnim = this.anims.tentacleUpper;
                        this.upperArm = true; this.lowerArm = false;
                    } else {
                        this.currentAnim = this.anims.tentacleLower;
                        this.upperArm = false; this.lowerArm = true;
                    }
                } else {
                    this.currentAnim = this.anims.tentacle;
                }
                
                this.currentAnim.frameTime = ig.game.tentacleSpeed;
                this.currentAnim.rewind();
            };
        },

        animatePlayerDeath: function () {
            this.currentAnim = this.anims.grabbed;
            if (ig.game.lives > 0) {
                this.deathTimer = new ig.Timer(1);
            } else {
                if (ig.game.score > ig.game.highScore){ ig.game.setHighScore();}
                if (ig.game.introActive == false){
                    ig.game.introActive = true;
                    ig.game.intro();
                }
            }
        }
    });
})