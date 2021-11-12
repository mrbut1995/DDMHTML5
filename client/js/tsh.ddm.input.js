define(["ddm", "jquery", "entity/entity"], function (Tsh, $, Entity) {
    Tsh = Tsh || {}
    Tsh.Ddm = Tsh.Ddm || {}

    Tsh.Ddm.Input = {

        init: function (app) {
            this.mouse = {
                x: 0,
                y: 0,
                down: false,
                dragging: false,
                col: 0,
                row: 0,
            }
            this.nearby = {
                point: [{ col: 0, row: 0 }],
                relative: [],
                absolute: [],
                all: [],
            }
            this.prevmouse = {}
            this.hovering = {
                point: null,
                monster: null,
                monsterlord: null,
                land: null,
                item: null
            }
            this.inputListener = []
            this.pressAndHoldTimer = null

            this.selected = {
                entity      : null,
                container   : null,
                dom         : null,
                index       : -1  ,
            }

            this.app = app
            if (this._onInitialized) {
                this._onInitialized()
            }

            this.$dom = null;
        },

        connectInput($dom) {
            this.$dom = $dom
            $dom.canvas.on("click", this.oncanvasmouseclicked.bind(this))
            $dom.canvas.on("mousedown", this.oncanvasmousedown.bind(this));
            $dom.canvas.on("mouseup", this.oncanvasmouseup.bind(this));
            $dom.canvas.on("mousemove", this.oncanvasmousemove.bind(this));
            $dom.canvas.on("mouseout", this.oncanvasmouseout.bind(this));

            $dom.popup.pool.items.on("click", function () {
                var index = $(".popup-controller .popup-grid .item-grid").index($(this))
                console.log("item clicked = ", index)
                if(Tsh.Ddm.Input._onDicePoolInput){
                    Tsh.Ddm.Input._onDicePoolInput("popup-grid",index)
                }
            })

            $dom.popup.closebtn.on("click", function () {
                Tsh.Ddm.View.hideDicePool()
            })

            $dom.popup.outside.on("click", function () {
                Tsh.Ddm.View.hideDicePool()
            })


        },

        registerEntityInput(entity) {
            if (entity instanceof Entity) {
                
            }
        },
        unregisterEntityInput(entity) {
            if (entity instanceof Entity) {

            }
        },
        forEachInputListener() {

        },
        //Listener
        oncanvasmouseclicked: function (ev) {
            if (this._onMouseClicked) {
                this._onMouseClicked(ev)
            }
            ev.preventDefault();
        },
        oncanvasmousedown: function (ev) {
            this.mouse.down = true
            if (this._onMousePressed) {
                this._onMousePressed(ev)
            }
            this.pressAndHoldTimer = setTimeout((e => this.onmousepressandhold(ev)).bind(this), 300)
            ev.preventDefault();
        },
        forEachInputListener(callback) {
            for (var i in this.inputListener) {
                callback(this.inputListener[i])
            }
        },
        oncanvasmouseup: function (ev) {
            this.mouse.down = false
            this.mouse.dragging = false

            if (this._onMouseReleased) {
                this._onMouseReleased(ev)
            }
            ev.preventDefault();
        },
        oncanvasmousemove: function (ev) {
            var coord = this._requestCanvasCoord(ev)
            if (isCoord(coord)) {
                this.prevmouse = deepCopy(this.mouse)
                this.mouse.x = coord.x
                this.mouse.y = coord.y
                this._updateGridMousePosition()
                this._updateHover()
                this._updateNearby()
            }
            if (this.mouse.down) {
                this.mouse.dragging = true;
            }
            if (this._onCanvasHover) {
                this._onCanvasHover(ev)
            }
            ev.preventDefault();
        },
        oncanvasmouseout: function (ev) {
            if (this._onMouseOut) {
                this._onMouseOut(ev)
            }
            ev.preventDefault();
        },
        onmousepressandhold: function (ev) {
            if (this._onMousePressAndHold) {
                this._onMousePressAndHold(ev)
            }
            ev.preventDefault();
        },

        isRequestNearbyPoint() {
            return this.nearby.relative.length > 0
        },
        setNearbyRelativeList(lst) {
            this.nearby.relative = lst
        },
        clearNearbyRelativeList() {
            this.nearby.relative = []
        },
        getNearbyAbsoluteList() {
            return this.nearby.absolute;
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
        selectedInput(entity){
            if(entity instanceof Entity){
                if(this.selected.entity){

                }
                this.selected.entity        = entity
                this.selected.container     = Tsh.Ddm.View.getDOMItems().canvas
                this.selected.dom           = Tsh.Ddm.View.getDOMItems().canvas
                this.selected.index         = -1
            }
        },
        deselectedInput(entity){
            if(entity instanceof Entity){
                if(this.selected.entity == entity){

                }
                this.selected.entity        = null
                this.selected.container     = null
                this.selected.dom           = null
                this.selected.index         = -1
            }
        },
        selectedPoolItem(index){
            this.selected.entity      = null
            this.selected.container   = Tsh.Ddm.View.getDOMItems().popup.pool.controller
            this.selected.dom         = Tsh.Ddm.View.getDOMItems().popup.pool.items.eq(index)
            this.selected.index       = index
        },
        deseletectPoolItem(){
            this.selected.entity        = null
            this.selected.container     = null
            this.selected.dom           = null
            this.selected.index         = -1
        },
        /**
        * @private
        */
        _requestCanvasCoord(e) {
            return Tsh.Ddm.View.getCanvasCoord(e)
        },
        /**
        * @private
        */
        _updateGridMousePosition() {
            //TODO: Translate Mouse Position into Col Row
            var m = Tsh.Ddm.View.getGridPointAt(this.mouse.x, this.mouse.y)
            this.mouse.col = m.col
            this.mouse.row = m.row
        },
        /**
        * @private
        */
        _updateHover() {
            var col = this.mouse.col,
                row = this.mouse.row
            this.hovering.point = new Point(col, row)
            this.hovering.monster = Tsh.Ddm.Entity.getMonsterAt(col, row)
            this.hovering.monsterlord = Tsh.Ddm.Entity.getMonsterLordAt(col, row)
            this.hovering.land = Tsh.Ddm.Entity.getLandAt(col, row)
            this.hovering.item = Tsh.Ddm.Entity.getItemAt(col, row)
        },
        /**
         * @private
         */
        _updateNearby() {
            this.nearby.point[0].col = this.mouse.col
            this.nearby.point[0].row = this.mouse.row
            this.nearby.absolute = []
            forEach(this.nearby.relative, function (pRelative) {
                var p = relativeToAbsolutePoint(this.nearby.point[0], pRelative)
                this.nearby.absolute.push(p)
            }.bind(this))
            this.nearby.all = this.nearby.absolute.concat([this.nearby.point])
        },
        onInitialized(callback) { this._onInitialized = callback },

        onCanvasClicked(callback) { this._onMouseClicked = callback },
        onCanvasPressed(callback) { this._onMousePressed = callback },
        onCanvasReleased(callback) { this._onMouseReleased = callback },
        onCanvasHover(callback) { this._onCanvasHover = callback },
        onCanvasOut(callback) { this._onMouseOut = callback },
        onCanvasPressAndHold(callback) { this._onPressAndHold = callback },
        onDicePoolInput(callback){this._onDicePoolInput = callback },
    }
})