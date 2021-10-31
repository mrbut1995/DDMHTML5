define(["entity/entity","view/views"],function(Entity,Views){
    console.log("LOAD ENTITY LAND")

    var Land = Entity.extend({
        init(id,kind) {
            //View
            this.view = Views.LandView
            this._super(id,kind)
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