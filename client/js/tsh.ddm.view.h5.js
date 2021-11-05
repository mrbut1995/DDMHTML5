
// //Include Module
define(["ddm", "jquery", "view/views","view/boardview","view/highlightview","view/viewfactory","view/layer","animation/effect","entity/entity","view/landview","view/monsterview"], function 
        (Tsh , $       , Views       ,BoardView       ,HighlightView       ,ViewFactory       ,Layer       ,Effect            ,Entity         ,LandView       ,MonsterView) {


    Tsh = Tsh || {}
    Tsh.Ddm = Tsh.Ddm || {}

    var canvas;
    var context;
    var audio;


    //Board Canvas View
    Tsh.Ddm.View =  {
        

        //Define Pre View Data
        config : {
            canvas:{
                width : 633,
                height: 923
            },
            views:{
                board:{
                    col : 13,
                    row : 19,
                    margin:{
                        horizontal:8,
                        vertical  :8
                    },
                    size: {
                      width:633,
                      height:923,
                    },
                    cell:{
                        margin:{
                          horizontal:0,
                          vertical  :0
                        },
                        size:{
                          width :42,
                          height:42 
                        },
                        padding:{
                          horizontal:6,
                          vertical  : 6
                        }
                    },
                }            
            }
        },        


        init (app) {

            this.foreground = null
            this.background = null
            this.layers = {}
            this.views = {}
            this.entityConnections = {}            
            this.dom  = {}
            this.effects = {}
            this.animation = {}
            this.popup = {}
            this.displaypopup = {}
            this.highlight = {
                land    : [],
                monster : [],
                board   : [],
            }
            this.initDOM()
            this.initCanvas()
            this.initBoard();
            this.redraw()

            this.isHighlight = false
            this.hightlights = []
            this.dirty = false

            this.app = app
            if(this._onInitialized){
                this._onInitialized()
            }
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
                canvas.width = this.config.canvas.width
                canvas.height = this.config.canvas.height
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

        update  (delta) {
            if (!this.dirty)
                return
            this.redraw(true)
            this.dirty = false
        },

        redraw  (canvasElement) {
            if (!canvasElement) {
                this.initCanvas()
                this.initAudio()
            }
            this.draw();
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
            if(this.views[view.id] === undefined){
                this.views[view.id] = view
                this.registerViewIntoLayer(view,view.layer)
            }else{
                console.log("This view already exist")
            }
            this.setDirty()

        },
        removeView(view){
            if(view.id in this.views){
                this.unregisterViewFromLayer(view)
                delete this.views[view.id]
            }
            this.setDirty()
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
        findIfView(callback){

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
            return id in this.views[id]
        },
        getViewById(id){
            if(this.viewIdExists(id)){
                return this.views[id];
            }else{
                return null;
            }
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
            if(layer == undefined || layer == null){
                layer = view.layer
            }
            if(layer == "" || layer == null || layer == undefined){
                layer = "common"
            }
            if(layer in this.layers){
                this.layers[layer].registerView(view)
            }else{
                console.log("Dont contain layer " + layer+" => create layer")
                this.registerLayer(layer,[view])
            }
            view.layer = layer
        },
        registerEntityView(entity){
            if(entity instanceof Entity){
                var view = entity.getView()
                this.addView(entity.getView())
                this.entityConnections[view.id] = entity
            }
        },
        unregisterEntityView(entity){
            if(entity instanceof Entity){
                var view = entity.getView()
                this.removeView(entity.getView())
                delete this.entityConnections[view.id]
            }
        },
        getLayer(layer){
            if(layer in this.layers){
                return this.layers[layer]
            }else{
                return null
            }
        },
        getLayers(){
            return this.layers;
        },
        getGridPointAt(x,y){
            var  mCol =  Math.floor((x - this.config.views.board.margin.horizontal) / (this.config.views.board.cell.size.width  + this.config.views.board.cell.padding.horizontal)),
                 mRow = Math.floor ((y - this.config.views.board.margin.vertical)   / (this.config.views.board.cell.size.height + this.config.views.board.cell.padding.vertical))
            return new Point(mCol,mRow)
        },
        unregisterViewFromLayer(view){
            if(view == null){
                console.log("[ERROR] view = null");
                return;
            }
            var layer = view.layer
            if(layer in this.layers){
                this.layers[layer].unregisterView(view)
            }else{
                console.log("[ERROR] Does not contain layer => Abort")
                return
            }
        },
        getViewAt(x,y){
            var lst = []
            this.forEachView(function(view){
                if(view.contain(new Coord(x,y))){
                    lst.unshift(view)
                }
            }.bind(this))
            return lst;
        },
        requestViewsAt(x,y,callback){
            callback(this.getViewAt(x,y))
        },
        registerLayer(name,views){
            if(name in this.layers){
                console.log("Already contain layer ",name)
            }else{
                var layer = new Layer(name,canvas);
                layer.onDirty(function(){
                    this.setDirty()
                }.bind(this))
                console.log("regsiter layer ",name," success")
                views = views | []
                for(var i in views){
                    layer.registerView(views[i])
                }
                this.layers[name] = layer
            }
            return this.layers[name]
        },

        boardPointFrom(coord){
            if(!this.getBoard()){
                console.log("[ERROR] BOARD IS NOT CONSTRUCTED")
                return new Point(-1,-1)
            }
            return this.getBoard().pointFrom(coord)
        },
        //////////////////////////////////////// Specify View
        getBoard(){
            return this.getViewsByClass(BoardView)[0]
        },
        getHighlightViews(){
            return this.getViewsByClass(BoardView)[0]
        },
        //////////////////////////////////////// Highlight
        /**
         * Highlight list of Land View
         * @param {Land[]} list 
         */
        highlightLandView(list){    
            for(var i in list){
                var landview = list[i]
                if(landview instanceof Views.Land){
                    landview.setHighlight(true)
                }
            }
        },
        /**
         * Highlight list of Monster View
         * @param {Monster[]} list 
         */
        highlightMonsterView(list){
            for(var i in list){
                var monsterview = list[i]
                if(monsterview instanceof Views.Mosnter){
                    monsterview.setHighlight(true)
                }
            }
        },
        /**
         * Highlight list of Cell point in Board View
         * @param {Point[]} list 
         */
        highlightBoard(list){
            if(isFunction(this.getHighlightViews().setHighlight)){
                this.getHighlightViews().highlight(list)
                this.getHighlightViews().setHighlight(true)
            }
        },
        
        /**
         * Highlight all the Flat Cell (Empty Cell / Land) in the list
         * @param {(Point|View)[]} region 
         */
        highlightFlatInList(list){
            if(this.isHighlight){
                for(var i in list){
                    var item = list[i]
                    if(item instanceof Point){

                    }else if(item instanceof View){
                        if(item instanceof LandView){
                            
                        }
                    }
                }
            }
        },

        /**
         * Highlight all the cell and item that can movable (Land/ Monster that can move throguht) in the list
         * @param {(Point|View)[]} region 
         */
        highlightMoveableInList(list){
            if(this.isHighlight){
                for(var i in list){
                    var item = list[i]
                    if(item instanceof Point){

                    }else if(item instanceof View){
                        if(item instanceof LandView){
                            
                        }else if(item instanceof MonsterView){

                        }
                    }
                }
            }

        },
        
        /**
         * Highlight all the cell and Item that cannot move throught (Monster/Item/MonsterLord) in the list
         * @param {(Point|View)[]} region 
         */
        highlightNonMovableInList(list){
            if(this.isHighlight){
                for(var i in list){
                    var item = list[i]
                    if(item instanceof Point){

                    }else if(item instanceof View){
                        
                    }
                }
            }

        },

        /**
         * Highlight all the cell and item that can placed Land (Empty Cell) in the list
         * @param {(Point|View)[]} list 
         */
        highlightPlaceableInList(list){
            if(this.isHighlight){
                for(var i in list){
                    var item = list[i]
                    if(item instanceof Point){

                    }else if(item instanceof View){
                        
                    }
                }
            }
        },

        /**
         * Highlight all the cell and item that is non-placebale (Monster/Land/Item/MonsterLord) in list
         * @param {(Point|View)[]} region 
         */
        highlightNonPlaceableInList(list){
            if(this.isHighlight){
                for(var i in list){
                    var item = list[i]
                    if(item instanceof Point){

                    }else if(item instanceof View){

                    }
                }
            }
        },

        /**
         * Clear All hightlight
         */
        clearAllHighlight(){

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
        generateView(kind,config){
            console.log(this)
            if(isViewKind(kind)){
                return this.generateViewFromKind(kind,config)
            }else if(isViewPrototype(kind)){
                return this.generateViewFromPrototype(kind,config)
            }else{
                console.log("[ERROR] value ",kind," is Not Type that can Create View")
            }
        },
        generateViewFromKind(kind,config){
            var id =  viewid()
            var view = ViewFactory.createView(kind,id,config)
            if(this._onViewCreated){
                this._onViewCreated(view)
            }
            console.log("view = ",view)
            return view
        },
        generateViewFromPrototype(_class,config){
            var id = viewid()
            var view = new _class(id,config)
            if(this._onViewCreated){
                this._onViewCreated(view)
            }
            console.log("view = ",view)
            return view
        },
        destroyView  (id) {
        },

        //////////////////////////////////////// ANIMATION
        
        initBoard(){
            this.registerLayer("board");
            this.registerLayer("land" );
            this.registerLayer("highlight");
            this.registerLayer("piece");
            this.registerLayer("common");

            this.registerViewIntoLayer(new BoardView    ("0000-0000-0000-0000",Tsh.Ddm.View.config.views.board))
            this.registerViewIntoLayer(new HighlightView("0000-0000-0000-0001",Tsh.Ddm.View.config.views.board))
        },
        //Signal Slots
        onViewCreated    (callback)          {this._onViewCreated = callback},
        onViewDestroyed  (callback)          {this._onViewDestroyed = callback},
        onDirty          (callback)          {this._onDirty = callback},
        onInitialized    (callback)          {this._onInitialized = callback},

    }
})


