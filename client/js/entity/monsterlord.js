define(["entity/piece","view/views"],function(Piece){
    var MonsterLord = Piece.extend({
        init(id,kind) {
            //View
            this.view = new Views.MonsterLordView()
            this.lifepoint = 0
            this._super(id,kind)
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