var Tsh = Tsh || {}
Tsh.Ddm = Tsh.Ddm || {}

var Coord = function(x,y){
    this.x = x;
    this.y = y;
};
var Rect = function(coord,width,height){
    this.w = width
    this.h = height
    this.x = coord.x 
    this.y = coord.y

    this.contain = function(coord){
        return this.x <= coord.x &&  coord.x <= this.x + this.w 
            && this.y <= coord.y &&  coord.y <= this.y + this.h 
    }
}

var BaseView  = function(opts){

    var defOpts = {
        parent                      : null,
        childs                      : [],

        uuid                        : uuid(),
        rect                        : new Rect(0,0,0,0) ,
        color                       : "#000000",
        focused                     : false,
        mouseReceived               : false,
        type                        : "view",

        //Parent Inheritance Value
        visible                     : true,
        enable                      : true,
        isHighlight                 : false,

        //Message Handle Method
        onMouseClicked              : null ,
        onMousePressed              : null ,
        onMouseReleased             : null ,
        onMousePressAndHold         : null ,
        onUpdate                    : null ,
        onPropertyChanged           : null ,
        onFoucsed                   : null ,
        onMove                      : null ,
        onCreated                   : null ,
        onDestroyed                 : null
    }
    opts = $.extend(defOpts,opts)
    $.extend(true,this,opts)

    this.draw    = null
    this.update  = null


    var isParentInheritanceValue = function(name){
        return name == "visible" || name == "enable" || name == "isHighlight";
    } 

    this.childOf   = function(parent){
        if(this.parent != null){
            //Remove item from the current parent's child list
            this.removeInArray(this.parent.childs)
        }
        this.parent = parent

        if(parent == null){
            console.log("Set parent = null => Doint nothing")
        }else{
            console.log("Set parent = ",parent.toString()," => add into parent's child")
            this.parent.childs.push(this)
        }
    }
    this.sendMessage = function(opts){
        var defOpts = {
            msg:"unknwon",
        }
        opts = $.extend(defOpts,opts)
        var defParam = {
            source:this
        }
        var event = null
        console.log("Call ",opts.mgs)
        if(!this.hasOwnProperty(opts.mgs) || !isFunction(this[opts.mgs])){
            console.log("[ERROR] DOES NOT CAONTAIN SLOT METHOD");
            return;
        }
        this[opts.mgs](defParam);
    }
    this.contain      = function(coord){
        return this.rect.contain(coord)
    }
    this.property     = function(name){
        return this[name]
    }
    this.setProperty  = function(name,value){
        if (!this.hasOwnProperty(name)) 
            return false
        console.log("property[",name,"]=(",this[name],"=>",value,")")
        this[name] = value
        if(isParentInheritanceValue(name)){
            //Set Child's property to the same value as parent
            for(var i in this.childs){
                this.childs[i].setProperty(name,value)
            }
        }
        this.sendMessage({msg:"onPropertyChanged"})
    }
    
    this.highlight = function(value){
        this.setProperty("isHighlight",value);
    }

    this.move         = function(coord){
        var r = new Rect(coord,this.rect.w,this.rect.h)
        this.setProperty("rect",r)
        this.sendMessage({msg:"onMove"})
    }
    this.inArray    = function(a){
        for(var i= 0 ; i < a.length;i++){
            if(a[i] == this) 
            return true
        }
        return false
    }
    this.removeInArray = function(a){
        for(var i= 0 ; i < a.length;i++){
            if(a[i] == this){
                console.log("FOUND IN ARRAY i = ",i," => REMOVED")
                a.splice(i,1)
            }
        }
    }
    this.destroy = function(){

    }
    this.toString = function(){
        return this.type+"("+this.uuid+")"
    }
}
var PieceView = function(opts){
    //Inheritance from Base View
    opts = $.extend(new BaseView(),opts)
    $.extend(true,this,opts)

    //Initializing Property
    this.mouseReceived       = true
    this.type = "piece"
    //Implement
    this.draw         = function(context,mainView){
        context.save()
        if(!this.visible){
            context.fillStyle =  "rgba(255, 255, 255, 0.5)";
        }
        else if(this.focused){
            context.fillStyle = "green"
        }else{
            context.fillStyle = this.color
        }
        let drawingRect = this.rect
        context.fillRect(drawingRect.x,drawingRect.y,drawingRect.w,drawingRect.h)
        context.restore()
    }
}
var LandView = function(opts){

    this.mouseReceived= true
    this.type = "land"

    opts = $.extend(new BaseView(),opts)
    $.extend(true,this,opts)

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
var TileView = function(opts){

    this.type = "tile"

    opts = $.extend(new BaseView(),opts)
    $.extend(true,this,opts)

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
var MouseTouchTracker = function(canvas, callback){

    function processEvent(evt) {
      var rect = canvas.getBoundingClientRect();
      var offsetTop = rect.top;
      var offsetLeft = rect.left;
  
      if (evt.touches) {
        return {
          x: evt.touches[0].clientX - offsetLeft,
          y: evt.touches[0].clientY - offsetTop
        }
      } else {
        return {
          x: evt.clientX - offsetLeft,
          y: evt.clientY - offsetTop
        }
      }
    }
  
    function onDown(evt) {
      evt.preventDefault();
      var coords = processEvent(evt);
      callback('down', coords.x, coords.y);
    }
  
    function onUp(evt) {
      evt.preventDefault();
      callback('up');
    }
  
    function onMove(evt) {
      evt.preventDefault();
      var coords = processEvent(evt);
      callback('move', coords.x, coords.y);
    }
    canvas.ontouchmove = onMove;
    canvas.onmousemove = onMove;
  
    canvas.ontouchstart = onDown;
    canvas.onmousedown = onDown;
    canvas.ontouchend = onUp;
    canvas.onmouseup = onUp;
}

//For Animation
var Animation = function(opts){
    this.isRunning               = false
    this.interval                = 0
    this.time                    = 0

    //Slot
    this.onAnimationStart        = null
    this.onAnimationCompleted    = null  
    this.onRunningAnimation      = null

    $.extend(true,this,opts)

    this.start = function(){
        this.isRunning = true
        if(isFunction(this.onAnimationCompleted))
            this.onAnimationStart(this)
        this.time    = this.interval
    }
    this.stop   = function(){
        this.isRunning = false
        this.time      = 0
    }
    this.pause  = function(){
        this.isRunning = false
    }
    this.complete = function(){
        this.isRunning = false
        this.time      = 0
        if(isFunction(this.onAnimationCompleted))
            this.onAnimationCompleted(this)
    }
    this.resume  = function(){
        this.isRunning = true
    }
    this.update   = function(delta){
        if(this.isRunning){
            if(isFunction(this.onRunningAnimation))
                this.onRunningAnimation(this)
            this.time -= delta
            if(this.time <= 0){
                this.complete()
            }
        }
    }
}

let UIView = function(){
    
}

//Board Canvas View
Tsh.Ddm.View = new function(){

    $.extend(true,this,new UIView())

    var canvas;
    var context;
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
    
    var ViewConstants = new function(){
        this.canvasWidth = 633;
        this.canvasHeight = 923

        this. horMarGrid = 8;
        this. verMarGrid = 8;

        this. wCell = 42;
        this. hCell = 42;

        this. horPadCell = 6;
        this. verPadCell = 6;    
        this. verPadCell = 6;    
        this. verPadCell = 6;    
        this. verPadCell = 6;    
        this. verPadCell = 6;

        this. wTile =42
        this. hTile =42
        this. cTile ="#606060"
    
        this. wLand = 42
        this. hLand = 42
        this. cLand  ="#F0F0F0"
        this. cPiece ="red"
        this. cHighlight="rgb(255, 100, 55, 0.5)"
    
        this. nCol = 13
        this. nRow  = 19
      
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
    
    var initCanvas = function(){
        if ($("#ddm-canvas").length == 0 || !canvas || !context) {
            boardHTML = document.getElementById("landColId")
            

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
        console.log("emit event ",event)
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
            console.log("VIEW == NULL")
            return;
        }
        console.log("add view ",view,"into layer ",layer)
        if(layer == ""){
            console.log("Does not addeded into layer")
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

