define(["jquery", "view/view"], function ($, View) {
    var BoardView = View.extend({
        init(id,config,parent) {
            this._super(id,config,"board",parent)

            this.col    = config.col
            this.row    = config.row
            this.cell   = config.cell
            this.margin = config.margin
            this.size   = config.size
            
            this.imgCell = "#606060"
            this.cellColor = "#606060"
            this.type = "board"
        },
        //Drawing
        draw: function (context, mainView) {
            context.save()
            for (var i = 0; i < this.row; i++) {
                for (var j = 0; j < this.col; j++) {
                    this.drawCellRect(context,j,i,this.cellColor)
                }
            }

            context.restore()
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

        pointFrom(coord){
            return this.coordToPoint(coord)
        },
        coordFrom(point){
            return this.pointToCoord(point)
        },
        
        relocatingView: function (view, point) {
            var coord = this.pointFrom(point)
            view.setPosition(coord)
        },
    })
    return BoardView
})