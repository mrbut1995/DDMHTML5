define(["jquery", "view/boarditemview"], function ($,BoardItemView,cBoardView) {
    console.log("CREATE VIEWS")
    var Views = {
        LandView: BoardItemView.extend({
            init: function (otps) {
                console.log("INIT LandView")
                this._super(otps)
                this.mouseReceived = true
                this.type = "land"

                this.imgSrcNormal = "#F0F0F0",
                this.imgSrcSelect = "rgb(255, 100, 55, 0.5)"
            }
        }),

        TileView: BoardItemView.extend({
            init: function (otps) {
                console.log("INIT TileView")
                this._super(otps)

                this.mouseReceived = true
                this.type = "tile"

                this.imgSrcNormal =  "#606060",
                this.imgSrcSelect = "rgb(255, 100, 55, 0.5)"
            }
        }),

        PieceView: BoardItemView.extend({
            init: function (otps) {
                console.log("INIT PieceView")

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