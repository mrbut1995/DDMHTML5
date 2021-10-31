define(["jquery"],function($){
    var Entity = Class.extend({
        //Property
        init(id,kind){
            var def = {
                id           : id,
                kind         : kind,
                viewprototype: null,
                view         : null,
                isLoaded     : false,
                point        : new Point(0,0),
                animations   : {},
                currentAnimation: null
            }
            
            var otps = $.extend({},def,this)
            $.extend(this,otps)

            this._viewInstance = null,
            this._animationsInstance = {}

            if(Entity._onCreated){
                Entity._onCreated(this)
            }
        },
        animate(){

        },
        setName : function(name){
            this.name = name;
        },
        getView(){
            return this._viewInstance;
        },
        getAnimation(){
            return this._animationsInstance
        },

        setView(view){
            this._viewInstance = view
        },

        constructView(callback){
            this._viewInstance = callback(this.view)
        },
        constructAnimation(callback){
            var keys = Object.keys(this.animations)
            for(var i in keys){
                this._animationsInstance[keys[i]] = callback(this.animations[keys[i]])
            }
        },
        containView(view){
            return view != null && this.getView() != null && view == this.getView()
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
            var keys = Object.keys(this.getAnimation())
            for(var i  in keys){
                callback(this.getAnimation()[keys[i]])
            }
        },
        stopAllAnimation(){
            this.forEachAnimation(function(animation){
                animation.stop()
            })
        },
        getAnimationByName(name){
            var animation = null;
            if(name in this.getAnimation()){
                animation = this.getAnimation()[name];
            }else{
                console.log("No animation called "+name)
            }
            return animation
        },

        setGridPosition: function(col,row){
            this.point.col = col
            this.point.row = row
            if(this.getView() != null){
                this.getView().relocatingToPoint(this.point)
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
    //Construct Proto DAta
    Entity.onCreated = function(callback)           {this._onCreated            = callback}.bind(Entity)
    Entity.onConstructView = function(callback)     {this._onConstructView      = callback}.bind(Entity)
    Entity.onConstructAnimation = function(callback){this._onConstructAnimation = callback}.bind(Entity)
    return Entity
})