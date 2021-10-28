define(["entity/entity","view/views"],function(Entity,Views){
    console.log("LOAD ENTITY LAND")

    var Land = Entity.extend({
        init(id,kind) {
            this._super(id,kind)
            this.viewtype = Types.Views.LANDVIEW
        },
        destroy(){

        },
        placed(){

        },
        hidden(){

        },
        steppedOn(piece){

        },
        placedOn(piece){

        },
        destroy(){
            
        }
    })
    return Land;
})