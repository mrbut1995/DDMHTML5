define(["entity/entity","view/views"],function(Entity,Views){
    console.log("LOAD ENTITY ITEM")

    var Item = Entity.extend({
        init(id,kind) {
            this._super(id,kind)
        },
        destroy(){

        },
        open(){

        }
    })
    return Item;
})