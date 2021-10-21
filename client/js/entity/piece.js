define(["entity/entity","view/views"],function(Entity){
    var Piece = Entity.extend({
        init(){
            this._super()

            this.view = new Views.PieceView()
        },
        
    })
    return Piece;
})