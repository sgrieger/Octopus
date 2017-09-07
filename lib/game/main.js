// TO-DO

/*
Version 1
  Sounds
*/
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
    'game.entities.intro',
    'game.entities.background',
    'game.entities.gotGold'
)
.defines(function () {

    MyGame = ig.Game.extend({
        lives: 0,
        score: 0,
        player: null,
        octopus: null,
        life1: null,
        life2: null,
        playerDeath: null,
        introScreen: null,
        introActive: true,
        tentacleSpeed: 1.0,
        speedUpFactor: 0.1,
        highScore: 0,
        acceptingInput: false,
        gameMode: "",
        tick: new ig.Sound("media/sounds/tick.*"),
        blip: new ig.Sound("media/sounds/blip.*"),
        tickTimer: null,

        // Load a font
        font: new ig.Font('media/lcd.font.png'),
        
        init: function () {
            this.background = ig.game.spawnEntity(EntityBackground,0,0);
            this.octopus = ig.game.spawnEntity(EntityOctopus, 0, 0);
            ig.game.clearColor = "#808080";

            // get the high score
            if (localStorage.getItem("octoHighScore") == null) this.setHighScore();
            this.highScore = localStorage.getItem("octoHighScore");

            ig.game.intro();

        },

        intro: function (){
            this.lives = 0;
            if (this.player != null){
                this.player.kill();
            }
            this.player = null;
            this.life1 = null;
            this.life2 = null;
            this.tentacleSpeed = 1.0;
            if (this.introScreen == null){
                this.introScreen = ig.game.spawnEntity(EntityIntro);
            }
        },

        start: function(){
            if (this.acceptingInput == false){
                this.parent();
                return;
            }
            // hide all the help stuff.
            ig.game.introScreen.kill();
            ig.game.introScreen = null;
            this.introActive = false;
            if (this.playerDeath != null) {this.playerDeath.kill();}
            
            // defaults
            this.score = 0;
            this.lives = 2;

            // start the speedup timer.
            this.SpeedTimer = new ig.Timer(90);

            // create the life icons.
            this.life1 = ig.game.spawnEntity(EntityLife, 240, 101);
            this.life2 = ig.game.spawnEntity(EntityLife, 270, 101);

            this.tickTimer = new ig.Timer(this.tentacleSpeed);

            // create the player.
            this.player = null;
            this.player = ig.game.spawnEntity(EntityPlayer, 100, 100);
        },

        update: function () {

            // change the speed of the tentacles every 4 minutes.
            if (this.SpeedTimer && this.SpeedTimer.delta() > 0) {
                this.SpeedTimer.reset();
                if (this.tentacleSpeed < .3) return; // max speed.
                this.tentacleSpeed = this.tentacleSpeed - this.speedUpFactor;
            }

            if (this.tickTimer != null && this.tickTimer.delta() > 0){
                this.tickTimer = new ig.Timer(this.tentacleSpeed);
                this.tick.play();
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
            this.font.draw(this.score, 400, 104);
            this.font.draw(this.gameMode, 200, 260);
        },

        setHighScore: function() {
            localStorage.setItem("octoHighScore", this.score);
            this.highScore = this.score;
        }
    });
    
    // Start the Game with 60fps, a resolution of 667x375, scaled up by a factor of 1
    ig.main('#canvas', MyGame, 60, 667, 375, 1);

});
