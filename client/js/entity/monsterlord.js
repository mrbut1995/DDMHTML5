define(["entity/piece","view/views"],function(Piece){
    var MonsterLord = Piece.extend({
        init(){
            this._super()

            this.view = new Views.MonsterLordView()

            this.lifepoint = 0
            
        },
    })
    return MonsterLord;
})