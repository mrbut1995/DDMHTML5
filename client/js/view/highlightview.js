define(["view/view"],function(View){
    var HighlightView = View.extend({
        init: function(id,config,parent){
            this.type = "highlight"
            this._super(id,config,"highlight",parent)
            this.list = []
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
        coordToPoint: function (coord) {
            var x = coord.x
            var y = coord.y
            var col = Math.floor((x - this.margin.horizontal) / (this.cell.size.width + this.cell.padding.horizontal))
            var row = Math.floor((y - this.margin.vertical)   / (this.cell.size.height + this.cell.padding.vertical))
            return new Point(col, row)
        },
        pointToCoord: function (point) {
            var col = point.col
            var row = point.row
            var x = this.margin.horizontal + (this.cell.size.width + this.cell.padding.horizontal) * col
            var y = this.margin.vertical + (this.cell.size.height + this.cell.padding.vertical) * row
            return new Coord(x, y)
        },
        draw(context){
            context.save()
            context.restore()
        },
        clearHighlight(){
            this.list = []
            this.dirty()
        },
        highlight(lst){
            this.list = lst
            this.dirty()
        },
    })
    return HighlightView
})