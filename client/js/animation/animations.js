define(["animation/animation","animation/timeranimation","animation/transitionanimation","animation/sequentialanimation","view/view"],function(Animation,TimerAnimation,TransitionAnimation,SequentialAnimation,View){
    var Animations = {
        PositionAnimation : TransitionAnimation.extend({
            init(target,from,to,interval){
                this.target = target
                this._super(from,to,interval)
            },
            start(from,to,interval){
                if(!(this.target instanceof View)){
                    console.log("[ERROR] Does not contain taget")
                    return
                }
                if(!(from instanceof Point) && !(this.from instanceof Point)){
                    from = this.target.getPosition()
                }    
                this._super(from,to,interval)
            },
            reset(){
                this._super()
                this.target.setPosition(this.from)
            },
            transitioningValue(percent){
                var coord = this.val
                coord.x = (this.to.x - this.from.x) * percent + this.from.x
                coord.y = (this.to.y - this.from.y) * percent + this.from.y
                if(this.target != null){
                    this.target.setPosition(coord)
                }
                return coord;
            },
            complete(){
                this.target.setPosition(this.to)
                this._super()
            }
        }),
        PointMoveAnimation: TransitionAnimation.extend({
            init(target,from,to,interval){
                this.target = target
                var _from = this._coord(from)
                var _to   = this._coord(to)
                this._super(_from,_to,interval)
            },
            start(from,to,interval){
                if(this.target == null)
                    return
                var _from = this._coord(from)
                var _to   = this._coord(to)
                this._super(_from,_to,interval)
            },
            reset(){
                this._super()
                this.target.setPosition(this.val)
            },
            transitioningValue(percent){
                var coord = this.val
                coord.x = (this.to.x - this.from.x) * percent + this.from.x
                coord.y = (this.to.y - this.from.y) * percent + this.from.y
                if(this.target != null){
                    this.target.setPosition(coord)
                }
                return coord;
            },
            complete(){
                this.target.setPosition(this.to)
                this._super()
            },
            _coord(coord){
                if(this.target != null){
                    return this.coordFrom = this.target.toCoord(coord)
                }else{
                    return Coord.zero()
                }
            }
        }),
        AttackAnimation: SequentialAnimation.extend({
            init(target){
                this._super({
                    backward: new Animations.PositionAnimation(),
                    forward: new Animations.PositionAnimation(),
                    return: new Animations.PositionAnimation(),
                })
                this.animations.backward.target = target
                this.animations.forward.target = target
                this.animations.return.target = target

                this.animations.backward.setInterval(200)
                this.animations.forward.setInterval(150)
                this.animations.return.setInterval(250)

                this.distantBackward = 10
                this.distantForward = 30
                this.direction = 1

                this.targtet = target
                this.originPosition = null
                
            },
            start(direction){
                if(direction){
                    this.direction = direction
                }
                if(this.isRunning && this.originPosition){
                    this.target.setPosition(this.originPosition)
                }

                var backwardPosition = deepCopy(this.target.getPosition())
                var forwardPosition =  deepCopy(this.target.getPosition())

                switch (this.direction) {
                    case Constants.direction.NORTH:
                        backwardPosition.y += this.distantBackward
                        forwardPosition.y -=  this.distantForward
                        break;
                    case Constants.direction.SOUTH:
                        backwardPosition.y -=  this.distantBackward
                        forwardPosition.y +=  this.distantForward
                        break;
                    case Constants.direction.WEST:
                        backwardPosition.x += this.distantBackward
                        forwardPosition.x -=  this.distantForward
                        break;
                    case Constants.direction.EAST:
                        backwardPosition.x -=  this.distantBackward
                        forwardPosition.x +=  this.distantForward
                        break;
                }

                this.animations.backward.setFrom(this.target.getPosition())
                this.animations.forward.setFrom(undefined)
                this.animations.return.setFrom(undefined)

                this.animations.backward.setTo(backwardPosition)
                this.animations.forward.setTo(forwardPosition)
                this.animations.return.setTo(this.target.getPosition())

                this.originPosition = deepCopy(this.target.getPosition())

                this._super()
            },
            reset(){
                this.target.setPosition(this.originPosition)
                this._super()
            },
            setTarget(target){
                this.target = target
            },
        })
    }
    return Animations
})