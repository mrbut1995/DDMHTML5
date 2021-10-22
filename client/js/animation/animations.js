define(["animation/animation"],function(Animation){
    var Animations = {
        PositionAnimation : Animation.extend({
            init(target,from,to){
                this._super()
                this.target = target
                this.from   = from
                this.to     = to
            },
            onAnimationStart : function(){
                if(this.target == null)
                    return
                this.target.setPosition(this.from)
            },
            onRunningAnimation:function(delta){
                if(this.target == null)
                    return
                var coord = new Coord(this.from.x,this.from.y);
                coord.x = (this.to.x - this.from.x) * this.percent() + this.from.x
                coord.y = (this.to.y - this.from.y) * this.percent() + this.from.y
                this.target.setPosition(coord)
            },
            onAnimationCompleted: function(){}
        }),
        SpriteAnimation: Animation.extend({

        })
    }
    return Animations
})