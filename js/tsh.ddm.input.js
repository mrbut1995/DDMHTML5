define(["ddm", "jquery"], function(Tsh,$){
    Tsh.Ddm.Input = {
        mouse : {
            x:0,
            y:0,
            down:false,
            dragging: false
        },
        init:function(){
            var canvas = Tsh.Ddm.View.getDOM("canvas")
            // canvas.addEventListener("click",this.onmouseclicked.bind(this), false);
            // canvas.addEventListener("mousemove",this.onmousemove.bind(this), false);
            // canvas.addEventListener("mousedown",this.onmousedown.bind(this), false);
            // canvas.addEventListener("mouseup",  this.onmouseup.bind(this),  false);
            // canvas.addEventListener("mouseout", this.onmouseout.bind(this), false);
        },
        onmouseclicked:function(ev){

            ev.preventDefault();
        },
        onmousedown:function(ev){
            this.mouse.down = true

            ev.preventDefault();
        },
        onmouseup:function(ev){
            this.mouse.down = false
            this.mouse.dragging = false

            ev.preventDefault();
        },
        onmousemove:function(ev){
            var offset = Tsh.Ddm.View.getDOM("canvas").getBoundingClientRect();

            this.mouse.x = ev.clientX - offset.left;
            this.mouse.y = ev.clientY - offset.top;

            if (mouse.down) {
                this.mouse.dragging = true;
            }

            ev.preventDefault();
        },
        onmouseout:function(ev){
            ev.preventDefault();
        }
    }
})