
// //Include Module
define(["ddm", "jquery", "view/views","view/boardview"], function (Tsh, $, Views,BoardView) {


    Tsh = Tsh || {}
    Tsh.Ddm = Tsh.Ddm || {}

    var LandView = Views.LandView
    var PieceView = Views.MonsterView

    var canvas;
    var context;
    var audio;


    //Board Canvas View
    Tsh.Ddm.View =  {


        /////Property
        //Main View
        views : {
            board : new BoardView()
        },
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

                canvas.width = this.views.board.constant.canvasWidth;
                canvas.height = this.views.board.constant.canvasHeight;
                canvas.style.background = "white no-repeat 0 0";

                context = canvas.getContext("2d");

            } else {
                console.log("already initCanvas")
            }
        },
        
        draw  () {
            console.log("draw")
            context.clearRect(0, 0, this.views.board.constant.canvasWidth, this.views.board.constant.canvasHeight)
            this.views.board.draw(context,this)
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
        createView  (prototype, opts, item) {
            var view = new prototype(opts)
            this.emitEvent(this.events.objectcreated, { source: view, uuid: view.uuid })
            if(this._onViewCreated){
                this._onViewCreated(view)
            }
            return view
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

        PlaceViewIntoBoard (view,point){
            console.log("PlaceViewIntoBoard")
            this.views.board.relocatingView(view,point)
        },

        CreatePieceView  (point, opts, item, callback) {
            var rect = new Rect(new Coord(0,0), this.views.board.constant.wCell, this.views.board.constant.hCell)
            var opts = {
                bound: rect,
            }
            var view = this.createView(PieceView, opts, item, callback)
            this.views.board.relocatingView(view,point)
            this.views.board.addViewChild(view,"piece")
            this.setDirty()
        },
        CreateLandView  (point, opts, item, callback) {
            var rect = new Rect(new Coord(0,0), this.views.board.constant.wCell, this.views.board.constant.hCell)
            var opts = {
                bound: rect,
            }
            var view = this.createView(LandView, opts, item, callback)
            this.views.board.relocatingView(view,point)
            this.views.board.addViewChild(view,"land")
            this.setDirty()
        },
        DestroyView  (uuid) {
            var view = this.views.board.view(uuid);

            this.views.board.removeViewChild(view)
            this.setDirty()
        },
        GetCanvasMousePoint  () {
            return this.board.CoordToPoint(this.getCanvasCoord(this.mouseCoord))
        },
        GetCanvasMouseCoord  () {
            return this.getCanvasCoord(this.mouseCoord)
        },
        //////////////////////////////////////// ANIMATION
        
        init  () {
            console.log("DDM.VIEW.INIT")
            this.initDOM()
            this.initCanvas()
            
            this.redraw()
        },

        //Mouse Handle
        mouseClickedCanvasHandle  (opts) {
            console.log("mouseClickedCanvasHandle ",opts)
            Tsh.Ddm.View.views.board.mouseClicked(opts)
        },
         mousePressedCanvasHandle  (opts) {
            console.log("mousePressedCanvasHandle ",opts)
            Tsh.Ddm.View.views.board.mousePressed(opts)
        },
         mousePressedAndHoldCanvasHandle  (opts) {
            console.log("mousePressedAndHoldCanvasHandle ",opts)
            Tsh.Ddm.View.views.board.mousePressAndHold(opts)
        },
         mouseReleasedCanvasHandle  (opts) {
            console.log("mouseReleasedCanvasHandle ",opts)
            Tsh.Ddm.View.views.board.mouseReleased(opts)
        },
         mouseDragCanvasHandle  (opts) {
            Tsh.Ddm.View.views.board.mouseDrag(opts)
        },

        //Signal Slots
        onViewCreated   (callback){this._onViewCreated = callback},
        onViewDestroyed (callback){this._onViewDestroyed = callback},
        onDirty         (callback){this._onDirty = callback},
    }
})


