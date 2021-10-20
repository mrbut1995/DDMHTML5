define(["jquery", "view/baseview", "view/views"], function ($, BaseView, Views) {
    console.log("CREATE BOARD VIEW")
    var BoardView = BaseView.extend({
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
                verPadCell: 6,
                verPadCell: 6,
                verPadCell: 6,
                verPadCell: 6,

                wTile: 42,
                hTile: 42,

                wLand: 42,
                hLand: 42,

                nCol: 13,
                nRow: 19,
            }
            this.layers = []

            var layerTile = { name: 'tile', list: [] }
            var layerLand = { name: 'land', list: [] }
            var layerPiece = { name: 'piece', list: [] }

            this.layers.push(layerTile)
            this.layers.push(layerLand)
            this.layers.push(layerPiece)

            this.initViews()
        },
        draw: function (context, mainView) {
            context.save()
            for (var i = 0; i < this.layers.length; i++) {
                if (this.layers[i] == null || this.layers[i].list.length <= 0)
                    continue
                for (var j = 0; j < this.layers[i].list.length; j++) {
                    console.log("DRAW VIEW")
                    this.layers[i].list[j].draw(context, this)
                }
            }
            context.restore()
        },
        addViewChild: function (view, layer) {
            for (var i in this.layers) {
                if (this.layers[i].name == layer) {
                    console.log("Add to layer ", this.layers[i].name)
                    this.layers[i].list.push(view)
                    break;
                }
            }
            view.childOf(this)
        },
        removeViewChild: function (view) {
            if (view.inArray(this.childs)) {

                view.childOf(null)
                //Remove View in Layer List
                for (var i in this.layers) {
                    view.removeInArray(this.layers[i].list)
                }
            }
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
            view.rect.x = coord.x
            view.rect.y = coord.y
        },
        viewsAt: function (coord) {
            var lst = []
            for (var i = 0; i < this.layers.length; i++) {
                if (this.layers[i] == null || this.layers[i].length == 0)
                    continue;
                for (var j = 0; j < this.layers[i].list.length; j++) {
                    if (this.layers[i].list[j].contain(coord)) {
                        lst.unshift(this.layers[i].list[j])
                    }
                }
            }
            console.log("viewsAt = ",lst)
            return lst;
        },
        initViews: function () {
            //Create TileView Layer
            for (var i = 0; i < this.constant.nRow; i++) {
                for (var j = 0; j < this.constant.nCol; j++) {
                    var pTile = new Point(j, i)
                    var rTile = new Rect(PointToCoord(pTile), ViewConstants.wCell, ViewConstants.hCell)
                    var opts = { rect: rTile, }
                    var tileView = new Views.TileView(opts)
                    console.log("create TileView = ", tileView)
                    this.addViewChild(tileView, "tile")
                }
            }
        },
        view:function(uuid){
            for (var i in this.childs) {
                if (this.childs[i].uuid == uuid) {
                    console.log("FOUND ", uuid, " = ", this.allViews[i])
                    return this.childs[i]
                }
            }
            console.log("CANNOT FOUND ", uuid)
            return null
        }
    })
    return BoardView
})