define(["jquery"],function($){
    Entity = Class.extend(
    {
        /**
         * @constructs
         * @param {number} id 
         * @param {string} kind 
         */
        init(id,name,playerid,kind){
            var def = {
                id                  : id,
                name                : name,
                view                : null,
                isLoaded            : false,
                point               : new Point(0,0),
                animations          : {},
                solid               : true,
                currentAnimation    : null,
                controllerid        : playerid,
                kind                : kind,
                controlable         : false
            }
            console.log("create entity ",id," - ",name," - ",playerid," - ",kind)
            var otps = $.extend({},def,this)
            $.extend(this,otps)

            this._viewInstance = null

            if(Entity._onCreated){
                Entity._onCreated(this)
            }
        },

        /**
         * @decontructor
         */
        destroy(){
            if(this.getView() != null){
                this.getView().destroy()
                this.setView(null)
            }
            if(!this.getAnimations()){
                this.forEachAnimation(function(animation){ animation.destroy()})
                this.setAnimations({})
            }
            this.currentAnimation = null
        },
        setName : function(name){
            this.name = name;
        },
        getView(){
            return this._viewInstance;
        },
        setControllable(value){
            this.controlable = value
        },
        getControllable(){
            return this.controlable
        },
        setView(view){
            this._viewInstance = view
        },
        getSolid(){
            return this.solid
        },
        setSolid(value){
            if(this.solid != value){
                this.solid = value;
                if(this._onSolidChanged){
                    this._onSolidChanged()
                }
            }
        },
        getControllerId(){
            return this.controllerid;
        },
        setControllerId(id){
            if(this.controllerid != id){
                this.controllerid = id;
                if(this._onControllerIdChanged){
                    this._onControllerIdChanged()
                }
            }
        },
        getAnimations(){
            return this.animations
        },
        setAnimations(animations){
            this.animations = animations
        },

        forEachAnimation(callback){
            var keys = Object.keys(this.getAnimations())
            for(var i  in keys){
                callback(this.getAnimations()[keys[i]])
            }
        },
        forView(callback){
            callback(this.getView())
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
                    this.currentAnimation.restart()
                }
            }
        },
        stopAllAnimation(){
            this.forEachAnimation(function(animation){
                animation.stop()
            })
        },
        getAnimationByName(name){
            var animation = null;
            if(name in this.getAnimations()){
                animation = this.getAnimations()[name];
            }else{
                console.log("No animation called "+name)
            }
            return animation
        },
        getGridPosition(){
            return this.point
        },
        setGridPosition: function(col,row){
            this.point.col = col
            this.point.row = row
            if(this._onGridPositionChanged){
                this._onGridPositionChanged()
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

        },

        /**
         * Signal
         */
        onSolidChanged          (callback){this._onSolidChanged         = callback},
        onControllerIdChanged   (callback){this._onControllerIdChanged  = callback},
        onGridPositionChanged   (callback){this._onGridPositionChanged  = callback}
    })
    //Construct Proto DAta
    Entity.onCreated = function(callback)           {this._onCreated            = callback}.bind(Entity)
    return Entity
})