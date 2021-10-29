define(["jquery", "view/pieceview",], function ($,PieceView) {
    var Views = {
        LandView: PieceView.extend({
            init: function (id,parent) {
                this._super(id,"land",parent)

                this.type = "land"
                this.bound.w = 43
                this.bound.h = 43

                this.imgSrcNormal = "#F0F0F0",
                this.imgSrcSelect = "rgb(255, 100, 55, 0.5)"
            },
            draw(context,mainView){
                context.save()
                let drawingRect = this.bound
                var style;
                context.fillStyle = this.imgSrcNormal
                context.fillRect(drawingRect.x, drawingRect.y , drawingRect.w , drawingRect.h )
                context.restore()
            }    
        }),


        MonsterView: PieceView.extend({
            init: function (id,parent) {
                this._super(id,"piece",parent)
                this.type = "monster"
                this.bound.w = 43
                this.bound.h = 43

                this.imgSrcNormal =  "red",
                this.imgSrcSelect = "rgb(255, 100, 55, 0.5)"
            },
            draw(context,mainView){
                context.save()
                let drawingRect = this.bound
                var style;
                if(!this.enable){
                    style = this.imgSrcDisable
                }else if(!this.visible){
                    style = this.imgSrcHidden
                }else if (this.highlight) {
                    style = this.imgSrcSelect
                } else {
                    style = this.imgSrcNormal
                }
                context.fillStyle = this.imgSrcNormal
                if(this.iscontrol){
                    context.strokeStyle = "red"
                }else{
                    context.strokeStyle = "red"
                }
                context.strokeRect(drawingRect.x,drawingRect.y,drawingRect.w,drawingRect.h)
                
                context.fillRect(drawingRect.x + 5, drawingRect.y +5 , drawingRect.w - 10, drawingRect.h - 10)
                context.restore()
            }    
        }),

        MonsterLordView: PieceView.extend({
            init: function (id,parent) {
                this._super(id,"piece",parent)
                this.type = "monsterlord"
                this.bound.w = 43
                this.bound.h = 43

                this.imgSrcNormal =  "green",
                this.imgSrcSelect = "rgb(255, 100, 55, 0.5)"
            },
            draw(context,mainView){
                context.save()
                let drawingRect = this.bound
                var style;
                context.fillStyle = this.imgSrcNormal
                if(this.iscontrol){
                    context.strokeStyle = "red"
                }else{
                    context.strokeStyle = "red"
                }
                context.strokeRect(drawingRect.x,drawingRect.y,drawingRect.w,drawingRect.h)
                
                context.fillRect(drawingRect.x + 5, drawingRect.y +5 , drawingRect.w - 10, drawingRect.h - 10)
                context.restore()
            }    
        }),

    }
    return Views
})