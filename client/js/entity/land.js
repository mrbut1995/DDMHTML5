define(["entity/piece","view/views"],function(Piece,Views){
    var Land = Piece.extend({
        init(){
            this._super()
            this.views = new Views.LandView()
        },
        destroy(){

        },
        placed(){

        },
        hidden(){

        },
        steppedOn(piece){

        }
    })
    return Land;
})