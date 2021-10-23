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

                wLand: 42,
                hLand: 42,

                nCol: 13,
                nRow: 19,
            }
            this.layers = {}

            this.layers = $.extend(this.layers,{
                tile:[],
                land:[],
                piece:[]
            })

            this.initViews()
        },
        layersName : function(){
            return Object.keys(this.layers)
        },
        forEachLayer : function(callback){
            var keys = this.layersName()
            for(var i in keys){
                var name = keys[i]
                callback(name,this.layers[name])
            }
        },
        draw: function (context, mainView) {
            context.save()
            this.forEachChild(function(view){
                view.draw(context,this)
            }.bind(this))
            context.restore()
        },
        addViewChild: function (view, layer) {
            this.forEachLayer(function(name,list){
                if(name == layer){
                    console.log("Add to layer ", name," layers = ",this)
                    this.layers[name].push(view)
                }
            }.bind(this))
            view.childOf(this)
        },
        removeViewChild: function (view) {
            if (view.inArray(this.childs)) {

                view.childOf(null)
                //Remove View in Layer List
                this.forEachLayer(function(name,list){
                    view.removeInArray(this.layers[name])
                }.bind(this))    
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
            view.bound.x = coord.x
            view.bound.y = coord.y
        },
        initViews: function () {
            //Create TileView Layer
            for (var i = 0; i < this.constant.nRow; i++) {
                for (var j = 0; j < this.constant.nCol; j++) {
                    var pTile = new Point(j, i)
                    var cTile = this.pointToCoord(pTile)
                    var rTile = new Rect(cTile, this.constant.wCell, this.constant.hCell)
                    var opts = { bound: rTile, }
                    var tileView = new Views.TileView(opts)
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
        },

    })
    return BoardView
})