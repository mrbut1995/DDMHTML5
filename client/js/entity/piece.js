define(["entity/entity","view/views"],function(Entity){
    var Piece = Entity.extend({
        init(){
            this._super()

            this.view = null

            this.point = new Point(0,0)
        },
        setGridPosition: function(col,row){
            this.point.col = col
            this.point.row = row
            if(this.view != null){
                this.view.relocatingToPoint(this.point)
            }
        },
        getDistanceToEntity: function(piece){
            var distX = Math.abs(piece.col - this.col);
            var distY = Math.abs(piece.row - this.row);

            return (distX > distY) ? distX : distY;
        },
        isCloseTo: function(piece){
            var dx, dy, d, close = false;
            if(piece) {
                dx = Math.abs(piece.col - this.col);
                dy = Math.abs(piece.row - this.row);
            
                if(dx < 30 && dy < 14) {
                    close = true;
                }
            }
            return close;
        },
        isAdjacent: function(piece){
            var adjacent = false;
        
            if(piece) {
                adjacent = this.getDistanceToEntity(piece) > 1 ? false : true;
            }
            return adjacent;
        },
        isAdjacentNonDiagonal:function(piece){
            var result = false;

            if(this.isAdjacent(piece) && !(this.col !== piece.col && this.row !== piece.row)) {
                result = true;
            }
        
            return result;
        },
        isDiagonallyAdjacent: function(piece) {
            return this.isAdjacent(piece) && !this.isAdjacentNonDiagonal(piece);
        },

    })
    return Piece;
})