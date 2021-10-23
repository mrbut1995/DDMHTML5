
// //Include Module
define(["ddm", "jquery", "view/views","view/boardview"], function (Tsh, $, Views,BoardView) {


    Tsh.Ddm = Tsh.Ddm || {}

    var LandView = Views.LandView
    var PieceView = Views.MonsterView
    var TileView  = Views.TileView

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
        events : {
            itemclicked: "itemclicked",
            itempressed: "itempressed",
            itemreleased: "itemreleased",
            itempressandhold: "itempressandhold",
            itempropertychanged: "itempropertychanged",
            itemcreated: "itemcreated",
            itemdetroyed: "itemdetroyed",
            itemfocused: "itemfocused",
            itemmove: "itemmove",
            boardmousemove: "boardmousemove",
            boardmouseclicked: "boardmouseclicked",
        },


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

        emitEvent  (event, detail) {
            var e = new CustomEvent(event, { detail: detail });
            Tsh.Ddm.View.dom.DOMBoard.dispatchEvent(e);
        },
        
        draw  () {
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
        createView  (prototype, opts, item, callback) {
            var view = new prototype(opts)
            view.sendMessage({ msg: 'onCreated' })
            this.emitEvent(this.events.objectcreated, { source: view, uuid: view.uuid })
            callback(view)
            return view
        },
        moveView  (view, coord) {
            if (view.inArray(this.allViews)) {
                //Move View Coord
                view.move(coord)
            }
            //Request to Redraw
            this.dirty = this.dirty || true
        },
        changeViewProperty  (view, property, value) {
            if (view != null) {
                view.setProperty(property, value)
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
            this.dirty = this.dirty || true
        },
        CreateLandView  (point, opts, item, callback) {
            var rect = new Rect(new Coord(0,0), this.views.board.constant.wCell, this.views.board.constant.hCell)
            var opts = {
                bound: rect,
            }
            var view = this.createView(LandView, opts, item, callback)
            this.views.board.relocatingView(view,point)
            this.views.board.addViewChild(view,"land")

            //Request to Redraw
            this.dirty = this.dirty || true
        },
        DestroyView  (uuid) {
            var view = this.views.board.view(uuid);

            this.views.board.removeViewChild(view)

            //Request to Redraw
            this.dirty = this.dirty || true
        },
        GetViewProperty  (uuid, property) {
            var view = this.views.board.view(uuid);
            if (view != null) {
                return view.property(property)
            }
            return null
        },
        SetViewProperty  (uuid, property, value) {
            var view = this.views.board.view(uuid);
            if (view != null) {
                this.changeViewProperty(view, property, value)
            }

            //Request to Redraw
            this.dirty = this.dirty || true
        },
        MoveView  (uuid, point) {
            var view = this.views.board.view(uuid);

            if (view != null) {
                var coord = this.views.board.pointToCoord(point) 
                this.moveView(view, coord)
            }

            //Request to Redraw
            this.dirty = this.dirty || true
        },
        StartHighlight  () {
            this.isHighlight = true
            this.ClearHighlight()
            this.dirty = this.dirty || true
        },
        StopHighlight  () {
            this.isHighlight = false
            this.ClearHighlight()
            this.dirty = this.dirty || true
        },
        Highlight  (list) {
            if (!this.isHighlight) {
                console.log("[ERROR]: Not hightlighting")
                return;
            }
            this.ClearHighlight()
            //Highlight all the view in new list
            for (var i in list) {
                var p = list[i]
                var coord =this.views.board.pointToCoord(p) 
                var views = this.views.board.viewsAt(coord)//Tsh.Ddm.View.getViewAt(coord)

                for (var j in views) {
                    var v = views[j]
                    //Highlight the highest item that's not piece
                    if (v.type != "piece") {
                        v.highlight(true)
                        this.hightlights.push(v)
                        break;
                    }
                }
            }

            //Request to Redraw
            this.dirty = this.dirty || true

        },
        ClearHighlight  () {
            if (this.hightlights.length == 0) {
                return;
            }
            for (var i in this.hightlights) {
                //Turn of Highlight from current view
                var v = this.hightlights[i]
                v.highlight(false)
            }
            this.hightlights = []

            //Request to Redraw
            this.dirty = this.dirty || true
        },
        GetCanvasMousePoint  () {
            return this.board.CoordToPoint(this.getCanvasCoord(this.mouseCoord))
        },
        GetCanvasMouseCoord  () {
            return this.getCanvasCoord(this.mouseCoord)
        },
                //Dice Rolling
        DisplayDice (interval){
            var dices = document.getElementById("dicesId");
            dices.classList.toggle("show")
            if(interval == undefined || interval == null)
                return
            setTimeout(() => { dices.classList.toggle("show") }, interval)
        },
        Roll (dice, result) {
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
        RequestRedraw (){
            this.dirty = this.dirty || true
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
    }
})


