define(["ddm", "jquery"], function(Tsh,$){
    Tsh.Ddm.Input = {
        mouse : {
            x:0,
            y:0,
            down:false,
            dragging: false
        },
        inputListener: [],

        init:function(){
            var canvas = Tsh.Ddm.View.getDOM("canvas")
        },
        
        //Listener
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