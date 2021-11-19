define(["entity/piece","view/landview"],function(Piece,LandView){
    console.log("LOAD ENTITY LAND")

    var Land = Piece.extend({
        init(id,name,playerid,kind) {
            //View
            this.view = LandView
            this._super(id,name,playerid,kind)
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