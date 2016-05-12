ig.module('game.entities.playerDeath')
.requires('impact.entity')
.defines(function () {
    EntityPlayerDeath = ig.Entity.extend({
        animSheet: new ig.AnimationSheet("media/sprites/playerDeath.png", 83, 66),

        init: function (x, y, settings) {
            this.pos.x = 267;
            this.pos.y = 130;
            this.addAnim('playerDeath', 1, [0, 1, 0, 1, 0, 1]);
            if (ig.game.lives > 0) {
                this.deathTimer = new ig.Timer(1);
            }
        },
        update: function () {
            if (this.deathTimer != null && this.deathTimer.delta() > 5) {
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
        }
    })
})