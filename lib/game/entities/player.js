ig.module('game.entities.player')
.requires('impact.entity')
.defines(function () {
    EntityPlayer = ig.Entity.extend({
        animSheet : new ig.AnimationSheet("media/sprites/playerSprite.png", 88, 69),
        position : 0,
        buttonPressed : false,
        goldInBag : 0,
        collectingGoldPosition : 0,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.B,
        blip: new ig.Sound("media/sounds/blip.*"),

        init: function (x, y, settings) {
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
            this.addAnim('GotGold', 0.1, [2]);

            this.parent();
        },

        update: function () {
            if (this.position > 5) this.position = 5;

            switch (this.position) {
                case 0:
                    this.pos.x = 130;
                    this.pos.y = 60;
                    break;
                case 1:
                    this.pos.x = 130;
                    this.pos.y = 100;
                    break;
                case 2:
                    this.pos.x = 170;
                    this.pos.y = 170;
                    break;
                case 3:
                    this.pos.x = 250;
                    this.pos.y = 240;
                    break;
                case 4:
                    this.pos.x = 320;
                    this.pos.y = 240;
                    break;
                case 5: case 6: case 7: case 8:
                    this.pos.x = 420;
                    this.pos.y = 240;
                    break;
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
                        ig.game.score += this.goldInBag;
                        this.goldInBag = 0;
                        // start 8 second timer.
                        this.inWaterTimer = new ig.Timer(8);
                        // do the gold collected animation.
                        this.currentAnim = this.anims.GotGold;
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
            ig.game.spawnEntity(EntityPlayerDeath, this.pos.x, this.pos.y - 24);
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
        }
    });

})
