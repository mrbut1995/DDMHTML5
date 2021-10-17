define(["jquery"],function($){
    var prototype = function(opts){
        this.isRunning               = false
        this.interval                = 0
        this.time                    = 0
    
        //Slot
        this.onAnimationStart        = null
        this.onAnimationCompleted    = null  
        this.onRunningAnimation      = null
    
        $.extend(true,this,opts)
    
        this.start = function(){
            this.isRunning = true
            if(isFunction(this.onAnimationCompleted))
                this.onAnimationStart(this)
            this.time    = this.interval
        }
        this.stop   = function(){
            this.isRunning = false
            this.time      = 0
        }
        this.pause  = function(){
            this.isRunning = false
        }
        this.complete = function(){
            this.isRunning = false
            this.time      = 0
            if(isFunction(this.onAnimationCompleted))
                this.onAnimationCompleted(this)
        }
        this.resume  = function(){
            this.isRunning = true
        }
        this.update   = function(delta){
            if(this.isRunning){
                if(isFunction(this.onRunningAnimation))
                    this.onRunningAnimation(this)
                this.time -= delta
                if(this.time <= 0){
                    this.complete()
                }
            }
        }            
    }

    return prototype

})