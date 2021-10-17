define(["jquery","view/baseview"],function($,base){
    var prototype = function(opts){
        base.call(this,opts)

        this.mouseReceived       = true
        this.type = "piece"

        //Implement
        this.draw         = function(context,mainView){
            context.save()
            if(!this.visible){
                context.fillStyle =  "rgba(255, 255, 255, 0.5)";
            }
            else if(this.focused){
                context.fillStyle = "green"
            }else{
                context.fillStyle = this.color
            }
            let drawingRect = this.rect
            context.fillRect(drawingRect.x,drawingRect.y,drawingRect.w,drawingRect.h)
            context.restore()
        }
        
    }
    prototype.prototype = Object.create(base.prototype);
    prototype.prototype.constructor = prototype;

    return prototype
})