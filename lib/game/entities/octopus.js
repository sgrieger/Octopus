ig.module('game.entities.octopus')
.requires('impact.entity', 'game.entities.tentacle')
.defines(function () {
    EntityOctopus = ig.Entity.extend({
        animSheet: new ig.AnimationSheet("media/sprites/octopus.png", 260, 90),

        tentacleSpeed: 1,

        tentacle1: null,
        tentacle2: null,
        tentacle3: null,
        tentacle4: null,


        init: function () {
            this.addAnim('octopus', 1, [0], true);
            this.tentacle1 = ig.game.spawnEntity(EntityTentacle, 186, 128, { "tentacleIndex": 1 });
            this.tentacle2 = ig.game.spawnEntity(EntityTentacle, 285, 152, { "tentacleIndex": 2 });
            this.tentacle3 = ig.game.spawnEntity(EntityTentacle, 345, 172, { "tentacleIndex": 3 });
            this.tentacle4 = ig.game.spawnEntity(EntityTentacle, 425, 187, { "tentacleIndex": 4 });
            this.parent();
        },

        update: function () {
            this.pos.x = 270;
            this.pos.y = 100;

            this.parent();
        }
    
    });
})