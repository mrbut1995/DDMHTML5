define(["ddm"],function(Tsh){
    var Entity = Class.extend({
        //Property
        
        init(id,kind){
            this.id = id
            this.kind = kind

            this.view = null
            this.animations = []

            this.col = 0
            this.row = 0
            this.point = new Point(0,0)

            this.isLoaded = false
        },
        setGridPosition: function(col,row){
            this.point.col = col
            this.point.row = row
            
            //Translate Col Row position into view
            if(Tsh.Ddm.View != undefined){
                Tsh.Ddm.View.PlaceViewIntoBoard(this.view,this.point)
            }   
        },
        setName : function(name){
            this.name = name;
        },
        setAnimation: function(animations){

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
        ready : function(f){
            this.read_callback = f
        },
    })
    return Entity
})