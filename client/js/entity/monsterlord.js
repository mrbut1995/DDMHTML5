define(["entity/piece","view/views"],function(Piece){
    var MonsterLord = Piece.extend({
        init(id,name,playerid,kind) {
            //View
            this.view = Views.MonsterLordView
            this.lifepoint = 0
            this._super(id,name,playerid,kind)
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