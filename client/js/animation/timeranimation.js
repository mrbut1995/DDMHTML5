define(["animation/animation"],function(Animation){
    var TimerAnimation = Animation.extend({
        init(interval){
            this.interval = 0 || interval
            this.time  = 0
            this._super()
        },
        start(interval){
            if(interval){
                this.interval = interval
            }
            this.time = this.interval
            this._super()
        },
        reset(){
            this.time = this.interval
        },
        update(delta){
            if(this.running()){
                this.time -= delta
            }
            this._super(delta)
        },
        isCompleted(){
            return this.time <= 0
        },
        complete(){
            this.time = 0
            this._super()
        },
        percent(){
            if(!this.running())
                return 1;
            if(this.interval <= 0)
                return 0;
            return 1 - (this.time / this.interval)
        },
        setInterval(val){
            this.interval = val
        }
    })
    return TimerAnimation
})