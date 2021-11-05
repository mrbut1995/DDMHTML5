define(["jquery", "view/pieceview","animation/animations","view/landview","view/monsterview"], function ($,PieceView,Animations,LandView,MonsterView) {
    var Views = {

        MonsterLordView: MonsterView.extend({
            init(id,config,parent) {
                this._super(id,config,"piece",parent)

                this.type = "monsterlord"
                this.size = new Size(43,43)

                this.imgSrcNormal =  "green",
                this.imgSrcSelect = "rgb(255, 100, 55, 0.5)"
                
            },
            draw(context,mainView){
                context.save()
                let drawingRect = this.getBound()
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