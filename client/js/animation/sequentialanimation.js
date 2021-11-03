define(["animation/animation"],function(Animation){
    var SequentialAnimation = Animation.extend({
        init(animations){
            this.animations = animations || {}
            this.current    = null
            this.step       = -1
            this._super()
        },
        //Overloading Function
        start(){
            this.step    =-1
            this.current = null
            this.next()
            this._super()
        },
        update(delta){
            if(this.running()){
                if(this.current == null){
                    this.next()
                }else{
                    if(this.current.running()){
                        this.current.update(delta)
                    }else if(this.current.isCompleted()){
                        this.next()
                    }   
                }
            }
            this._super(delta)
        },
        isCompleted(){
            return this.step == this._keys().length - 1 
            && this.current 
            && this.current.isCompleted()
        },

        //For Sequential Animmation
        next(){
            if(this.hasNextStep()){
                this.step++
                var key = this._keys()[i]
                if(!(this.animations[key] instanceof Animation)){
                    this.current = null
                    this.next()
                }else{
                    this.current = this.animation[key]
                }
            }
        },
        hasNextStep(){
            return this._keys().length - 1 > this.step
        },
        getStep(){
            return this.step
        },
        setAniamation(animations){
            this.animations       = animations
            this.currentAnimation = null
            this.step             = -1
            this.restart()
        },
        _keys(){
            return Object.keys(this.animations)
        }
    })
    return SequentialAnimation
})