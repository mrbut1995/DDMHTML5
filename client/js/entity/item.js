define(["entity/entity","view/itemview"],function(Entity,ItemView){
    console.log("LOAD ENTITY ITEM")

    var Item = Entity.extend({
        init(id,kind) {
            this.view = ItemView
            this._super(id,kind)
        },
        destroy(){

        },
        open(){

        }
    })
    return Item;
})