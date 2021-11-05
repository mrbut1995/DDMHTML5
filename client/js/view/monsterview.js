define(["view/pieceview","animation/animations"],function(PieceView,Animations){
    var MonsterView = PieceView.extend({
        init(id,config,parent) {
            this._super(id,config,"piece",parent)

            this.type = "monster"
            this.size = new Size(43,43)

            this.imgSrcNormal =  "red",
            this.imgSrcSelect = "rgb(255, 100, 55, 0.5)"

            this.animations = {
                move  : new Animations.PointMoveAnimation(),
                attack: new Animations.PointMoveAnimation()
            }
            this.movingAnimation = 100

        },
        draw(context,mainView){
            context.save()
            let drawingRect = this.getBound()
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
        },
        moveAnimation(from,to,onStart,onRunning,onCompleted){
            var move = this.animations.move
            if(move){
                this.animations.move.target = this
                this.animations.move.onAnimationStart       (onStart)
                this.animations.move.onAnimationCompleted   (onCompleted)
                this.animations.move.onRunningAnimation     (onRunning)
                this.animations.move.start                  (from,to,this.movingAnimation)    
            }
        },
        attackAnimation(orientation,onStart,onRunning,onCompleted){
            if(this.animations.attack){
                
            }
        }
    })
    return MonsterView
})