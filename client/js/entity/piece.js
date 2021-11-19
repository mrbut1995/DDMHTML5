define(["entity/entity","view/views"],function(Entity){

    var Piece = Entity.extend({
        init(id,name,playerid,kind){
            this._super(id,name,playerid,kind)
        },
        setGridPosition(col,row){
            this._super(col,row)
            if(this.getView() != null){
                this.getView().relocatingToPoint(new Point(col,row))
            }
        }
    })
    return Piece;
})