define(["view/view"],function(View){
    var PieceView = View.extend({
        init(id,config,layer,parent){
            this._super(id,config,layer,parent)
            this.boardview = null
        },
        setBoard(view){
            this.boardview = view
            console.log("setted board = ",this.board())
        },
        board(){
            return this.boardview
        },
        relocatingToPoint(point){
            if(this.board() == null){
                console.log("[ERROR] Not belong to any board")
                return
            }
            this.board().relocatingView(this,point)
        },
    })
    return PieceView
})