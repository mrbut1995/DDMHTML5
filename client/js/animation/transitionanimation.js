define(["animation/timeranimation"],function(TimerAnimation){
    var TransitionAnimation = TimerAnimation.extend({
        ///////////////////////////////Overloading
        init(from,to,interval){
            this.from = from
            this.to   = to
            this.val  = this.from
            this._super(interval)
        },
        start(from,to,interval){
            if(from){
                this.from = from
            }
            if(to){
                this.to   = to
            }
            this.val  = this.from
            this._super(interval)
        },
        update(delta){
            if(this.running()){
                this.val = this.transitioningValue(this.percent())
            }
            this._super(delta)
        },
        isCompleted(){
            return this._super()
        },
        setFrom(from){
            this.from = from
        },
        setTo(to){
            this.to = to
        },
        ///////////////////////////////
        transitioningValue(percent){
           return (this.from - this.to) * percent + this.from
        },
    })
    return TransitionAnimation
})