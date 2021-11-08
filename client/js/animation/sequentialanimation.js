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
            this._super()
        },
        reset(){
            this.step    =-1
            this.current = null
            this._super()
        },
        update(delta){
            if(this.running()){
                if(this.current == null){
                    this.next()
                    this.current.start()
                }else{
                    if(this.current.running()){
                        console.log("updating ",this._keys()[this.step])
                        this.current.update(delta)
                    }else if(this.current.isCompleted()){
                        console.log("updating ",this._keys()[this.step])
                        this.next()
                        this.current.start()
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
                var key = this._keys()[this.step]
                console.log("next = ",this._keys()[this.step])
                if(!(this.animations[key] instanceof Animation)){
                    this.current = null
                    this.next()
                }else{
                    this.current = this.animations[key]
                    console.log("play ",this._keys()[this.step]," = ",this.current)
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