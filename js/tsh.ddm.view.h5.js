
let ViewConstants = {
    canvasWidth: 633,
    canvasHeight: 923,

    horMarGrid: 8,
    verMarGrid: 8,

    wCell: 42,
    hCell: 42,

    horPadCell: 6,
    verPadCell: 6,
    verPadCell: 6,
    verPadCell: 6,
    verPadCell: 6,
    verPadCell: 6,

    wTile: 42,
    hTile: 42,

    wLand: 42,
    hLand: 42,

    nCol: 13,
    nRow: 19,
}

var CoordToPoint = function (coord) {
    var x = coord.x
    var y = coord.y
    var col = Math.floor((x - ViewConstants.horMarGrid) / (ViewConstants.wCell + ViewConstants.horPadCell))
    var row = Math.floor((y - ViewConstants.verMarGrid) / (ViewConstants.hCell + ViewConstants.verPadCell))
    return new Point(col, row)
}
var PointToCoord = function (point) {
    var col = point.col
    var row = point.row
    var x = ViewConstants.horMarGrid + (ViewConstants.wCell + ViewConstants.horPadCell) * col
    var y = ViewConstants.verMarGrid + (ViewConstants.hCell + ViewConstants.verPadCell) * row
    return new Coord(x, y)
}

// //Include Module
define(["ddm", "jquery", "view/views","view/boardview"], function (Tsh, $, Views,BoardView) {


    Tsh.Ddm = Tsh.Ddm || {}

    var LandView = Views.LandView
    var PieceView = Views.PieceView
    var TileView  = Views.TileView

    var canvas;
    var context;
    var audio;


    //Board Canvas View
    Tsh.Ddm.View = new function () {


        /////Property
        //Main View
        this.BoardView = new BoardView()
        this.dirty = true

        //Highlight
        this.isHighlight = false
        this.hightlights = []

        //Animation
        this.animations = []

        //Mouse
        this.mouseCoord = null

        //Event 
        this.events = {
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

        }


        this.initAudio = function () {
            if ($("#ddm-audio").length == 0 || !audio) {
                audio = document.createElement("audio");
                audio.id = "ddm-audio";

                $("#board").append(audio)
            }

        }
        this.initDOM = function(){
            DOMBoard     = document.getElementById("board")
            DOMDiceOne   = document.getElementById("dice1")
            DOMDiceTwo   = document.getElementById("dice2")
            DOMDiceThree = document.getElementById("dice3")
            DOMCanvas    = document.getElementById("canvas")
        }
        this.getDOM = function(name){
            return document.getElementById(name)
        }
        this.initCanvas = function () {
            if ($("#ddm-canvas").length == 0 || !canvas || !context) {

                canvas = document.createElement("canvas");
                canvas.id = "ddm-canvas";
                $("#board").append(canvas);

                canvas.width = ViewConstants.canvasWidth;
                canvas.height = ViewConstants.canvasHeight;
                canvas.style.background = "white no-repeat 0 0";

                //Declare Slot
                var onMouseClicked = function (e) {
                    var canvasCoord = getCanvasCoord(e)
                    console.log("clicked", canvasCoord)
                    mouseClickedHandle($.extend({}, canvasCoord))
        
                }
                var onMouseDown = function (e) {
                    //Mouse Press Handle
                    var canvasCoord = getCanvasCoord(e)
                    console.log("press", canvasCoord)
                    mousePressedHandle($.extend({}, canvasCoord))
        
                    //Mouse Press And Hold Handle
                    mouseTimer = setTimeout(function () {
                        console.log("press and hold ", canvasCoord)
                        mousePressedAndHoldHandle($.extend({}, canvasCoord))
                    }, 300)
                }
                var onMouseUp = function (e) {
                    var canvasCoord = getCanvasCoord(e)
                    console.log("released", canvasCoord)
                    mouseReleasedHandle($.extend({}, canvasCoord))
                    clearTimeout(mouseTimer)
                }
                var onMouseMove = function (e) {
                    Tsh.Ddm.View.mouseCoord = e;
                    emitEvent("boardmousemove");
                }
        
                var onViewItemPropertyChanged = function (opts) {
                    var defOpts = {
                        source: null,
                        old_value: "",
                        new_value: ""
                    }
                    opts = $.extend(defOpts, opts.detail)
                    Tsh.Ddm.View.dirty = Tsh.Ddm.View.dirty || true
                    emitEvent(Tsh.Ddm.View.events.itempropertychanged, { source: defOpts })
                }
        
                //Register Event Handler
                canvas.addEventListener("click", onMouseClicked, false);
                canvas.addEventListener("mousedown", onMouseDown, false);
                canvas.addEventListener("mouseup", onMouseUp, false);
                canvas.addEventListener("mousemove", onMouseMove);

                DOMBoard.addEventListener("propertychanged", onViewItemPropertyChanged, false)

                context = canvas.getContext("2d");

            } else {
                console.log("already initCanvas")
            }
        }

        var emitEvent = function (event, detail) {
            var e = new CustomEvent(event, { detail: detail });
            this.DOMBoard.dispatchEvent(e);
        }
        
        this.constructBoardView = function(){
            //TODO:
        }

        this.draw = function () {
            context.clearRect(0, 0, ViewConstants.canvasWidth, ViewConstants.canvasHeight)
            this.BoardView.draw(context,this)
        }

        //Member of class
        var getCanvasCoord = function (e) {
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
        }


        this.update = function (opts) {
            var defOpts = {
                delta: 0
            }
            opts = $.extend(defOpts, opts)
            this.updatingAnimations(opts.delta)
            this.redraw(true)
        }

        this.redraw = function (canvasElement) {
            console.log("redrawing","check if Dirty ",this.dirty)
            if (!canvasElement) {
                this.initCanvas()
                this.initAudio()
            }
            if (!this.dirty)
                return
            this.draw();
            this.dirty = false
        }


        this.createView = function (prototype, opts, item, callback) {
            var view = new prototype(opts)
            view.sendMessage({ msg: 'onCreated' })
            emitEvent(this.events.objectcreated, { source: view, uuid: view.uuid })
            callback(view)
            return view
        }

        this.moveView = function (view, coord) {
            if (view.inArray(this.allViews)) {
                //Move View Coord
                view.move(coord)
            }
            //Request to Redraw
            this.dirty = this.dirty || true
        }
        this.changeViewProperty = function (view, property, value) {
            if (view != null) {
                view.setProperty(property, value)
            }
        }

        //////////////////////////////////////// SPECIFY 
        this.CreatePieceView = function (point, opts, item, callback) {
            var rect = new Rect(PointToCoord(point), ViewConstants.wCell, ViewConstants.hCell)
            var opts = {
                rect: rect,
            }
            var view = this.createView(PieceView, opts, item, callback)
            this.BoardView.addViewChild(view,"piece")
            this.dirty = this.dirty || true
        }
        this.CreateLandView = function (point, opts, item, callback) {
            var rect = new Rect(PointToCoord(point), ViewConstants.wCell, ViewConstants.hCell)
            var opts = {
                rect: rect,
            }
            var view = this.createView(LandView, opts, item, callback)
            this.BoardView.addViewChild(view,"land")

            //Request to Redraw
            this.dirty = this.dirty || true
        }
        this.DestroyView = function (uuid) {
            var view = this.BoardView.view(uuid);

            this.BoardView.removeViewChild(view)

            //Request to Redraw
            this.dirty = this.dirty || true
        }
        this.GetViewProperty = function (uuid, property) {
            var view = this.BoardView.view(uuid);
            if (view != null) {
                return view.property(property)
            }
            return null
        }
        this.SetViewProperty = function (uuid, property, value) {
            var view = this.BoardView.view(uuid);
            if (view != null) {
                this.changeViewProperty(view, property, value)
            }

            //Request to Redraw
            this.dirty = this.dirty || true
        }
        this.MoveView = function (uuid, point) {
            var view = this.BoardView.view(uuid);

            if (view != null) {
                var coord = PointToCoord(point)
                this.moveView(view, coord)
            }

            //Request to Redraw
            this.dirty = this.dirty || true
        }
        this.StartHighlight = function () {
            this.isHighlight = true
            this.ClearHighlight()
            this.dirty = this.dirty || true
        }
        this.StopHighlight = function () {
            this.isHighlight = false
            this.ClearHighlight()
            this.dirty = this.dirty || true
        }
        this.Highlight = function (list) {
            if (!this.isHighlight) {
                console.log("[ERROR]: Not hightlighting")
                return;
            }
            console.log("Start Highlighting")
            this.ClearHighlight()
            //Highlight all the view in new list
            for (var i in list) {
                var p = list[i]
                var coord = PointToCoord(p)
                var views = this.BoardView.viewsAt(coord)//Tsh.Ddm.View.getViewAt(coord)
                console.log("views =>", views)

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

        }
        this.ClearHighlight = function () {
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
        }
        this.GetCanvasMousePoint = function () {
            return CoordToPoint(getCanvasCoord(this.mouseCoord))
        }
        this.GetCanvasMouseCoord = function () {
            return getCanvasCoord(this.mouseCoord)
        }
                //Dice Rolling
        this.DisplayDice = function(interval){
            var dices = document.getElementById("dicesId");
            dices.classList.toggle("show")
            if(interval == undefined || interval == null)
                return
            setTimeout(() => { dices.classList.toggle("show") }, interval)
        }
        this.Roll =  function (dice, result) {
            var DOMObject = undefined
            switch(dice){
                case 0: DOMObject = DOMDiceOne;break
                case 1: DOMObject = DOMDiceTwo;break
                case 2: DOMObject = DOMDiceThree;break
            }
            console.log("result = ", result)
            for (var i = 1; i <= 6; i++) {
                DOMObject.classList.remove('show-' + i);
                if (result === i) {
                    console.log("roll to ", 'show-' + i)
                    DOMObject.classList.add('show-' + i);
                    }
                }
        }
        this.RequestRedraw = function(){
            this.dirty = this.dirty || true
        }
        //////////////////////////////////////// ANIMATION
        this.constructingAnimation = function () {
        }

        this.updatingAnimations = function (delta) {
            var isAnimationAlive = false
            for (var i in this.animations) {
                isAnimationAlive = isAnimationAlive || this.animations[i].isRunning
                this.animations[i].update(delta)
            }
            if (isAnimationAlive) {
                this.dirty = this.dirty || true
            } else {
                this.dirty = this.dirty || false
            }
        }
        //Initializing View
        this.init = function () {
            this.initDOM()

            // this.constructingViewItem()
            this.constructingAnimation()
            this.constructBoardView()
            
            this.redraw()
        }
        //Track Mouse on the board
        var mouseTimer = null

        //Mouse Handle
        var mouseClickedHandle = function (opts) {
            var defOpts = {
                x: 0,
                y: 0
            }
            opts = $.extend(defOpts, opts)

            var views = Tsh.Ddm.View.BoardView.viewsAt(opts)//Tsh.Ddm.View.getViewAt(opts)
            for (var i in views) {
                if (views[i].mouseReceived == false)
                    continue;
                console.log("view = ", views[i].constructor.name)
                views[i].sendMessage({ msg: "onMouseClicked" });
                emitEvent(Tsh.Ddm.View.events.itemclicked, { source: views[i], uuid: views[i].uuid })

                break;
            }

        }
        var mousePressedHandle = function (opts) {
            var defOpts = {
                x: 0,
                y: 0
            }
            opts = $.extend(defOpts, opts)

            var views = Tsh.Ddm.View.BoardView.viewsAt(opts)//Tsh.Ddm.View.getViewAt(opts)
            for (var i in views) {
                if (views[i].mouseReceived == false)
                    continue;
                views[i].sendMessage({ msg: "onMousePressed" });
                emitEvent(Tsh.Ddm.View.events.itempressed, { source: views[i], uuid: views[i].uuid })

                break;
            }
        }
        var mousePressedAndHoldHandle = function (opts) {
            var defOpts = {
                x: 0,
                y: 0
            }
            opts = $.extend(defOpts, opts)

            var views = Tsh.Ddm.View.BoardView.viewsAt(opts)
            for (var i in views) {
                if (views[i].mouseReceived == false)
                    continue;
                views[i].sendMessage({ msg: "onMousePressAndHold" });
                emitEvent(Tsh.Ddm.View.events.itempressandhold, { source: views[i], uuid: views[i].uuid })

                break;
            }
        }
        var mouseReleasedHandle = function (opts) {
            var defOpts = {
                x: 0,
                y: 0
            }
            opts = $.extend(defOpts, opts)
            var views = Tsh.Ddm.View.BoardView.viewsAt(opts)
            for (var i in views) {
                if (views[i].mouseReceived == false)
                    continue;
                views[i].sendMessage({ msg: "onMouseReleased" });
                emitEvent(Tsh.Ddm.View.events.itemreleased, { source: views[i], uuid: views[i].uuid })

                break;
            }
        }
        var mouseDragHandle = function (e) {
            var defOpts = {
                source: null,
                x: 0,
                y: 0,
            }
            opts = $.extend(defOpts, opts)
        }

    }


})


