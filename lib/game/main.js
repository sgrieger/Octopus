//http://impactjs.com/ejecta/integrating-impact-games#touch-buttons 

ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
    'game.entities.tentacle',
    'game.entities.player',
    'game.entities.octopus',
    'game.entities.playerDeath',
    'game.entities.life',
    'plugins.touchButton'
)
.defines(function () {

    MyGame = ig.Game.extend({
        lives: 2,
        score: 0,
        player: null,
        octopus: null,
        life1: null,
        life2: null,
        tentacleSpeed: 1,
        speedUpFactor: 0.05,

        // Load a font
        font: new ig.Font('media/lcd.font.png'),
        
        init: function () {
            this.life1 = ig.game.spawnEntity(EntityLife, 170, 60);
            this.life2 = ig.game.spawnEntity(EntityLife, 210, 60);
            this.player = ig.game.spawnEntity(EntityPlayer, 100, 100);
            this.octopus = ig.game.spawnEntity(EntityOctopus, 0, 0);

            ig.game.clearColor = "#808080";

            this.timer = new ig.Timer(240);  // 4 minute timer for tenticle speed.
        },

        update: function () {

            // change the speed of the tentacles every 4 minutes.
            if (this.timer && this.timer.delta() > 0) {
                this.timer.reset();
                this.tentacleSpeed = this.tentacleSpeed - this.speedUpFactor;
                if (this.tentacleSpeed < .2) return; // max speed.
                ig.game.octopus.tentacleSpeed = this.tentacleSpeed;
            }

            // Update all entities and backgroundMaps
            this.parent();

        },

        draw: function () {
            // Draw all entities and backgroundMaps
            this.parent();
            
            // Add your own drawing code here
            var x = ig.system.width / 2,
                y = ig.system.height / 2;
            
            //this.font.draw(this.player.position + "  :  " + this.player.goldInBag + "  :  " + this.player.collectingGoldPosition + "  :  " + this.score, x, y, ig.Font.ALIGN.CENTER);

            this.font.draw(this.score, 100, 280);
        }
    });
    
    // Start the Game with 60fps, a resolution of 667x375, scaled up by a factor of 1
    ig.main('#canvas', MyGame, 60, 667, 375, 2);

});
