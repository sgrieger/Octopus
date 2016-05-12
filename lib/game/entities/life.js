ig.module('game.entities.life')
.requires('impact.entity')
.defines(function () {
    EntityLife = ig.Entity.extend({
        animSheet: new ig.AnimationSheet("media/sprites/playerSprite.png", 88, 69),
        
        init: function (x, y, settings) {
            this.pos.x = x;
            this.pos.y = y;
            this.addAnim('default', 1, [2]);
        }
    })
})