define(["entity/entity","view/boardview"],function(Entity,BoardView){
    var Board = Entity.extend({
        init(id,kind){
            this._super(id,kind)
        }
    })
    return Board
})