define(["entity/entity","view/views"],function(Entity,Views){
    console.log("LOAD ENTITY ITEM")

    var Item = Entity.extend({
        init(id,kind) {
            this.views = new Views.LandView()

            this._super(id,kind)
        },
        destroy(){

        },
        open(){

        }
    })
    return Item;
})