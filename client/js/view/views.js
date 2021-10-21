define(["jquery", "view/view"], function ($,View) {
    console.log("CREATE VIEWS")
    var Views = {
        LandView: View.extend({
            init: function (otps) {
                this._super(otps)

                this.type = "land"
                this.layer = "land"

                this.imgSrcNormal = "#F0F0F0",
                this.imgSrcSelect = "rgb(255, 100, 55, 0.5)"
            }
        }),

        TileView: View.extend({
            init: function (otps) {
                this._super(otps)
                
                this.type = "tile"
                this.layer = "tile"

                this.imgSrcNormal =  "#606060",
                this.imgSrcSelect = "rgb(255, 100, 55, 0.5)"
            }
        }),

        PieceView: View.extend({
            init: function (otps) {
                this._super(otps)
                this.type = "piece"
                this.layer = "piece"

                this.imgSrcNormal =  "red",
                this.imgSrcSelect = "rgb(255, 100, 55, 0.5)"
            }
        }),
    }
    return Views
})