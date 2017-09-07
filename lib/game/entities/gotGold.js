ig.module('game.entities.gotGold')
.requires('impact.entity')
.defines(function () {
    EntityGotGold = ig.Entity.extend({
        blip: new ig.Sound("media/sounds/blip.*"),
		pointsAdded: 0,
		aniTimerHoldGoldUp: new ig.Timer(0.25),
		aniTimerHoldGoldDown: null,

        update: function (){
        	if (this.aniTimerHoldGoldUp != null && this.aniTimerHoldGoldUp.delta() > 0)
        	{
        		ig.game.player.currentAnim = ig.game.player.anims["HoldGoldUp"];
        		this.blip.play();
        		ig.game.score ++;        		
        		this.aniTimerHoldGoldUp = null;
        		this.aniTimerHoldGoldDown = new ig.Timer(0.25);
        	}
			
			if (this.aniTimerHoldGoldDown != null && this.aniTimerHoldGoldDown.delta() > 0)
			{
				ig.game.player.currentAnim = ig.game.player.anims["0"];
				this.aniTimerHoldGoldDown = null;
				this.aniTimerHoldGoldUp = new ig.Timer(0.25);
				this.pointsAdded ++;
			}

        	if (this.pointsAdded == 3)
        	{
        		ig.game.player.pausePlayer = false;
        		this.kill();
        	}

        	this.parent();
		}
    })
})