define(["jquery", "view/view", "view/views"], function ($, View, Views) {
    console.log("CREATE BOARD VIEW")
    var BoardView = View.extend({
        init: function (opts) {
            this._super(opts)

            this.constant = {
                canvasWidth: 633,
                canvasHeight: 923,

                horMarGrid: 8,
                verMarGrid: 8,

                wCell: 42,
                hCell: 42,

                horPadCell: 6,
                verPadCell: 6,

                wTile: 42,
                hTile: 42,

                nCol: 13,
                nRow: 19,
            }

            this.imgCell = "#606060"

        },
        draw: function (context, mainView) {
            context.save()

            context.fillStyle = this.imgCell 

            for (var i = 0; i < this.constant.nRow; i++) {
                for (var j = 0; j < this.constant.nCol; j++) {

                    var pTile = new Point(j, i)
                    var cTile = this.pointToCoord(pTile)
                    var rTile = new Rect(cTile, this.constant.wCell, this.constant.hCell)

                    context.fillRect(rTile.x,rTile.y,rTile.w,rTile.h)
                }
            }

            context.restore()
        },
        coordToPoint: function (coord) {
            var x = coord.x
            var y = coord.y
            var col = Math.floor((x - this.constant.horMarGrid) / (this.constant.wCell + this.constant.horPadCell))
            var row = Math.floor((y - this.constant.verMarGrid) / (this.constant.hCell + this.constant.verPadCell))
            return new Point(col, row)
        },
        pointToCoord: function (point) {
            var col = point.col
            var row = point.row
            var x = this.constant.horMarGrid + (this.constant.wCell + this.constant.horPadCell) * col
            var y = this.constant.verMarGrid + (this.constant.hCell + this.constant.verPadCell) * row
            return new Coord(x, y)
        },
        relocatingView: function (view, point) {
            var coord = this.pointToCoord(point)
            view.bound.x = coord.x
            view.bound.y = coord.y
        },
        view:function(id){
            for (var i in this.childs) {
                if (this.childs[i].id == id) {
                    console.log("FOUND ", id, " = ", this.allViews[i])
                    return this.childs[i]
                }
            }
            console.log("CANNOT FOUND ", id)
            return null
        },

    })
    return BoardView
})