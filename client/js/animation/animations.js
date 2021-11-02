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
                console.log("start animation ,",this.target," this.isRunning ",this.isRunning)
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
        PointMoveAnimation: Animation.extend({
            init(target,from,to){
                this._super()
                this.target = target
                this.from   = from
                this.to     = to 
                if(this.target != null){
                    this.coordFrom = this.target.toCoord(this.from)
                    this.coordTo   = this.target.toCoord(this.to)
                }else{
                    this.coordFrom = new Coord(0,0)
                    this.coordTo   = new Coord(0,0)    
                }
            },
            start(from,to){
                this._super()
                if(this.target == null)
                    return
                if(isPoint(from)){
                    this.from = from
                    this.coordFrom = this.target.toCoord(this.from)
                }
                if(isPoint(to)){
                    this.to   = to
                    this.coordTo   = this.target.toCoord(this.to)
                }
                this.target.setPosition(this.coordFrom)
                console.log("point     from ",this.from.toString()+" => ",this.to.toString())
                console.log("animation from ",this.coordFrom.toString()+" => ",this.coordTo.toString())
            },
            update(delta){
                this._super(delta)
                if(this.isRunning){
                    if(this.target == null)
                        return
                    var coord = new Coord(this.coordFrom.x,this.coordFrom.y);
                    coord.x = (this.coordTo.x - this.coordFrom.x) * this.percent() + this.coordFrom.x
                    coord.y = (this.coordTo.y - this.coordFrom.y) * this.percent() + this.coordFrom.y
                    this.target.setPosition(coord)
                }
            },
            setFrom(from){
                this.from = from;
                if(this.target != null){
                    this.coordFrom = this.target.toCoord(this.from)
                }
                this.restart()
            },
            setTo(to){
                this.to = to;
                if(this.target != null){
                    this.coordTo   = this.target.toCoord(this.to)
                }
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