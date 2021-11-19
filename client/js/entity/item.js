define(["entity/piece","view/itemview"],function(Piece,ItemView){
    console.log("LOAD ENTITY ITEM")

    var Item = Piece.extend({
        init(id,name,playerid,kind) {
            this.view = ItemView
            this._super(id,name,playerid,kind)
        },
        destroy(){

        },
        open(){

        }
    })
    return Item;
})