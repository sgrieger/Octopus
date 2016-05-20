ig.module('game.entities.background')
.requires('impact.entity', 'impact.font')
.defines(function () {
    EntityBackground = ig.Entity.extend({
        size: { x: 510, y: 256 },
        animSheet: new ig.AnimationSheet('media/tiles/background.png', 667, 375),

        init: function (x, y, settings) {
            this.addAnim('normal', 0.1, [0]);
            this.parent(x, y, settings);
            
            this.currentAnim = this.anims.normal;
        },
        update: function () {
            this.parent();
        },
        draw: function () {
            this.parent();
        }
    })
});