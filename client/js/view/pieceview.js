define(["view/view","animation/animations"],function(View,Animations){
    var PieceView = View.extend({
        init(id,config,layer,parent){
            this._super(id,config,layer,parent)
            this.boardview = null
        },
        setBoard(view){
            this.boardview = view
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
        toCoord(point){
            if(this.board() == null){
                console.log("[ERROR] Not belong to any board")
                return Coord.zero()
            }
            return this.board().coordFrom(point)
        }
    })
    return PieceView
})