define(["jquery", "view/baseview","view/boarditemview"], function ($, BaseView,BoardItemView) {
    var Views = {
        LandView: BoardItemView.extend({
            init: function (otps) {
                this._super(otps)
                this.mouseReceived = true
                this.type = "land"

                this.imgSrcNormal = "#F0F0F0",
                this.imgSrcSelect = "rgb(255, 100, 55, 0.5)"
            }
        }),

        TileView: BoardItemView.extend({
            init: function (otps) {
                this._super(otps)

                this.mouseReceived = true
                this.type = "tile"

                this.imgSrcNormal =  "#606060",
                this.imgSrcSelect = "rgb(255, 100, 55, 0.5)"
            }
        }),

        PieceView: BoardItemView.extend({
            init: function (otps) {
                this._super(otps)
                this.mouseReceived = true
                this.type = "piece"

                this.imgSrcNormal =  "red",
                this.imgSrcSelect = "rgb(255, 100, 55, 0.5)"
            }
        }),

    }
    return Views
})