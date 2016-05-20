ig.module('game.entities.playerDeath')
.requires('impact.entity')
.defines(function () {
    EntityPlayerDeath = ig.Entity.extend({
        animSheet: new ig.AnimationSheet("media/sprites/playerDeath.png", 58, 46),
        blip: new ig.Sound("media/sounds/blip.*"),
        deathSoundTimer: null,
        deathSoundCount: 0,

        init: function (x, y, settings) {
            this.pos.x = 300;
            this.pos.y = 160;
            this.addAnim('playerDeath', 1, [0, 1, 0, 1, 0, 1]);
            if (ig.game.lives > 0) {
                this.deathTimer = new ig.Timer(1);
            } else {
                ig.game.tickTimer = null;
            }
            this.deathSoundTimer = new ig.Timer(0.5);
            this.deathSoundDuration = new ig.Timer(2);
        },

        update: function () {
            if (this.deathSoundTimer != null && this.deathSoundTimer.delta() > 0){
                this.deathSoundTimer = new ig.Timer(0.5);
                this.blip.play();
                this.deathSoundCount++;
            }

            if (this.deathSoundCount >= 5){
                this.deathSoundTimer = null;
            }

            if (this.deathTimer != null && this.deathTimer.delta() > 2) {
                this.kill();
                if (ig.game.lives == 2) {
                    ig.game.life2.kill();
                }
                if (ig.game.lives == 1) {
                    ig.game.life1.kill();
                }
                ig.game.player = ig.game.spawnEntity(EntityPlayer, 100, 100);
                ig.game.lives--;
            }
            this.parent();
        },

        kill: function(){
            this.parent();
        }
    })
})