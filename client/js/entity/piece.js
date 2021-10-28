define(["entity/entity","view/views"],function(Entity){
    var Piece = Entity.extend({
        init(id,kind){
            this._super(id,kind)
        },
    })
    return Piece;
})