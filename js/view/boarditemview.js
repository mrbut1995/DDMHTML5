define(["jquery", "view/baseview"], function ($, BaseView) {
    var BoardItemView = BaseView.extend({
        init:function(opts){
            console.log("INIT BoardItemView")
            this._super(opts)

            this.imgSrcNormal  = ""
            this.imgSrcHidden  = ""
            this.imgSrcSelect  = ""
            this.imgSrcDisable = ""

            this.col           = 0
            this.row           = 0
        },
        draw: function (context, mainView) {
            context.save()
            if(!this.enable){
                context.fillStyle = this.imgSrcDisable
            }else if(!this.visible){
                context.fillStyle = this.imgSrcHidden
            }else if (this.isHighlight) {
                context.fillStyle = this.imgSrcSelect
            } else {
                context.fillStyle = this.imgSrcNormal
            }
            let drawingRect = this.rect
            context.fillRect(drawingRect.x, drawingRect.y, drawingRect.w, drawingRect.h)
            context.restore()
        }
    })
    return BoardItemView;
})