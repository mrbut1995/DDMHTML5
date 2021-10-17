
let ViewConstants ={
    canvasWidth : 633,
    canvasHeight : 923,
    
    horMarGrid : 8,
    verMarGrid : 8,
    
    wCell : 42,
    hCell : 42,
    
    horPadCell : 6,
    verPadCell : 6,    
    verPadCell : 6,    
    verPadCell : 6,    
    verPadCell : 6,    
    verPadCell : 6,
    
    wTile :42,
    hTile :42,
    cTile :"#606060",
        
    wLand : 42,
    hLand : 42,
    cLand  :"#F0F0F0",
    cPiece :"red",
    cHighlight:"rgb(255, 100, 55, 0.5)",
        
    nCol : 13,
    nRow  : 19,
          
}

// //Include Module
define(["view/baseview","view/landview","view/pieceview","view/tileview"],function(baseview,landview,pieceview,tileview){


    // var Tsh = Tsh || {}
    Tsh.Ddm = Tsh.Ddm || {}

    var BaseView = baseview
    var LandView = landview
    var PieceView = pieceview
    var TileView = tileview
    
    //Board Canvas View
    Tsh.Ddm.View = new function(){

        var canvas;
        var context;
        var audio;
        
    
        var mainView = this
    
        /////Property
        //Main View
        this.layerViews = []
        this.allViews   = []
        this.dirty     = true
        this.focusedItem = null
        
        //Highlight
        this.isHighlight     = false
        this.hightlights     = []
    
        //Animation
        this.animations = []
    
        //Dragging
        this.draggingItem = null
        this.isDragging   = false
    
        //Mouse
        this.mouseCoord = null
    
        //Event 
        this.events = {
            itemclicked                 : "itemclicked"      ,
            itempressed                 : "itempressed"      ,
            itemreleased                : "itemreleased"     ,
            itempressandhold            : "itempressandhold" ,
            itempropertychanged         : "itempropertychanged"  ,
            itemcreated                 : "itemcreated"    ,
            itemdetroyed                : "itemdetroyed"   ,
            itemfocused                 : "itemfocused"      ,
            itemmove                    : "itemmove"         ,
    
            boardmousemove              : "boardmousemove"  ,
            boardmouseclicked           : "boardmouseclicked",
            
        }
        
        
             this.locatingCell = function (point){
                var  coord = pointToCoord(point)
                return extend({
                    x:0,
                    y:0,
                    width:ViewConstants.wCell,
                    height:ViewConstants.hCell },coord);
            }
        
            //Calculating Board Piece Position
            this.locatingTile = function (point){
                return this.locatingCell(point)
            }
            this.locatingLand = function (point){
                return this.locatingCell(point)
            }
            this. locatingPiece = function (point){
                return this.locatingCell(point)
            }
            this.locatingHighlight = function (point){
                return this.locatingCell(point)
            }
        
        var initAudio = function(){
            if ($("#ddm-audio").length == 0 || !audio) {
                audio = document.createElement("audio");
                audio.id = "ddm-audio";
    
                $("#board").append(audio)
            }
    
        }
        var initCanvas = function(){
            if ($("#ddm-canvas").length == 0 || !canvas || !context) {            
    
                canvas = document.createElement("canvas");
                canvas.id = "ddm-canvas";
                $("#board").append(canvas);
    
                canvas.width = ViewConstants.canvasWidth;
                canvas.height = ViewConstants.canvasHeight;
                canvas.style.background = "white no-repeat 0 0";
                
                //Register Event Handler
                canvas.addEventListener("click", onMouseClicked, false);
                canvas.addEventListener("mousedown", onMouseDown, false);
                canvas.addEventListener("mouseup", onMouseUp, false);
                canvas.addEventListener("mousemove", onMouseMove);
    
                DOMBoard.addEventListener("propertychanged" ,onViewItemPropertyChanged,false)
    
                context = canvas.getContext("2d");
    
            }else{
                console.log("already initCanvas")
            }
    
        }
        
        var emitEvent = function(event,detail){
            var e = new CustomEvent(event,{detail:detail});
            DOMBoard.dispatchEvent(e);
        }
    
        this. constructingViewItem = function(){
            var layerTile = {
                name:'tile',
                list:[]
            }
            var layerLand = {
                name:'land',
                list:[]
            }
            var layerPiece = {
                name:'piece',
                list:[]
            }
    
            this.layerViews.push(layerTile)
            this.layerViews.push(layerLand)
            this.layerViews.push(layerPiece)
    
            for(var i = 0 ; i < ViewConstants.nRow;i++){
                for(var j = 0 ; j < ViewConstants.nCol;j++){
                    var pTile = new Point(j,i)
                    var rTile = new Rect(pointToCoord(pTile),ViewConstants.wCell,ViewConstants.hCell)
                    var opts = {
                        rect:rTile,
                        color:ViewConstants.cTile,
                    }
                    this.createView(TileView,opts,null,v => {mainView.addView(v,"tile")})
                }
            }
        }
        this. drawViewItem = function(){
            for(var i = 0 ; i < this.layerViews.length;i++){
                if(this.layerViews[i] == null || this.layerViews[i].list.length <= 0)
                    continue
                for(var j = 0 ; j < this.layerViews[i].list.length;j++){
                    this.layerViews[i].list[j].draw(context,this)
                }
            }
        }
        this.getViewAt = function(coord){
            var lst = []
            for(var i = 0; i < this.layerViews.length;i++){
                if(this.layerViews[i] == null || this.layerViews[i].length == 0)
                    continue;
                for(var j = 0 ; j < this.layerViews[i].list.length ; j++){
                    if(this.layerViews[i].list[j].contain(coord)){
                        lst.unshift(this.layerViews[i].list[j])
                    }
                }
            }
            return lst;
        }
    
        this. drawBoard = function(opts){
            var defOpts = {
                x: 0,
                y: 0
            }
            opts = $.extend(defOpts,opts)
    
            context.clearRect(0,0,ViewConstants.canvasWidth,ViewConstants.canvasHeight)
            this.drawViewItem()
        }
    
        //Member of class
        var  getCanvasCoord = function (e){
            var x,y;
    
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
        var coordToPoint = function (coord){
            var x = coord.x
            var y = coord.y
            var col = Math.floor((x - ViewConstants.horMarGrid) / (ViewConstants.wCell +ViewConstants. horPadCell))
            var row = Math.floor((y - ViewConstants.verMarGrid) / (ViewConstants.hCell + ViewConstants.verPadCell))
            return new Point(col,row)
        }
        var pointToCoord = function (point){
            var col = point.col
            var row = point.row
            var x = ViewConstants.horMarGrid + (ViewConstants.wCell + ViewConstants.horPadCell) * col
            var y = ViewConstants.verMarGrid + (ViewConstants.hCell + ViewConstants.verPadCell) * row
            return new Coord(x,y)
        }
    
    
        this.update = function(opts){
            var defOpts = {
                delta : 0
            }
            opts = $.extend(defOpts,opts)
            this.updatingAnimations(opts.delta)
            this.redraw(true)
        }
    
        this.redraw = function(canvasElement){
            // console.log("redrawing","check if Dirty ",this.dirty)
            if(!canvasElement){
                initCanvas()
                initAudio()
            }
            if(!this.dirty)
                return
            this.drawBoard();
            this.dirty = false
        }
    
    
        this.createView = function(prototype,opts,item,callback){
            var view = new prototype(opts)
            view.sendMessage({msg:'onCreated'})
            emitEvent(this.events.objectcreated,{source : view,uuid:view.uuid})
            callback(view)
            return view
        }
    
        this.addView   = function(view,layer){
            if(view == null){
                return;
            }
            console.log("add view ",view,"into layer ",layer)
            if(layer == ""){
            }
            for(var i in this.layerViews){
                if(this.layerViews[i].name == layer){
                    console.log("Add to layer ",this.layerViews[i].name)
                    this.layerViews[i].list.push(view)
                    break;
                }
            }
            this.allViews.push(view)
    
            //Request to redraw
            this.dirty = this.dirty || true
        }
        this.destroyView = function(view){
            if(view.inArray(this.allViews)){
                //Remove View in All View List
                view.removeInArray(this.allViews)
    
                //Remove View in Layer List
                for(var i in this.layerViews){
                    view.removeInArray(this.layerViews[i].list)
                }
            }
            view.sendMessage({msg:'onDestroyed'})
            emitEvent(this.events.itemdestroyed,{source : view,uuid:view.uuid})
    
            //Request to Redraw
            this.dirty = this.dirty || true
        }
        this.moveView = function(view,coord){    
            if(view.inArray(this.allViews)){
                //Move View Coord
                view.move(coord)
            }
            //Request to Redraw
            this.dirty = this.dirty || true
        }
        this.changeViewProperty = function(view,property,value){
            if(view != null){
                view.setProperty(property,value)
            }
        }
    
        this.getView     = function(uuid){
            for(var i in this.allViews){
                if(this.allViews[i].uuid == uuid){
                    console.log("FOUND ",uuid," = ",this.allViews[i])
                    return this.allViews[i]
                }
            }
            console.log("CANNOT FOUND ",uuid)
            return null
        }
    
        //////////////////////////////////////// SPECIFY 
        this.CreatePieceView = function(point,opts,item,callback){
            var rect = new Rect(pointToCoord(point),ViewConstants.wCell,ViewConstants.hCell)
            var opts = {
                rect:rect,
                color:ViewConstants.cPiece,
            }
            var view = this.createView(PieceView,opts,item,callback)
            this.addView(view,"piece") 
            this.dirty = this.dirty || true
        }
        this.CreateLandView = function(point,opts,item,callback){
            var rect = new Rect(pointToCoord(point),ViewConstants.wCell,ViewConstants.hCell)
            var opts = {
                rect:rect,
                color:ViewConstants.cLand,
            }
            var view = this.createView(LandView,opts,item,callback)   
            this.addView(view,"land")
    
            //Request to Redraw
            this.dirty = this.dirty || true
        }
        this.DestroyView = function(uuid){
            var view = this.getView(uuid);
            this.destroyView(view)
    
            //Request to Redraw
            this.dirty = this.dirty || true
        }
        this.ForceActiveFocus = function(item){
            if(item != null && item.inArray(this.allViews)){
                if(this.focusedItem != null){
                    this.focusedItem.setProperty("focused",false)
                }
                this.focusedItem = item
    
                if(item != null){
                    item.setProperty("focused",true)
                }
            }
    
            //Request to Redraw
            this.dirty = this.dirty || true
        }
        this.GetViewProperty = function(uuid,property){
            var view = this.getView(uuid);
            if(view != null){
                return view.property(property)
            }
            return null
        }
        this.SetViewProperty = function(uuid,property,value){
            var view = this.getView(uuid);
            if(view != null){
                this.changeViewProperty(view,property,value)
            }
    
            //Request to Redraw
            this.dirty = this.dirty || true
        }
        this.MoveView = function(uuid,point){
            var view = this.getView(uuid);
    
            if(view != null){
                var coord = pointToCoord(point)
                this.moveView(this.getView(uuid),coord)
            }
    
            //Request to Redraw
            this.dirty = this.dirty || true
        }
        this.StartHighlight = function(){
            this.isHighlight     = true
            this.ClearHighlight()
            this.dirty = this.dirty || true
        }
        this.StopHighlight = function(){
            this.isHighlight     = false
            this.ClearHighlight()
            this.dirty = this.dirty || true
        }
    
    
        this.Highlight  = function(list){
            if(!this.isHighlight){
                console.log("[ERROR]: Not hightlighting")
                return;
            }
            console.log("Start Highlighting")
            this.ClearHighlight()
            //Highlight all the view in new list
            for(var i in list){
                var p = list[i]
                var coord = pointToCoord(p)
                var views = mainView.getViewAt(coord)
                console.log("views =>",views)
    
                for(var j in views){
                    var v = views[j]
                    //Highlight the highest item that's not piece
                    if(v.type != "piece"){
                        v.highlight(true)
                        this.hightlights.push(v)
                        break;
                    }
                }
            }
    
            //Request to Redraw
            this.dirty = this.dirty || true
    
        }
        this.ClearHighlight = function(){
            if(this.hightlights.length == 0){
                return;
            }
            for(var i in this.hightlights){
                //Turn of Highlight from current view
                var v = this.hightlights[i]
                v.highlight(false)
            }
            this.hightlights = []
    
            //Request to Redraw
            this.dirty = this.dirty || true
        }
        this.GetCanvasMousePoint = function(){
            return coordToPoint(getCanvasCoord(this.mouseCoord))
        }
        this.GetCanvasMouseCoord = function(){
            return getCanvasCoord(this.mouseCoord)
        }
        //////////////////////////////////////// ANIMATION
        this.constructingAnimation = function(){
        }
    
        this.updatingAnimations = function(delta){
            var isAnimationAlive = false
            for(var i in this.animations){
                isAnimationAlive = isAnimationAlive || this.animations[i].isRunning
                this.animations[i].update(delta)
            }
            if(isAnimationAlive){
                this.dirty = this.dirty || true
            }else{
                this.dirty = this.dirty || false
            }
        }
        //Initializing View
        this.init = function(){
            this.constructingViewItem()
            this.constructingAnimation()
            
            this.redraw()
        }
        //Track Mouse on the board
        var mouseTimer = null
    
        //Mouse Handle
        var mouseClickedHandle = function(opts){
            var defOpts = {
                x: 0,
                y: 0
            }
            opts = $.extend(defOpts,opts)
    
            var views = mainView.getViewAt(opts)
            for(var i in views){
                if(views[i].mouseReceived == false)
                    continue;
                console.log("view = ",views[i].constructor.name)
                views[i].sendMessage({msg:"onMouseClicked"});
                emitEvent(mainView.events.itemclicked,{source : views[i],uuid:views[i].uuid})
    
                break;
            }
    
        }
        var mousePressedHandle = function(opts){
            var defOpts = {
                x: 0,
                y: 0
            }
            opts = $.extend(defOpts,opts)
    
            var views = mainView.getViewAt(opts)
            for(var i in views){
                if(views[i].mouseReceived == false )
                    continue;
                views[i].sendMessage({msg:"onMousePressed"});
                emitEvent(mainView.events.itempressed,{source : views[i],uuid:views[i].uuid})
    
                break;
            }
        }
        var mousePressedAndHoldHandle = function(opts){
            var defOpts = {
                x: 0,
                y: 0
            }
            opts = $.extend(defOpts,opts)
    
            var views = mainView.getViewAt(opts)
            for(var i in views){
                if(views[i].mouseReceived == false)
                    continue;
                views[i].sendMessage({msg:"onMousePressAndHold"});
                emitEvent(mainView.events.itempressandhold,{source : views[i],uuid:views[i].uuid})
    
                break;
            }
        }
        var mouseReleasedHandle = function(opts){ 
            var defOpts = {
                x: 0,
                y: 0
            }
            opts = $.extend(defOpts,opts)
            var views = mainView.getViewAt(opts)
            for(var i in views){
                if(views[i].mouseReceived == false)
                    continue;
                views[i].sendMessage({msg:"onMouseReleased"});
                emitEvent(mainView.events.itemreleased,{source : views[i],uuid:views[i].uuid})
    
                break;
            }
        }
        var mouseDragHandle = function(e){
            var defOpts = {
                source : null,
                x: 0,
                y: 0,
            }
            opts = $.extend(defOpts,opts)
        }
    
        //Slots
        var onLogicUpdated= function(e){}
    
        //Canvas event Listener
        var onMouseClicked = function(e){
            var canvasCoord = getCanvasCoord(e)
            console.log("clicked" ,canvasCoord)
            mouseClickedHandle($.extend({},canvasCoord))
            
        }
        var onMouseDown = function(e){
            //Mouse Press Handle
            var canvasCoord = getCanvasCoord(e)
            console.log("press" ,canvasCoord)
            mousePressedHandle($.extend({},canvasCoord))
    
            //Mouse Press And Hold Handle
            mouseTimer = setTimeout(function(){
                console.log("press and hold ",canvasCoord)
                mousePressedAndHoldHandle($.extend({},canvasCoord))
            },300)
        }
        var onMouseUp = function(e){
            var canvasCoord = getCanvasCoord(e)
            console.log("released" ,canvasCoord)
            mouseReleasedHandle($.extend({},canvasCoord))
            clearTimeout(mouseTimer)
        }
        var onMouseMove = function(e){
            mainView.mouseCoord = e;
            emitEvent("boardmousemove");
        }
    
        var onViewItemPropertyChanged = function(opts){
            var defOpts = {
                source : null,
                old_value : "",
                new_value : ""
            }
            opts = $.extend(defOpts,opts.detail)
            mainView.dirty = mainView.dirty || true
            emitEvent(mainView.events.itempropertychanged,{source:defOpts})
        }
    }
    
    
})


