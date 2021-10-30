define(["view/view"],function(View){
    var HighlightView = View.extend({
        init: function(id,config,parent){
            this.type = "highlight"
            this._super(id,config,"highlight",parent)
        },
        drawCellRect(context,col,row,color){
            context.save();
            context.fillStyle = color 
            
            var pCell = new Point(col, row)
            var cCell = this.pointToCoord(pCell)
            var rCell = new Rect(cCell, this.cell.size.width, this.cell.size.height)

            context.fillRect(rCell.x,rCell.y,rCell.w,rCell.h)
            
            context.restore();
        },
        drawTargetCell(){

        },
        drawPathingCells(){

        },
    })
    return HighlightView
})