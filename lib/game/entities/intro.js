/*
version = 1
*/
ig.module('game.entities.intro')
.requires('impact.entity', 'impact.font')
.defines(function () {
    EntityIntro = ig.Entity.extend({
        size: { x: 510, y: 256 },
        font: new ig.Font('media/lcd.font.png'),
        introNoInputTimer: null,

        init: function (x, y, settings) {
            ig.input.bind(ig.KEY.MOUSE1, 'leftButton');
            this.parent(x, y, settings);
            this.introNoInputTimer = new ig.Timer(1);
            ig.game.acceptingInput = false;
        },

        update: function () {
            if (this.introNoInputTimer != null && this.introNoInputTimer.delta() > 0){
                ig.game.acceptingInput = true;
                this.introNoInputTimer = null;
            }

            if (ig.input.pressed('leftButton')) {
                if (ig.game.acceptingInput == true){
                    this.setGameModeAndStart();
                }
        }
            this.parent();
        },

        draw: function () {
            this.font.draw("High Score " + ig.game.highScore, 190, 104);
            this.parent();
        },

        setGameModeAndStart: function(){
            if (ig.input.mouse.x > 500 && ig.input.mouse.x < 670 && ig.input.mouse.y > 30 && ig.input.mouse.y < 70){
                ig.game.gameMode = "A";
                ig.game.tentacleSpeed = 1.0;
                ig.game.start();
            }
            if (ig.input.mouse.x > 500 && ig.input.mouse.x < 670 && ig.input.mouse.y > 73 && ig.input.mouse.y < 114){
                ig.game.gameMode = "B";
                ig.game.tentacleSpeed = 0.7;
                ig.game.start();
            }
            if (ig.input.mouse.x > 500 && ig.input.mouse.x < 670 && ig.input.mouse.y > 115 && ig.input.mouse.y < 160){
                
            }
        }
    })
});