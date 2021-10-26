
// //Include Module
define(["ddm", "jquery", "view/views","view/boardview","view/viewfactory","view/layer"], function (Tsh, $, Views,BoardView,ViewFactory,Layer) {


    Tsh = Tsh || {}
    Tsh.Ddm = Tsh.Ddm || {}

    var canvas;
    var context;
    var audio;


    //Board Canvas View
    Tsh.Ddm.View =  {
        /////Property
        //Main View
        layers : {},
        views : [],        
        dirty : true,


        //Highlight
        isHighlight : false,
        hightlights : [],

        //Mouse
        mouseCoord : null,

        dom : {
            DOMBoard : null,
            DOMDiceOne : null,
            DOMDiceTwo : null,
            DOMDiceThree : null,
            DOMCanvas : null,
        },

        //Event 


        initAudio  () {
            if ($("#ddm-audio").length == 0 || !audio) {
                audio = document.createElement("audio");
                audio.id = "ddm-audio";

                $("#board").append(audio)
            }

        },
        initDOM (){
            this.dom.DOMBoard     = document.getElementById("board")
            this.dom.DOMDiceOne   = document.getElementById("dice1")
            this.dom.DOMDiceTwo   = document.getElementById("dice2")
            this.dom.DOMDiceThree = document.getElementById("dice3")
            this.dom.DOMCanvas    = document.getElementById("canvas")
        },
        getDOM (name){
            return document.getElementById(name)
        },
        initCanvas  () {
            if ($("#ddm-canvas").length == 0 || !canvas || !context) {

                canvas = document.createElement("canvas");
                canvas.id = "ddm-canvas";
                $("#board").append(canvas);

                canvas.width = 633//this.getBoard().constant.canvasWidth;
                canvas.height = 923//this.getBoard().constant.canvasHeight;
                canvas.style.background = "white no-repeat 0 0";

                context = canvas.getContext("2d");

            } else {
                console.log("already initCanvas")
            }
        },
        
        draw  () {
            console.log("draw")
            context.clearRect(0, 0, canvas.width, canvas.height)
            this.forEachLayer(function(layer){
                layer.draw(canvas)
            }.bind(this))
        },

        //Member of class
        getCanvasCoord  (e) {
            var x, y;

            // Get xy coords on page
            if (e.pageX != undefined && e.pageY != undefined) {
                x = e.pageX;
                y = e.pageY;
            } else {
                x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }

            // Narrow xy coords to canvas
            x -= canvas.offsetLeft;
            y -= canvas.offsetTop;

            return new Coord(x, y);
        },

        update  (opts) {
            var defOpts = {
                delta: 0
            }
            opts = $.extend(defOpts, opts)
            this.redraw(true)
        },
        redraw  (canvasElement) {
            if (!canvasElement) {
                this.initCanvas()
                this.initAudio()
            }
            if (!this.dirty)
                return
            this.draw();
            this.dirty = false
        },
        destroyView(view){
            if(this._onViewDestroyed){
                this._onViewDestroyed(view)
            }
        },
        setDirty(){
            this.dirty = this.dirty || true
        },
        clean(){
            this.dirty = false
        },

        addView(view){
            if(view == null){
                console.log("[ERROR] View == null");
                return;
            }

        },
        removeView(view){

        },
        forEachView(callback){
            this.forEachLayer(function(layer){
                layer.forEachView(callback)
            }.bind(this))
        },
        forEachViewAtLayer(namelayer,callback){
            this.forEachLayer(function(layer){
                if(layer.name == namelayer){
                    layer.forEachView(callback)
                }
            }.bind(this))
        },
        forEachLayer(callback){
            var ids = Object.keys(this.layers)
            for(var i in ids){
                var id = ids[i]
                var layer = this.layers[id]
                callback(layer)
            }
        },
        viewIdExists(id){

        },
        getViewById(id){

        },
        getViewsByClass(c){
            var lst = []
            this.forEachView(function(view){
                if(view instanceof c){
                    lst.push(view)
                }
            }.bind(this))
            return lst;
        },
        registerViewIntoLayer(view,layer){
            if(view == null){
                console.log("[ERROR] view = null");
                return;
            }
            if(layer == "" || layer == null || layer == undefined){
                layer = "common"
                // this.layers.common.push(view)
            }
            if(layer in this.layers){
                this.layers[layer].registerView(view)
            }else{
                console.log("Dont contain layer " + layer+" => create layer")
                this.registerLayer(layer,[view])
            }
            view.layer = layer
        },
        changeViewIntoLayer(view,layer){

        },
        getViewAt(x,y){
            var lst = []
            this.forEachView(function(view){
                if(view.contain(coord)){
                    lst.unshift(view)
                }
            }.bind(this))
            return lst;
        },
        registerLayer(name,views){
            if(name in this.layers){
                console.log("Already contain layer ",name)
            }else{
                var layer = new Layer(name,canvas);
                console.log("regsiter layer ",name," success")
                views = views | []
                for(var i in views){
                    layer.registerView(views[i])
                }
                this.layers[name] = layer
            }
        },
        //////////////////////////////////////// Specify View
        getBoard(){
            this.getViewsByClass(BoardView)[0]
        },

        //////////////////////////////////////// DOM Event
        displayDice(interval){
            var dices = document.getElementById("dicesId");
            dices.classList.toggle("show")
            if(interval == undefined || interval == null)
                return
            setTimeout(() => { dices.classList.toggle("show") }, interval)
        },
        rollDice(index,face){
            var DOMObject = undefined
            switch(dice){
                case 0: DOMObject =  this.dom.DOMDiceOne;break
                case 1: DOMObject =  this.dom.DOMDiceTwo;break
                case 2: DOMObject =  this.dom.DOMDiceThree;break
            }
            console.log("result = ", result)
            for (var i = 1; i <= 6; i++) {
                DOMObject.classList.remove('show-' + i);
                if (result === i) {
                    console.log("roll to ", 'show-' + i)
                    DOMObject.classList.add('show-' + i);
                    }
            }
        },
        //////////////////////////////////////// SPECIFY
        createViewMonster  (point, opts, item, callback) {
            var rect = new Rect(new Coord(0,0), this.getBoard().constant.wCell, this.getBoard().constant.hCell)
            var opts = {
                bound: rect,
            }

            var view = ViewFactory.createView("MonsterView",opts,this.getBoard())
            this.getBoard().relocatingView(view,point)
            this.getBoard().addViewChild(view,"piece")
            if(this._onViewCreated){
                this._onViewCreated(view)
            }
            this.setDirty()
        },
        createViewLand  (point, opts, item, callback) {
            var rect = new Rect(new Coord(0,0), this.getBoard().constant.wCell, this.getBoard().constant.hCell)
            var opts = {
                bound: rect,
            }
            var view = ViewFactory.createView("LandView",opts,this.getBoard())
            this.getBoard().relocatingView(view,point)
            this.getBoard().addViewChild(view,"land")
            if(this._onViewCreated){
                this._onViewCreated(view)
            }
            this.setDirty()
        },
        destroyView  (uuid) {
            var view = this.getBoard().view(uuid);

            this.getBoard().removeViewChild(view)
            this.setDirty()
        },

        //////////////////////////////////////// ANIMATION
        
        init  () {
            console.log("DDM.VIEW.INIT")
            this.initDOM()
            this.initCanvas()
            
            this.initBoard();

            this.redraw()
        },
        initBoard(){
            this.registerLayer("board");
            this.registerLayer("land" );
            this.registerLayer("piece");
            this.registerLayer("common");

            var board =new BoardView();
            this.registerViewIntoLayer(board,"board")
        },
        //Mouse Handle
        mouseClickedCanvasHandle  (opts) {
            console.log("mouseClickedCanvasHandle ",opts)
            this.getBoard().mouseClicked(opts)
        },
         mousePressedCanvasHandle  (opts) {
            console.log("mousePressedCanvasHandle ",opts)
            this.getBoard().mousePressed(opts)
        },
         mousePressedAndHoldCanvasHandle  (opts) {
            console.log("mousePressedAndHoldCanvasHandle ",opts)
            this.getBoard().mousePressAndHold(opts)
        },
         mouseReleasedCanvasHandle  (opts) {
            console.log("mouseReleasedCanvasHandle ",opts)
            this.getBoard().mouseReleased(opts)
        },
         mouseDragCanvasHandle  (opts) {
            this.getBoard().mouseDrag(opts)
        },

        //Signal Slots
        onViewCreated   (callback){this._onViewCreated = callback},
        onViewDestroyed (callback){this._onViewDestroyed = callback},
        onDirty         (callback){this._onDirty = callback},
    }
})


