define(["ddm", "jquery"], function(Tsh,$){
    Tsh.Ddm.Input = {
        mouse : {
            x:0,
            y:0,
            down:false,
            dragging: false
        },
        inputListener: [],
        pressAndHoldTimer : null,

        init:function(){
            var board = Tsh.Ddm.View.getDOM("board")
            board.addEventListener("click",     this.onmouseclicked.bind(this), false);
            board.addEventListener("mousedown", this.onmousedown.bind(this), false);
            board.addEventListener("mouseup",   this.onmouseup.bind(this), false);
            board.addEventListener("mousemove", this.onmousemove.bind(this), false);
            board.addEventListener("mouseout",  this.onmouseout.bind(this), false);

        },
        
        //Listener
        onmouseclicked:function(ev){
            if(Tsh.Ddm.View != null){
                var canvasCoord = Tsh.Ddm.View.getCanvasCoord(ev)
                Tsh.Ddm.View.mouseClickedCanvasHandle($.extend({}, canvasCoord))
            }
            ev.preventDefault();
        },
        onmousedown:function(ev){
            this.mouse.down = true
            if(Tsh.Ddm.View != null){
                var canvasCoord = Tsh.Ddm.View.getCanvasCoord(ev)
                Tsh.Ddm.View.mousePressedCanvasHandle($.extend({}, canvasCoord))
            }
            this.pressAndHoldTimer = setTimeout((e =>this.onmousepressandhold(ev)).bind(this),300)
            ev.preventDefault();
        },
        onmouseup:function(ev){
            this.mouse.down = false
            this.mouse.dragging = false
            if(Tsh.Ddm.View != null){
                var canvasCoord = Tsh.Ddm.View.getCanvasCoord(ev)
                Tsh.Ddm.View.mouseReleasedCanvasHandle($.extend({}, canvasCoord))
            }

            ev.preventDefault();
        },
        onmousemove:function(ev){
            var offset = Tsh.Ddm.View.getDOM("board").getBoundingClientRect();
            this.mouse.x = ev.clientX - offset.left;
            this.mouse.y = ev.clientY - offset.top;
            if (this.mouse.down) {
                this.mouse.dragging = true;
            }
            
            if(Tsh.Ddm.View != null){
                var canvasCoord = Tsh.Ddm.View.getCanvasCoord(ev)
            }

            ev.preventDefault();
        },
        onmouseout:function(ev){
            if(Tsh.Ddm.View != null){
                var canvasCoord = Tsh.Ddm.View.getCanvasCoord(ev)
            }
            ev.preventDefault();
        },
        onmousepressandhold:function(ev){
            if(Tsh.Ddm.View != null){
                var canvasCoord = Tsh.Ddm.View.getCanvasCoord(ev)
                Tsh.Ddm.View.mousePressedAndHoldCanvasHandle($.extend({}, canvasCoord))
            }
            ev.preventDefault();
        }
    }
})