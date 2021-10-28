define(["view/view"],function(View){
    var PieceView = View.extend({
        init(otps){
            this._super(otps)

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