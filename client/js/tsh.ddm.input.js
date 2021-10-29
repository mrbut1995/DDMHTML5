define(["ddm", "jquery"], function(Tsh,$){
    Tsh = Tsh || {}
    Tsh.Ddm = Tsh.Ddm || {}

    Tsh.Ddm.Input = {

        init:function(app){
            this. mouse = {
                x:0,
                y:0,
                down:false,
                dragging: false,
                col: 0,
                row: 0,
            }
            this.inputListener = []
            this.pressAndHoldTimer = null
            this.app = app
            if(this._onInitialized){
                this._onInitialized()
            }
        },

        registerInputListener($canvas){
            $canvas.addEventListener("click",     this.oncanvasmouseclicked.bind(this),   false);
            $canvas.addEventListener("mousedown", this.oncanvasmousedown.bind(this),      false);
            $canvas.addEventListener("mouseup",   this.oncanvasmouseup.bind(this),        false);
            $canvas.addEventListener("mousemove", this.oncanvasmousemove.bind(this),      false);
            $canvas.addEventListener("mouseout",  this.oncanvasmouseout.bind(this),       false);
        },

        //Listener
        oncanvasmouseclicked:function(ev){
            if(this._onMouseClicked){
                this._onMouseClicked(ev)
            }
            ev.preventDefault();
        },
        oncanvasmousedown:function(ev){
            this.mouse.down = true
            if(this._onMousePressed){
                this._onMousePressed(ev)
            }
            this.pressAndHoldTimer = setTimeout((e =>this.onmousepressandhold(ev)).bind(this),300)
            ev.preventDefault();
        },
        forEachInputListener(callback){
            for(var i in this.inputListener){
                callback(this.inputListener[i])
            }
        },
        oncanvasmouseup:function(ev){
            this.mouse.down = false
            this.mouse.dragging = false

            if(this._onMouseReleased){
                this._onMouseReleased(ev)
            }
            ev.preventDefault();
        },
        oncanvasmousemove:function(ev){
            var coord = this._requestCanvasCoord(ev)
            if(isCoord(coord)){
                this.mouse.x = coord.x
                this.mouse.y = coord.y
            }
            if (this.mouse.down) {
                this.mouse.dragging = true;
            }
            if(this._onMouseMove){
                this._onMouseMove(ev)
            }

            ev.preventDefault();
        },
        oncanvasmouseout:function(ev){
            if(this._onMouseOut){
                this._onMouseOut(ev)
            }
            ev.preventDefault();
        },
        onmousepressandhold:function(ev){
            if(this._onMousePressAndHold){
                this._onMousePressAndHold(ev)
            }
            ev.preventDefault();
        },
        _requestCanvasCoord(e){
            return this.app.View.getCanvasCoord(e)
        },
        _requestGridPosition(x,y){
            return {col:0,row:0}
        },

        onCanvasClicked(callback)     {this._onMouseClicked = callback},
        onCanvasPressed(callback)     {this._onMousePressed = callback},
        onCanvasReleased(callback )   {this._onMouseReleased = callback},
        onCanvasMove(callback)        {this._onMouseMove = callback},
        onCanvasOut(callback)         {this._onMouseOut = callback},
        onCanvasPressAndHold(callback){this._onPressAndHold = callback},
        onInitialized   (callback){this._onInitialized = callback},

    }
})