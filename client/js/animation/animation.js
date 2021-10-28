define(["jquery","ddm-animator"],function($){

        var Animation = Class.extend({
            init(){
                this.isRunning               = false
                this.interval                = 0
                this.time                    = 0
            },
            onAnimationStart : null,
            onAnimationCompleted : null,
            onRunningAnimation : null,

            start : function(){
                this.isRunning = true
                if(isFunction(this.onAnimationCompleted))
                    this.onAnimationStart()
                this.time    = this.interval
            },
            stop   : function(){
                this.isRunning = false
                this.time      = 0
            },
            pause  : function(){
                this.isRunning = false
            },
            complete : function(){
                this.isRunning = false
                this.time      = 0
                if(isFunction(this.onAnimationCompleted))
                    this.onAnimationCompleted()
            },
            resume  : function(){
                this.isRunning = true
            },
            update   : function(delta){
                if(this.isRunning){
                    if(isFunction(this.onRunningAnimation))
                        this.onRunningAnimation(delta)
                    this.time -= delta
                    if(this.time <= 0){
                        this.complete()
                    }
                }
            },
            percent : function(){
                if(!this.isRunning)
                    return 1;
                if(this.interval <= 0)
                    return 0;
                return 1 - (this.time / this.interval)
            }
        })
        
    

    return Animation

})