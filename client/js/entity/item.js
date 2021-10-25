define(["entity/entity","view/views"],function(Entity,Views){
    console.log("LOAD ENTITY ITEM")

    var Item = Entity.extend({
        init(){
            this._super()
            this.views = new Views.LandView()
        },
        destroy(){

        },
        open(){

        }
    })
    return Item;
})