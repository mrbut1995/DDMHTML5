define(["view/view"],function(View){
    var PieceView = View.extend({
        init(id,layer,parent){
            this._super(id,layer,parent)

            this.boardview = null
            this.iscontrol = false
        },
        setBoard(view){
            this.boardview = view
        },
        board : function(){
            return this.boardview
        },
        relocatingToPoint : function(point){
            if(this.board() == null){
                console.log("[ERROR] Not belong to any board")
                return
            }
            this.board().relocatingView(this,point)
        },
    })
    return PieceView
})