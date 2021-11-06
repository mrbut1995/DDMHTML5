define(["view/pieceview"],function(PieceView){
    var ItemView = PieceView.extend({
        init(id,config,parent) {
            this._super(id,config,"piece",parent)

            this.type = "item"
            this.size = new Size(43,43)

            this.imgSrcNormal = "#F0F0F0",
            this.imgSrcSelect = "rgb(255, 100, 55, 0.5)"
        },
        draw(context,mainView){
            context.save()
            let drawingRect = this.getBound()
            var style;
            context.fillStyle = this.imgSrcNormal
            context.fillRect(drawingRect.x, drawingRect.y , drawingRect.w , drawingRect.h )
            context.restore()
        }    
    })
    return ItemView
})