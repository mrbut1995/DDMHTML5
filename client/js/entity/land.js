define(["entity/entity","view/landview"],function(Entity,LandView){
    console.log("LOAD ENTITY LAND")

    var Land = Entity.extend({
        init(id,kind) {
            //View
            this.view = LandView
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