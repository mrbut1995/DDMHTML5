define(["jquery","ddm"],function($,Tsh){
    var Entity = Class.extend({
        //Property
        
        init(id,kind){
            this.id = id
            this.kind = kind
            this.animations = []
            this.view = null

            this.isLoaded = false

            this.point = new Point(0,0)
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
        setAnimation: function(animations){
            var self = this
        },
        animate:function(name,opts,onEndCallback){
            let defOpts = {
                speed : 0,
                count : 0,
            }
            opts = $.extend(defOpts,opts)
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

    })
    return Entity
})