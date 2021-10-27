define(["entity/entity","view/views"],function(Entity,Views){
    console.log("LOAD ENTITY LAND")

    var Land = Entity.extend({
        init(){
            this._super()
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