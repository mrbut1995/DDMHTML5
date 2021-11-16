// //Include Module
define(["ddm", "jquery", "view/views", "view/boardview", "view/highlightview", "view/viewfactory", "view/layer", "animation/effect", "entity/entity", "view/landview", "view/monsterview", "view/itemview"], function
    (Tsh, $, Views, BoardView, HighlightView, ViewFactory, Layer, Effect, Entity, LandView, MonsterView, ItemView) {


    Tsh = Tsh || {}
    Tsh.Ddm = Tsh.Ddm || {}

    var canvas;
    var context;
    var audio;


    //Board Canvas View
    Tsh.Ddm.View = {


        //Define Pre View Data
        config: {
            canvas: {
                width: 633,
                height: 923
            },
            views: {
                board: {
                    col: 13,
                    row: 19,
                    margin: {
                        horizontal: 8,
                        vertical: 8
                    },
                    size: {
                        width: 633,
                        height: 923,
                    },
                    cell: {
                        margin: {
                            horizontal: 0,
                            vertical: 0
                        },
                        size: {
                            width: 42,
                            height: 42
                        },
                        padding: {
                            horizontal: 6,
                            vertical: 6
                        }
                    },
                }
            }
        },


        init(app) {

            this.foreground = null
            this.background = null
            this.layers = {}
            this.views = {}
            this.entityOf = {}
            this.dom = null
            this.effects = {}
            this.animation = {}
            this.popup = {}
            this.displaypopup = {}
            this.highlight = {
                land: [],
                monster: [],
                monsterlord: [],
                item: [],
                board: [],
            }
            this.initDOM()
            this.initCanvas()
            this.initBoard();
            this.redraw()

            this.dirty = false

            this.app = app
            if (this._onInitialized) {
                this._onInitialized()
            }
        },

        initAudio() {
            if ($("#ddm-audio").length == 0 || !audio) {
                audio = document.createElement("audio");
                audio.id = "ddm-audio";

                $("#board").append(audio)
            }

        },
        initDOM() {
            // $('#btnRoll').click(this.displayDicePool.bind(this))
        },
        getDOMItems(update) {
            if (!this.dom || update) {
                this.dom = this.dom || {}

                this.dom.jquery = this.dom.jquery || {}
                this.dom.jquery.board = $("#board")
                this.dom.jquery.canvas = $("#ddm-canvas")

                this.dom.jquery.audio = $("#ddm-audio")

                this.dom.jquery.btnPlayer = this.dom.jquery.btnPlayer || {}
                this.dom.jquery.btnPlayer.controller = $(".player-btns-container")
                this.dom.jquery.btnPlayer.btnroll = $('#btnRoll')
                this.dom.jquery.btnPlayer.btnendphase = $('#btnEndPhase')
                this.dom.jquery.btnPlayer.btnstorage = $('#btnStorage')
                this.dom.jquery.btnPlayer.btninformation = $('#btnInformation')

                this.dom.jquery.dices = this.dom.jquery.dices || {}
                this.dom.jquery.dices.controller = $(".controller.roll.dices")
                this.dom.jquery.dices.one = $(".dice.dice-one")
                this.dom.jquery.dices.two = $(".dice.dice-two")
                this.dom.jquery.dices.three = $(".dice.dice-three")

                this.dom.jquery.popup = this.dom.jquery.popup || {}
                this.dom.jquery.popup.outside = $(".popup-controller .outside")
                this.dom.jquery.popup.closebtn = $(".popup-controller .closebtn")

                this.dom.jquery.popup.pool = this.dom.jquery.popup.pool || {}
                this.dom.jquery.popup.pool.controller = $(".popup-controller .popup-grid")
                this.dom.jquery.popup.pool.items = $(".popup-controller .popup-grid .item-grid")
                this.dom.jquery.popup.pool.btnRoll = $(".popup-controller   #btnRollSelected")
                this.dom.jquery.popup.pool.btnCancel = $(".popup-controller   #btnCancelSelected")

                this.dom.jquery.summoning       = this.dom.jquery.summoning || {}
                this.dom.jquery.summoning.cubes = this.dom.jquery.summoning.cubes || {}
                this.dom.jquery.summoning.cubes.one   = $(".controller.summonning.selection .cube.one")
                this.dom.jquery.summoning.cubes.two   = $(".controller.summonning.selection .cube.two")
                this.dom.jquery.summoning.cubes.three = $(".controller.summonning.selection .cube.three")

                this.dom.element = this.dom.element || {}
                this.dom.element.board = document.getElementById("board")
                this.dom.element.canvas = document.getElementById("ddm-canvas")

                this.dom.element.dices = this.dom.element.dices || {}
                this.dom.element.dices.one = document.getElementById("dice1")
                this.dom.element.dices.two = document.getElementById("dice2")
                this.dom.element.dices.three = document.getElementById("dice3")
            }
            return this.dom.jquery
        },
        initCanvas() {
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

        draw() {
            context.clearRect(0, 0, canvas.width, canvas.height)
            this.forEachLayer(function (layer) {
                layer.draw(canvas)
            }.bind(this))
        },

        //Member of class
        getCanvasCoord(e) {
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

        update(delta) {
            if (!this.dirty)
                return
            this.redraw(true)
            this.dirty = false
        },

        redraw(canvasElement) {
            if (!canvasElement) {
                this.initCanvas()
                this.initAudio()
            }
            this.draw();
        },
        setDirty() {
            this.dirty = this.dirty || true
        },
        clean() {
            this.dirty = false
        },

        addView(view) {
            if (view == null) {
                console.log("[ERROR] View == null");
                return;
            }
            if (this.views[view.id] === undefined) {
                this.views[view.id] = view
                this.entityOf[view.id] = null
                this.registerViewIntoLayer(view, view.layer)
            } else {
                console.log("[ERROR]This view already exist")
            }
            this.setDirty()

        },
        removeView(view) {
            if (view.id in this.views) {
                this.unregisterViewFromLayer(view)
                delete this.views[view.id]
                delete this.entityOf[view.id]
            }
            this.setDirty()
        },
        forEachView(callback) {
            this.forEachLayer(function (layer) {
                layer.forEachView(callback)
            }.bind(this))
        },
        forEachViewAtLayer(namelayer, callback) {
            this.forEachLayer(function (layer) {
                if (layer.name == namelayer) {
                    layer.forEachView(callback)
                }
            }.bind(this))
        },
        findIfView(callback) {

        },
        forEachLayer(callback) {
            var ids = Object.keys(this.layers)
            for (var i in ids) {
                var id = ids[i]
                var layer = this.layers[id]
                callback(layer)
            }
        },
        viewIdExists(id) {
            return id in this.views[id]
        },
        getViewById(id) {
            if (this.viewIdExists(id)) {
                return this.views[id];
            } else {
                return null;
            }
        },
        getViewsByClass(c) {
            var lst = []
            this.forEachView(function (view) {
                if (view instanceof c) {
                    lst.push(view)
                }
            }.bind(this))
            return lst;
        },
        registerViewIntoLayer(view, layer) {
            if (view == null) {
                console.log("[ERROR] view = null");
                return;
            }
            if (layer == undefined || layer == null) {
                layer = view.layer
            }
            if (layer == "" || layer == null || layer == undefined) {
                layer = "common"
            }
            if (layer in this.layers) {
                this.layers[layer].registerView(view)
            } else {
                console.log("Dont contain layer " + layer + " => create layer")
                this.registerLayer(layer, [view])
            }
            view.layer = layer
        },
        registerEntityView(entity) {
            if (entity instanceof Entity) {
                var view = entity.getView()
                this.addView(entity.getView())
                this.entityOf[view.id] = entity
            }
        },
        unregisterEntityView(entity) {
            if (entity instanceof Entity) {
                var view = entity.getView()
                this.removeView(entity.getView())
            }
        },
        getLayer(layer) {
            if (layer in this.layers) {
                return this.layers[layer]
            } else {
                return null
            }
        },
        getLayers() {
            return this.layers;
        },
        getGridPointAt(x, y) {
            var mCol = Math.floor((x - this.config.views.board.margin.horizontal) / (this.config.views.board.cell.size.width + this.config.views.board.cell.padding.horizontal)),
                mRow = Math.floor((y - this.config.views.board.margin.vertical) / (this.config.views.board.cell.size.height + this.config.views.board.cell.padding.vertical))
            return new Point(mCol, mRow)
        },
        unregisterViewFromLayer(view) {
            if (view == null) {
                console.log("[ERROR] view = null");
                return;
            }
            var layer = view.layer
            if (layer in this.layers) {
                this.layers[layer].unregisterView(view)
            } else {
                console.log("[ERROR] Does not contain layer => Abort")
                return
            }
        },
        getViewAt(x, y) {
            var lst = []
            this.forEachView(function (view) {
                if (view.contain(new Coord(x, y))) {
                    lst.unshift(view)
                }
            }.bind(this))
            return lst;
        },
        requestViewsAt(x, y, callback) {
            callback(this.getViewAt(x, y))
        },
        registerLayer(name, views) {
            if (name in this.layers) {
                console.log("[ERROR]Already contain layer ", name)
            } else {
                var layer = new Layer(name, canvas);
                layer.onDirty(function () {
                    this.setDirty()
                }.bind(this))
                views = views | []
                for (var i in views) {
                    layer.registerView(views[i])
                }
                this.layers[name] = layer
            }
            return this.layers[name]
        },

        boardPointFrom(coord) {
            if (!this.getBoard()) {
                console.log("[ERROR] BOARD IS NOT CONSTRUCTED")
                return new Point(-1, -1)
            }
            return this.getBoard().pointFrom(coord)
        },
        destroyView(view) {
            if (this._onViewDestroyed) {
                this._onViewDestroyed(view)
            }
        },
        deselectedView(view) {
            if (view instanceof View) {

            }
        },
        deselectedView(view) {
            if (view instanceof View) {

            }
        },

        //////////////////////////////////////// Specify View
        /**
         * Get The view of Board View display in canvas
         * @returns {BoardView} First Board View in View Controller
         */
        getBoard() {
            return this.getViewsByClass(BoardView)[0]
        },

        /**
         * Get The view of Highlight View display in canvas
         * @returns {View} First Highlight View in View Controller
         */

        getHighlightViews() {
            return this.getViewsByClass(BoardView)[0]
        },

        async updateAvatarViewAsync() {

        },
        async updateCrestInfoViewAsync() {

        },

        //////////////////////////////////////// Highlight

        /**
         * Check if is currently Highlight or not
         * @returns {boolean}
         */
        isHighlight() {
            return this.highlight.land.length > 0 ||
                this.highlight.lanmonsterd.length > 0 ||
                this.highlight.monsterlord.length > 0 ||
                this.highlight.item.length > 0 ||
                this.highlight.board.length > 0
        },
        /**
         * Highlight list of Land View
         * @param {LandView[]} list 
         * @param {string} type
         */
        highlightLandView(list, type) {
            for (var i in list) {
                var landview = list[i]
                if (landview instanceof LandView) {
                    landview.setHighlight(true)
                    this.highlight.land.push(landview)
                }
            }
            this.setDirty()
        },
        /**
         * Highlight list of Monster View
         * @param {MonsterView[]} list 
         * @param {string} type
         */
        highlightMonsterView(list, type) {
            for (var i in list) {
                var monsterview = list[i]
                if (monsterview instanceof MonsterView) {
                    monsterview.setHighlight(true)
                    this.highlight.monster.push(monsterview)
                }
            }
            this.setDirty()
        },
        /**
         * Highlight list of Monster View
         * @param {MonsterLordView[]} list 
         * @param {string} type
         */
        highlightMonsterView(list, type) {
            for (var i in list) {
                var monsterlordview = list[i]
                if (monsterlordview instanceof Views.MonsterLordView) {
                    monsterlordview.setHighlight(true)
                    this.highlight.monsterlord.push(monsterlordview)
                }
            }
            this.setDirty()
        },
        /**
        * Highlight list of Item View
        * @param {ItemView[]} list 
        * @param {string} type
        */
        highlightItemView(list, type) {
            for (var i in list) {
                var itemview = list[i]
                if (itemview instanceof ItemView) {
                    itemview.setHighlight(true)
                    this.highlight.monster.push(itemview)
                }
            }
            this.setDirty()
        },
        /**
         * Highlight list of Cell point in Board View
         * @param {Point[]} list 
         * @param {string} type
         */
        highlightBoardView(list, type) {
            if (isFunction(this.getHighlightViews().setHighlight)) {
                var view = this.getHighlightViews()
                view.requestHighlight(list)
                view.setHighlight(true)
                this.highlight.board = list
            }
            this.setDirty()
        },
        /**
         * Clear All hightlight
         */
        clearAllHighlight() {
            //Clear Land highlight
            for (var i in this.highlight.land) {
                this.highlight.land[i].setHighlight(false)
            }
            this.highlight.land = []
            //Clear Monster highlight
            for (var i in this.highlight.monster) {
                this.highlight.monster[i].setHighlight(false)
            }
            this.highlight.monster = []

            //Clear Monsterlord highlight
            for (var i in this.highlight.monsterlord) {
                this.highlight.monsterlord[i].setHighlight(false)
            }
            this.highlight.monsterlord = []

            //Clear Item highlight
            for (var i in this.highlight.item) {
                this.highlight.item[i].setHighlight(false)
            }
            this.highlight.item = []

            //Clear board highlight
            this.getHighlightViews().clearHighlight([])
            this.highlight.board = []
        },
        //////////////////////////////////////// DOM Event
        displayDice(interval) {
            var $dicescontroller = this.getDOMItems().dices.controller
            $dicescontroller.addClass('show')
            if (interval == undefined || interval == null)
                return
            setTimeout(() => {
                $dicescontroller.removeClass("show")
            }, interval)
        },
        rollDice(index, face) {
            var DOMObject = undefined
            switch (index) {
                case 0: DOMObject = this.getDOMItems().dices.one; break
                case 1: DOMObject = this.getDOMItems().dices.two; break
                case 2: DOMObject = this.getDOMItems().dices.three; break
            }
            for (var i = 1; i <= 6; i++) {
                DOMObject.removeClass('show-' + i);
                if (face === i) {
                    console.log("roll to ", 'show-' + i)
                    DOMObject.addClass('show-' + i);
                }
            }
        },

        rollDiceAnimation(results, callback) {
            var $dice1 = this.getDOMItems().dices.one,
                $dice2 = this.getDOMItems().dices.two,
                $dice3 = this.getDOMItems().dices.three,
                $controller = this.getDOMItems().dices.controller

            if (!$controller.hasClass("show")) {
                $controller.addClass('show')
                setTimeout(() => {
                    $controller.removeClass("show")
                    if (callback)
                        callback()
                }, 1300)
            }

            for (var i = 1; i <= 6; i++) {
                $dice1.removeClass('show-', i)
                $dice2.removeClass('show-', i)
                this.getDOMItems().dices.three.removeClass('show-', i)
                if (results[0] === i) {
                    $dice1.addClass('show-' + i);
                }
                if (results[1] === i) {
                    $dice2.addClass('show-' + i);
                }
                if (results[2] === i) {
                    $dice3.addClass('show-' + i);
                }
            }
        },
        //Dice Pool Popup DOM handle
        displayDicePool() {
            if ($('.popup-controller')) {
                $('.popup-controller').addClass('open');
            }
            if (this._onDisplayDicePool) {
                this._onDisplayDicePool()
            }
        },
        hideDicePool() {
            if ($('.popup-controller')) {
                $('.popup-controller').removeClass('open');
            }
            if (this._onDisplayDicePool) {
                this._onHideDicePool()
            }
        },
        updateDiceFace(diceindex,faceindex,facetype){
            var $dice1 = this.getDOMItems().dices.one,
                $dice2 = this.getDOMItems().dices.two,
                $dice3 = this.getDOMItems().dices.three,
                $selectiondice

            var pathimgface = "client/img/dice_face_1.png"
            var strside = ".side .one"

            if(facetype == "summon"){
                pathimgface = "client/img/dice_face_1.png"
            } else if(facetype == "movement"){
                pathimgface = "client/img/dice_face_2.png"
            }else if(facetype == "magic"){
                pathimgface = "client/img/dice_face_3.png"
            }else if(facetype == "attack"){
                pathimgface = "client/img/dice_face_4.png"
            }else if(facetype == "defend"){
                pathimgface = "client/img/dice_face_5.png"
            }else if(facetype == "trap"){
                pathimgface = "client/img/dice_face_6.png"
            }

            switch(faceindex){
                case 0:
                    strside = ".side.one"
                    break;
                case 1:
                    strside = ".side.two"
                    break;
                case 2:
                    strside = ".side.three"
                    break;
                case 3:
                    strside = ".side.four"
                    break;
                case 4:
                    strside = ".side.five"
                    break;
                case 5:
                    strside = ".side.six"
                    break;
            }
            
            if(diceindex == 0){
                $selectiondice = $dice1
            }else if(diceindex == 1){
                $selectiondice = $dice2
            }else if(diceindex == 2){
                $selectiondice = $dice3
            }else{
                $selectiondice = $dice1
            }

            $selectiondice.find(strside).find("img").attr("src",pathimgface)
        },
        
        updateSummoningDice(datas,ignoreshow){
            var self = this
            console.log("view data = ",datas)
            _.each(datas,function(data,i){
                var src             = data.srcImg
                var summonselection = data.summon.selected
                var isSummon        = data.summon.active

                if(ignoreshow){
                }else{
                    if(isSummon){
                        self.showDiceSummoning(i)
                    }else{
                        self.hideDiceSummoning(i)
                    }
                }

                if(summonselection){
                    self.selectingDiceSummoning(i)
                }else{
                    self.deselectingDiceSummoning(i)
                }

                if(src){
                    self.updateDiceSummoning(i,src)
                }
            })
        },


        /**JQUERY Method */
        selectingDiceSummoning(index){
            $(".controller.summonning.selection .cube").eq(index).addClass("highlight")
        },
        deselectingDiceSummoning(index){
            $(".controller.summonning.selection .cube").eq(index).removeClass("highlight")
        },
        updateDiceSummoning(index,src){
            $(".controller.summonning.selection .cube .monster.display img").eq(index).attr("src", src)
        },
        showDiceSummoning(index){
            $(".controller.summonning.selection .cube").eq(index).addClass("show")
        },
        hideDiceSummoning(index){
            $(".controller.summonning.selection .cube").eq(index).removeClass("show")
        },
        hideAllSummoningDice(){
            $(".controller.summonning.selection .cube").removeClass("show")
            $(".controller.summonning.selection .cube").removeClass("highlight")
        },
        isDicePoolPopupDisplay() {
            return $('.popup-controller').hasClass("open")
        },
        selectedDicePoolAt(index) {
            $('.popup-controller .popup-grid .item-grid').eq(index).addClass("selected")
        },
        deselectedDicePoolAt(index) {
            $('.popup-controller .popup-grid .item-grid').eq(index).removeClass("selected")
        },
        focusedDicePoolAt(index) {
            $('.popup-controller .popup-grid .item-grid').eq(index).addClass("focused")
        },
        unfocusedDicePoolAt(index) {
            $('.popup-controller .popup-grid .item-grid').eq(index).removeClass("focused")
        },
        disableDicePoolAt(index) {
            $('.popup-controller .popup-grid .item-grid').eq(index).addClass("disable")
        },
        enableDicePoolAt(index) {
            $('.popup-controller .popup-grid .item-grid').eq(index).removeClass("disable")
        },
        updateImageDicePoolAt(index, src) {
            $('.popup-controller .popup-grid .item-grid .img-portrait').eq(index).attr("src", src)
        },
        updateNameDicePoolAt(index, name) {
            $('.popup-controller .popup-grid .item-grid .img-portrait').eq(index).html(name)
        },

        /**
         * 
         * @param {PoolItemView[]} datas 
         */
        async updatePlayerPoolViewAsync(datas) {
            /**@type {PoolItemView[]} */

            var self = this

            _.each(datas, function (data,i) {
                var name = data.name
                var unavailable  =    !_.property("available")(data)
                var selected     =    _.property("selected")(data)
                var portraitimg  =    _.property("portraitimg")(data)
            
                if (selected) {
                    self.selectedDicePoolAt(i)
                } else {
                    self.deselectedDicePoolAt(i)
                }

                if(unavailable){
                    self.disableDicePoolAt(i)
                }else{
                    self.enableDicePoolAt(i)
                }

                if(portraitimg){
                     var path = "./client/img/portrait/"
                     self.updateImageDicePoolAt(i,path + portraitimg)
                }else{
                }
                self.updateNameDicePoolAt(i,name)

            }.bind(this))
        },

        async updateRollingDice(datas){
            var self = this
            console.log("*test ",datas)
            _.each(datas, function(data,i){
                var faces = _.property("faces")(data)
                _.each(faces,function(face,iFace){
                    self.updateDiceFace(i,iFace,face)
                })
            }.bind(this))
        },
        //////////////////////////////////////// SPECIFY
        generateView(kind, config) {
            if (isViewKind(kind)) {
                return this.generateViewFromKind(kind, config)
            } else if (isViewPrototype(kind)) {
                return this.generateViewFromPrototype(kind, config)
            } else {
                console.log("[ERROR] value ", kind, " is Not Type that can Create View")
            }
        },
        generateViewFromKind(kind, config) {
            var id = viewid()
            var view = ViewFactory.createView(kind, id, config)
            if (this._onViewCreated) {
                this._onViewCreated(view)
            }
            return view
        },
        generateViewFromPrototype(_class, config) {
            var id = viewid()
            var view = new _class(id, config)
            if (this._onViewCreated) {
                this._onViewCreated(view)
            }
            return view
        },

        //////////////////////////////////////// ANIMATION

        initBoard() {
            this.registerLayer("board");
            this.registerLayer("land");
            this.registerLayer("highlight");
            this.registerLayer("piece");
            this.registerLayer("common");

            this.registerViewIntoLayer(new BoardView("0000-0000-0000-0000", Tsh.Ddm.View.config.views.board))
            this.registerViewIntoLayer(new HighlightView("0000-0000-0000-0001", Tsh.Ddm.View.config.views.board))
        },
        //Signal Slots
        onViewCreated(callback) { this._onViewCreated = callback },
        onViewDestroyed(callback) { this._onViewDestroyed = callback },
        onDirty(callback) { this._onDirty = callback },
        onInitialized(callback) { this._onInitialized = callback },
        onDisplayDicePool(callback) { this._onDisplayDicePool = callback },
        onHideDicePool(callback) { this._onHideDicePool = callback }

    }
})


