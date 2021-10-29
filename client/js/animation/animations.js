define(["animation/animation"],function(Animation){
    var Animations = {
        PositionAnimation : Animation.extend({
            init(target,from,to){
                this._super()
                this.target = target
                this.from   = from
                this.to     = to
            },
            start(from,to){
                this._super()
                if(this.target == null)
                    return
                if(isCoord(from))
                    this.from = from
                if(isCoord(to))
                    this.to   = to
                this.target.setPosition(this.from)
            },
            update(delta){
                this._super(delta)
                if(this.isRunning){
                    if(this.target == null)
                        return
                    var coord = new Coord(this.from.x,this.from.y);
                    coord.x = (this.to.x - this.from.x) * this.percent() + this.from.x
                    coord.y = (this.to.y - this.from.y) * this.percent() + this.from.y
                    this.target.setPosition(coord)
                }
            },
            setFrom(from){
                this.from = from;
                this.restart()
            },
            setTo(to){
                this.to = to;
                this.restart()
            }
        }),
        TransitionAnimation: Animation.extend({
        }),
        NumberAnimation: Animation.extend({
            init(from,to){
                this._super()
                this.from = from | 0
                this.to   = to   | 0
                this.current  = this.from
            },
            start(from,to){
                if(isNumber(from))
                    this.from = from
                if(isNumber(to))
                    this.to   = to
                this._super()
            },
            update(delta){
                if(this.isRunning){
                    this.current = (this.to - this.from) * this.percent()
                }
                this._super(delta)
            }
        }),
        SpriteAnimation: Animation.extend({
        })
    }
    return Animations
})