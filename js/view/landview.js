define(["jquery","view/baseview"],function($,base){
    var prototype = function(opts){
        base.call(this,opts)

        this.mouseReceived= true
        this.type = "land"
        
        this.draw         = function(context,mainView){
    
            context.save()
            if(this.isHighlight){
                context.fillStyle = "rgb(255, 100, 55, 0.5)"
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