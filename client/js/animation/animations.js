define(["animation/animation","animation/timeranimation","animation/transitionanimation","animation/sequentialanimation"],function(Animation,TimerAnimation,TransitionAnimation,SequentialAnimation){
    var Animations = {
        PositionAnimation : TransitionAnimation.extend({
            init(target,from,to,interval){
                this.target = target
                this._super(from,to,interval)
            },
            start(from,to,interval){
                this._super(from,to,interval)
                if(this.target == null)
                    return
                this.target.setPosition(this.coordFrom)
                console.log("animation from ",this.from.toString()+" => ",this.to.toString())
            },
            transitioningValue(percent){
                var coord = this.from
                coord.x = (this.to.x - this.from.x) * percent + this.from.x
                coord.y = (this.to.y - this.from.y) * percent + this.from.y
                if(this.target != null){
                    this.target.setPosition(coord)
                }
                return coord;
            },
        }),
        PointMoveAnimation: TransitionAnimation.extend({
            init(target,from,to,interval){
                this.target = target
                this._super(from,to,interval)
            },
            start(from,to,interval){
                this._super(from,to,interval)
                if(this.target == null)
                    return
                this.target.setPosition(this.coordFrom)
                console.log("point     from ",this.from.toString()+" => ",this.to.toString())
                console.log("animation from ",this._coordFrom().toString()+" => ",this._coordTo().toString())
            },
            transitioningValue(percent){
                var coord = this._coordFrom()
                coord.x = (this._coordTo().x - this._coordFrom().x) * percent + this._coordFrom().x
                coord.y = (this._coordTo().y - this._coordFrom().y) * percent + this._coordFrom().y
                if(this.target != null){
                    this.target.setPosition(coord)
                }
                return coord;
            },
            _coordFrom(){
                if(this.target != null){
                    return this.coordFrom = this.target.toCoord(this.from)
                }else{
                    return new Coord(0,0)
                }
            },
            _coordTo(){
                if(this.target != null){
                    return this.coordFrom = this.target.toCoord(this.to)
                }else{
                    return new Coord(0,0)
                }
            },
        }),
        SpriteAnimation: TimerAnimation.extend({
        }),
        AttackAnimation: SequentialAnimation.extend({
            init(orientation){
                this.animations = {}
            }
        })
    }
    return Animations
})