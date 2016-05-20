﻿ig.module('game.entities.player')
.requires('impact.entity')
.defines(function () {
    EntityPlayer = ig.Entity.extend({
        animSheet : new ig.AnimationSheet("media/sprites/playerSprite.png", 62, 49),
        position : 0,
        buttonPressed : false,
        goldInBag : 0,
        collectingGoldPosition : 0,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.B,
        blip: new ig.Sound("media/sounds/blip.*"),
        canMove: null,
        gotGoldTimer: null,
        playGotGoldSound: null,

        init: function (x, y, settings) {
            this.canMove = new ig.Timer(0.5);
            ig.input.bind(ig.KEY.MOUSE1, 'leftButton');
            ig.input.bind(ig.KEY.RIGHT_ARROW, "right");
            ig.input.bind(ig.KEY.LEFT_ARROW, "left");
            this.inWaterTimer = new ig.Timer(8);

            this.anims = {
                "positions": [
                    { "x": 100, "y": 100 },
                    { "x": 100, "y": 100 },
                    { "x": 100, "y": 100 },
                    { "x": 100, "y": 100 },
                    { "x": 100, "y": 100 }
                ]
            };

            this.addAnim('0', 0.1, [2]);
            this.addAnim('1', 0.1, [3]);
            this.addAnim('2', 0.1, [4]);
            this.addAnim('3', 0.1, [5]);
            this.addAnim('4', 0.1, [6]);
            this.addAnim('5', 0.1, [7]);
            this.addAnim('6', 0.1, [8]);
            this.addAnim('7', 0.1, [9]);
            this.addAnim('8', 0.1, [8]);
            this.addAnim('GotGold', 0.3, [2,1,2,1,2,1]);

            this.parent();
        },

        update: function () {
            if (this.position > 5) this.position = 5;

            if (this.gotGoldTimer != null){
                if (this.playGotGoldSound.delta() > 0){
                    this.playGotGoldSound = new ig.Timer(0.5);
                    this.blip.play();
                    ig.game.score++;
                }
                if (this.gotGoldTimer.delta() < 0)
                {
                        this.parent();
                        return;
                } else {
                    this.gotGoldTimer = null;
                    this.playGotGoldSound = null;
                    this.currentAnim = this.anims[0];
                }
            }

            switch (this.position) {
                case 0:
                    this.pos.x = 205;
                    this.pos.y = 101;
                    break;
                case 1:
                    this.pos.x = 195;
                    this.pos.y = 145;
                    break;
                case 2:
                    this.pos.x = 208;
                    this.pos.y = 200;
                    break;
                case 3:
                    this.pos.x = 280;
                    this.pos.y = 235;
                    break;
                case 4:
                    this.pos.x = 330;
                    this.pos.y = 232;
                    break;
                case 5: case 6: case 7: case 8:
                    this.pos.x = 375;
                    this.pos.y = 237;
                    break;
            }

            if (this.canMove != null && this.canMove.delta() < 0){
                this.parent();
                return;
            } else {
                this.canMove == null
            }

            // check collision
            this.checkCollision();

            // check to see if the player is in the boat and put him in the water after 8 seconds.
            if (this.inWaterTimer && this.inWaterTimer.delta() > 0) {
                this.inWaterTimer.reset();
                this.inWaterTimer = null;
                this.position++;
                this.currentAnim = this.anims[this.position];
            }

            var touched = "";
            if (ig.input.pressed('leftButton')) {
                if (ig.input.mouse.x < (ig.system.width / 2))
                {
                    touched = "left";
                } else {
                    touched = "right";
                }
            }

            if (touched == "right" || (ig.input.state("right") && this.buttonPressed == false)) {
                this.buttonPressed = true;
                if (this.position == 5) {
                    // collecting gold position
                    this.collectingGoldPosition++;
                    if (this.collectingGoldPosition == 4) {
                        this.collectingGoldPosition = 0;
                    }
                    if (this.collectingGoldPosition == 2) {
                        this.blip.play();
                        this.goldInBag++;
                        ig.game.score++;
                    }
                    this.currentAnim = this.anims[this.position + this.collectingGoldPosition];
                    return;
                }
                this.position++;
                this.inWaterTimer = null;
                if (this.position > 8) this.position = 8;
                this.currentAnim = this.anims[this.position];
            }
            if (ig.input.released("right")) {
                this.buttonPressed = false;
            }

            if (touched == "left" || (ig.input.state("left") && this.buttonPressed == false)) {
                this.buttonPressed = true;
                this.collectingGoldPosition = 0;
                if (this.position == 1) {
                    // if no gold in bag then you cannot enter the boat.
                    if (this.goldInBag == 0) {
                        return;
                    }
                }
                if (this.position > 0) { this.position--; }
                if (this.position == 0) {
                    // back in the boat.
                    if (this.goldInBag > 0) {
                        this.goldInBag = 0;
                        // start 8 second timer.
                        this.inWaterTimer = new ig.Timer(8);
                        // set to 0 amination
                        this.currentAnim = this.anims[0];
                        this.animateGotGold();
                        return;
                    }
                }
                this.currentAnim = this.anims[this.position];
            }
            if (ig.input.released("left")) {
                this.buttonPressed = false;
            }

            this.parent();
        },

        kill: function () {
            if (ig.game.playerDeath != null) { ig.game.playerDeath.kill(); }
            ig.game.playerDeath = ig.game.spawnEntity(EntityPlayerDeath);
            ig.game.octopus.tentacle2.animatePlayerDeath();
            ig.game.octopus.tentacle2.stop = true;
            this.parent();
        },

        checkCollision: function () {
            if (this.position == 1 && ig.game.octopus.tentacle1.currentAnim.frame == 3 && ig.game.octopus.tentacle1.upperArm == true) {
                this.kill();
            }

            if (this.position == 2 && ig.game.octopus.tentacle1.currentAnim.frame == 4 && ig.game.octopus.tentacle1.lowerArm == true) {
                this.kill();
            }

            if (this.position == 3 && ig.game.octopus.tentacle2.currentAnim.frame == 5) {
                this.kill();
            }

            if (this.position == 4 && ig.game.octopus.tentacle3.currentAnim.frame == 4) {
                this.kill();
            }

            if (this.position == 5 && ig.game.octopus.tentacle4.currentAnim.frame == 3) {
                this.kill();
            }
        },

        animateGotGold: function(){
            // do the gold collected animation.
            this.pos.x = 205;
            this.pos.y = 101;
            this.currentAnim = this.anims.GotGold;
            this.gotGoldTimer = new ig.Timer(1.5);
            this.blip.play();
            this.playGotGoldSound = new ig.Timer(0.5);
        }
    });

})
