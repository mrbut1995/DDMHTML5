define(["jquery", "view/pieceview"], function ($,PieceView) {
    console.log("CREATE VIEWS")
    var Views = {
        LandView: PieceView.extend({
            init: function (otps) {
                this._super(otps)

                this.type = "land"
                this.layer = "land"

                this.imgSrcNormal = "#F0F0F0",
                this.imgSrcSelect = "rgb(255, 100, 55, 0.5)"
            }
        }),


        MonsterView: PieceView.extend({
            init: function (otps) {
                this._super(otps)
                this.type = "piece"
                this.layer = "piece"

                this.imgSrcNormal =  "red",
                this.imgSrcSelect = "rgb(255, 100, 55, 0.5)"
            }
        }),

        MonsterLordView: PieceView.extend({
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