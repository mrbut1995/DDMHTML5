define(["entity/piece","view/views"],function(Piece){
    var MonsterLord = Piece.extend({
        init(id,kind) {
            this._super(id,kind)

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