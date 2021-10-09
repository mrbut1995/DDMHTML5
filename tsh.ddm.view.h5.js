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

var BaseView  = function(opts,item){
    

    var defOpts = {
        rect                        : new Rect(0,0,0,0) ,
        visible                     : true,
        enable                      : true,
        color                       : "#000000",
        highlight                   : false,
        focused                     : false,
        mouseReceived               : false,
        type                        : "view",

        //Message Handle Method
        onMouseClicked              : null ,
        onMousePressed              : null ,
        onMouseReleased             : null ,
        onMousePressAndHold         : null ,
        onUpdate                    : null ,
        onPropertyChanged           : null ,
        onFoucsed                   : null ,

        //Event
        itemClicked                 : new CustomEvent("itemclicked",     {detail:{source:null}}),
        itemPressed                 : new CustomEvent("itempressed",     {detail:{source:null}}),
        itemReleased                : new CustomEvent("itemreleased",    {detail:{source:null}}),
        itemPressAndHold            : new CustomEvent("itempressandhold",{detail:{source:null}}),
        properyChanged              : new CustomEvent("propertychanged"  ,{detail:{source:null}}),
        objectCreated               : new CustomEvent("objectcreated"    ,{detail:{source:null}}),
        objectDetroyed              : new CustomEvent("objectdetroyed"   ,{detail:{source:null}}),
        viewFocused                 : new CustomEvent("viewfocused"      ,{detail:{source:null}}),

    }
    opts = $.extend(defOpts,opts)
    $.extend(true,this,opts)
    
    this.sendMessage = function(opts){
        var defOpts = {
            msg:"unknwon",
        }
        opts = $.extend(defOpts,opts)
        var defParam = {
            source:this
        }
        console.log("msg = ",opts.msg)
        var event = null
        if(opts.msg == "itemclicked"){
            if(isFunction(this.onMouseClicked))          this.onMouseClicked(defParam)
           event = this.itemClicked
        }else  if(opts.msg == "itempressed"){
            if(isFunction(this.onMousePressed))          this.onMousePressed(defParam)
            event =this.itemPressed
        }else  if(opts.msg == "itemreleased"){
            if(isFunction(this.onMouseReleased))         this.onMouseReleased(defParam)
            event =this.itemReleased
        }else  if(opts.msg == "itempressandhold"){
            if(isFunction(this.onMousePressAndHold))     this.onMousePressAndHold(defParam)
            event =this.itemPressAndHold
        }else  if(opts.msg == "propertychanged"){
            if(isFunction(this.onPropertyChanged))       this.onPropertyChanged(defParam)
            event =this.properyChanged
        }else  if(opts.msg == "objectcreated"){
            event =this.objectCreated
        }else  if(opts.msg == "objectdetroyed"){
            event =this.objectDetroyed
        }else  if(opts.msg == "focusing"){
            if(isFunction(this.onFoucsed))                this.onFoucsed(defParam)
            event =this.viewFocused
        }else{
            console.log("CANNOT FIND MESSAGE HANDLE",opts.msg)
        }
        if(event != null){
            event.detail.source = this
            DOMBoard.dispatchEvent(event)
        }
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
        if(isFunction(this.onPropertyChanged))       this.onPropertyChanged(defParam)
        DOMBoard.dispatchEvent(this.properyChanged)
    }
    this.inArray    = function(a){
        for(var i= 0 ; i < a.length;i++){
            if(a[i] == this) 
            return true
        }
        return false
    }
    this.destroy = function(){

    }
    this.toString = function(){
        return this.type + "("+this.rect.x+","+this.rect.y+")"
    }
    this.draw    = null
    this.update  = null
}
var PieceView = function(opts,item){
    //Inheritance from Base View
    opts = $.extend(new BaseView(),opts)
    $.extend(true,this,opts)

    //Initializing Property
    this.mouseReceived       = true
    this.item = item
    this.type = "piece"
    //Implement
    this.draw         = function(context,mainView){
        context.save()
        if(this.focused){
            context.fillStyle = "green"
        }else{
            context.fillStyle = this.color
        }
        let drawingRect = this.rect
        context.fillRect(drawingRect.x,drawingRect.y,drawingRect.w,drawingRect.h)
        context.restore()
    }
}
var LandView = function(opts,item){

    this.item = item

    opts = $.extend(new BaseView(),opts)
    $.extend(true,this,opts)

    this.mouseReceived= true
    this.type = "land"

    this.draw         = function(context,mainView){

        context.save()
        context.fillStyle = this.color
        let drawingRect = this.rect
        context.fillRect(drawingRect.x,drawingRect.y,drawingRect.w,drawingRect.h)
        context.restore()

    }
}
var TileView = function(opts,item){

    this.item = item
    this.type = "piece"

    opts = $.extend(new BaseView(),opts)
    $.extend(true,this,opts)

    this.draw         = function(context,mainView){
        context.save()
        context.fillStyle = this.color
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

//Main View
  Tsh.Ddm.View = new function(){
    var boardHTML;
    var canvas;
    var context;
    var mainView = this
    var frames = 0;
   

    /////Property
    //Main View
    this.layerViews = []
    this.allViews   = []
    this.dirty     = true
    this.focusedItem = null

    //Animation
    this.animations = []

    //Dragging
    this.draggingItem = null
    this.isDragging   = false

    //Event 
    var eMousePiece   = new CustomEvent('mousepiece',);
    var eCreatePiece  = new CustomEvent('createpiece');
    var eDestroyPiece = new CustomEvent('destroypiece');
    var eMovePiece    = new CustomEvent('movepiece');
    
    var eMouseLand   = new CustomEvent("mouseland");
    var eCreateLand  = new CustomEvent('createland');
    var eDestroyLand = new CustomEvent('destroyland');
    var eMoveLand    = new CustomEvent('moveland');

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
        for(var i = 0 ; i < ViewConstants.nRow;i++){
            for(var j = 0 ; j < ViewConstants.nCol;j++){
                var pTile = new Point(j,i)
                var rTile = new Rect(pointToCoord(pTile),ViewConstants.wCell,ViewConstants.hCell)
                var opts = {
                    rect:rTile,
                    color:ViewConstants.cTile,
                }
                var vTile = new TileView(opts,pTile)
                layerTile.list.push(vTile)
                this.allViews.push(vTile)
            }
        }
        for(var i = 0 ; i < ViewConstants.nRow;i++){
            for(var j = 0 ; j < ViewConstants.nCol;j++){
                if(i % 2 == 0 || j % 2 == 0){
                    var pLand = new Point(j,i)
                    var rLand = new Rect(pointToCoord(pLand),ViewConstants.wCell,ViewConstants.hCell)
                    var opts = {
                        rect:rLand,
                        color:ViewConstants.cLand,
                    }    
                    var vLand = new LandView(opts,pLand)
                    layerLand.list.push(vLand)    
                    this.allViews.push(vLand)
                }
            }
        }
        for(var i = 0 ; i < ViewConstants.nRow;i++){
            for(var j = 0 ; j < ViewConstants.nCol;j++){
                if(i % 5 == 0 && j % 5 == 0){
                    var pPiece = new Point(j,i)
                    var rPiece = new Rect(pointToCoord(pPiece),ViewConstants.wCell,ViewConstants.hCell)
                    var opts = {
                        rect:rPiece,
                        color:ViewConstants.cPiece,
                        // onMouseClicked:function(opts){mainView.forceActiveFocus(opts.source)},
                    }    
                    var vPiece = new PieceView(opts,pPiece)
                    layerLand.list.push(vPiece)    
                    this.allViews.push(vPiece)
                }
            }
        }

        this.layerViews.push(layerTile)
        this.layerViews.push(layerLand)
        this.layerViews.push(layerPiece)
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
        console.log("redrawing","check if Dirty ",this.dirty)
        if(!canvasElement){
            initCanvas()
        }
        if(!this.dirty)
            return
        this.drawBoard();
        this.dirty = false
    }


    this.forceActiveFocus = function(item){
        if(item != null && item.inArray(this.allViews)){
            if(this.focusedItem != null){
                this.focusedItem.setProperty("focused",false)
            }
            this.focusedItem = item

            if(item != null){
                item.setProperty("focused",true)
            }
        }
    }

    //////////////////////////////////////// ANIMATION
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
    this.constructingAnimation = function(){
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
            views[i].sendMessage({
                msg:"itemclicked"
            });
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
            views[i].sendMessage({
                msg:"itempressed"
            });
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
            views[i].sendMessage({
                msg:"itempressandhold"
            });
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
            views[i].sendMessage({
                msg:"itemreleased"
            });
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
        // var canvasCoord = getCanvasCoord(e)
    }

    var onViewItemPropertyChanged = function(opts){
        console.log('view property changed')
        var defOpts = {
            source : null,
            old_value : "",
            new_value : ""
        }
        opts = $.extend(defOpts,opts.detail)
        mainView.dirty = mainView.dirty || true
    }
}