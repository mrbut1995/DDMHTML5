define(["jquery"],function($){
    var Entity = Class.extend({
        //Property
        
        init(id,kind){
            this.id = id
            this.kind = kind
            this.viewtype = Types.Views.VIEW
            this.view = null            
            this.isLoaded = false

            this.point = new Point(0,0)

            this.animations         = {}
            this.currentAnimation   = null
        },
        setName : function(name){
            this.name = name;
        },
        getView(){
            return this.view;
        },
        setView(view){
            this.view = view
        },
        containView(view){
            return view != null && this.view != null && view == this.view
        },
        //Animation
        setAnimation: function(name){
            var self = this;
            if(this.isLoaded){
                var a = this.getAnimationByName(name)

                if(this.currentAnimation && this.currentAnimation === a){
                    return;
                }

                if(a){
                    this.currentAnimation = a
                    this.currentAnimation.reset()
                }
            }
        },
        forEachAnimation(callback){
            var keys = Object.keys(this.animations)
            for(var i  in keys){
                callback(this.animations[keys[i]])
            }
        },
        stopAllAnimation(){
            this.forEachAnimation(function(animation){
                animation.stop()
            })
        },
        getAnimationByName(name){
            var animation = null;
            if(name in this.animations){
                animation = this.animations[name];
            }else{
                console.log("No animation called "+name)
            }
            return animation
        },

        setGridPosition: function(col,row){
            this.point.col = col
            this.point.row = row
            if(this.view != null){
                this.view.relocatingToPoint(this.point)
            }
        },
        getDistanceToEntity: function(entity){
            var distX = Math.abs(entity.col - this.col);
            var distY = Math.abs(entity.row - this.row);

            return (distX > distY) ? distX : distY;
        },
        isCloseTo: function(entity){
            var dx, dy, d, close = false;
            if(entity) {
                dx = Math.abs(entity.col - this.col);
                dy = Math.abs(entity.row - this.row);
            
                if(dx < 30 && dy < 14) {
                    close = true;
                }
            }
            return close;
        },
        isAdjacent: function(entity){
            var adjacent = false;
        
            if(entity) {
                adjacent = this.getDistanceToEntity(entity) > 1 ? false : true;
            }
            return adjacent;
        },
        isAdjacentNonDiagonal:function(entity){
            var result = false;

            if(this.isAdjacent(entity) && !(this.col !== entity.col && this.row !== entity.row)) {
                result = true;
            }
        
            return result;
        },
        isDiagonallyAdjacent: function(entity) {
            return this.isAdjacent(entity) && !this.isAdjacentNonDiagonal(entity);
        },
        //Set Callback
        onReady : function(f){
            this._onReady = f
        },
        update(delta){
            //Playing Animation
            this.forEachAnimation(function(animation){
                animation.update(delta)
            }.bind(this))
        },

    })
    return Entity
})