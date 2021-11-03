define(["ddm","entity/entity"],function(Tsh,Entity){
    Tsh.Ddm = Tsh.Ddm || {}
    Tsh.Ddm.Animator = {
        init(app){
            this.animations = []
            this.effects    = []
            this.app = app
            if(this._onInitialized){
                this._onInitialized()
            }
        },
        update(delta){
            this.forEachAnimation(function(animation){
                animation.update(delta)
            }.bind(this))
        },
        generateAnimation(prototype){
            if(isAnimationPrototype(prototype)){
                return this.generateAnimationFromPrototype(prototype)
            }else{
                console.log(prototype,"Is not Animation Prototype")
                return null;
            }
        },
        generateAnimationFromPrototype(prototype){
            var animation = new prototype()
            this.addAnimations(animation);
            if(this._onAnimationCreated)
                this._onAnimationCreated(animation)
            return animation
        },
        addAnimations(animation){
            if(!this.containAnimation(animation)){
                this.animations.push(animation)
                if(this._onAddAnimation)
                    this._onAddAnimation(animation)
            }else{

            }
        },
        removeAnimation(animation){
            if(this.containAnimation(animation)){
                if(this._onRemoveAnimation)
                    this._onRemoveAnimation(animation)
                for(var i in this.animations){
                    if(this.animations == animation){
                        this.animations.splice(i,1)
                    }
                }
            }else{

            }
        },
        containAnimation(animation){
            var result = false;
            this.forEachAnimation(function(a){
                if(animation == a){
                    console.log("Contain animation ",animation)
                    result = result || true
                }
            }.bind(this))
            return result
        },
        forEachAnimation(callback){
            for(var i in this.animations){
                callback(this.animations[i])
            }
        },
        stopAllAnimation(){
            forEachAnimation(function(animation){

            }.bind())
        },
        registerAnimator(entity){
            if(entity instanceof Entity){
                entity.forEachAnimation(function(animation){
                    this.addAnimations(animation)
                }.bind(this))
            }
        },
        unregisterAnimator(entity){
            if(entity instanceof Entity){
                entity.forEachAnimation(function(animation){
                    this.removeAnimation(animation)
                }.bind(this))
            }
        },
        onInitialized(callback){this._onInitialized = callback},
        onAddAnimation(callback){this._onAddAnimation = callback},
        onRemoveAnimation(callback){this._onRemoveAnimation = callback},
        onAnimationCreated(callback){this._onAnimationCreated = callback},
        onAnimationDestroyed(callback){this._onAnimationDestroyed = callback}
    }
})