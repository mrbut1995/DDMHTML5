define(["entity/piece","view/views"],function(Piece){
    var MonsterLord = Piece.extend({
        init(){
            this._super()

            this.view = new Views.MonsterLordView()

            this.lifepoint = 0
        },
        attacked(){

        },
        isAttackedBy(piece){

        },
        addAttacker(piece){

        },
        removeAttacker(piece){
            
        },
        forEachAttacker(callback){

        },

    })
    return MonsterLord;
})