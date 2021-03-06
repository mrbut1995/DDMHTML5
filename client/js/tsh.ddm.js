let start, previousTimeStamp;
var Tsh = Tsh || {}
Tsh.Ddm = Tsh.Ddm || {}

/**
 * @typedef {Object} ViewGroup
 * @property {object} point 
 * @property {object} monsterview    
 * @property {object} landview       
 * @property {object} monsterlordview
 * @property {object} itemview       
 */

/**
 * @typedef  {object} AsyncRequest
 * @property {object[]} param
 * @property {object[]} data
 * @property {string}   status Status of current Async request
 * @property {function} oncompleted 
 */
//Define Modul
define(function (Entity) {

    console.log("LOAD TSH.DDM")

    Tsh.Ddm.Game = {
        init: function () {

            this.app = Tsh.Ddm

            //Define Property

            this.initProperty()
            this.connectModule();

            Tsh.Ddm.Loader.init(Tsh.Ddm)

            Tsh.Ddm.View.init(Tsh.Ddm)
            Tsh.Ddm.Entity.init(Tsh.Ddm)
            Tsh.Ddm.Input.init(Tsh.Ddm)

            Tsh.Ddm.Animator.init(Tsh.Ddm)


            /**@module tsh/ddm/client */
            Tsh.Ddm.Client.init(Tsh.Ddm)
            Tsh.Ddm.Player.init(Tsh.Ddm)
            Tsh.Ddm.Match.init(Tsh.Ddm)
            Tsh.Ddm.Blueprint.init(Tsh.Ddm)

            Tsh.Ddm.Path.init(Tsh.Ddm)
            Tsh.Ddm.Board.init(Tsh.Ddm)

            Tsh.Ddm.Debug.init(Tsh.Ddm)

            this.connectServer();

        },
        initProperty() {
            this.inputmode = {
                rolling: false,
                summoning: false,
                diceselecting: false,
                piece:false,
                main:true
            }
            this.inputvalue = {
                summoning : {
                    index : 0 ,
                    rotate: 0 ,
                    path  : [],

                    placeable: [],
                    unplaceable:[],
                },
                piece : {
                    target : null,

                    walkable : [],
                    nonwalkable : [],
                }
            }
        },
        connectServer() {
            var self = this
            Tsh.Ddm.Client.onDispatch(function (host, port) {
                console.log("Dispatched to game server " + host + ":" + port);
            })
            Tsh.Ddm.Client.onConnected(function () {
                console.log("on Connected To Server");

            })
            Tsh.Ddm.Client.onEntityList(function (list) {
                console.log("Receive Entity List");
                Tsh.Ddm.Entity.updateList(list)
            })
            Tsh.Ddm.Client.onWelcome(function (id, name, contain, avatar, lp, crests, matchid) {
                console.log("Successfull Connect to server => Init handle")

                Tsh.Ddm.Player.id = id
                Tsh.Ddm.Player.name = name;
                Tsh.Ddm.Player.contain = contain;
                Tsh.Ddm.Player.avatar = avatar;
                Tsh.Ddm.Player.lp = lp;
                Tsh.Ddm.Player.crests = crests

                Tsh.Ddm.Match.matchid = matchid

                Tsh.Ddm.Entity.initEntityGrid({
                    width: 13,
                    height: 19
                })
                Tsh.Ddm.Path.initPathingGrid({
                    width: 13,
                    height: 19
                })
                var player = Tsh.Ddm.Player
                var client = Tsh.Ddm.Client
                
                self.haveGameStartedMainPhase()

                //Connecting Player Handle
                player.onActive(function () {

                })
                player.onLose(function () {

                })
                player.onConnected(function () {

                })
                player.onDeclareEndPhase(function () {

                })
                player.onSelectedMonster(function (monster) {

                })
                player.onDeselectedMonster(function (monster) {

                })
                player.onRequestRollDice(function (selection) {
                    console.log("Request roll ", selection)
                    client.sendRoll(id, selection[0], selection[1], selection[2])
                })
                player.onPlayerRequestMessage(function (msg) {

                })

                Tsh.Ddm.Client.onSpawnEntity(function (kind, id, x, y, name, controllerid, target) {
                    console.log("Spawn entity ", id)
                    Tsh.Ddm.Entity.requestSpawnEntityAsync(kind, id, x, y, name, controllerid, target)
                });
                Tsh.Ddm.Client.onDespawnEntity(function (player, id) {
                    console.log("Despawn entiy ", id)
                    Tsh.Ddm.Entity.requestDespawnEntityAsync(id)
                })

                Tsh.Ddm.Client.onEntityMove(function (playerid, id, x, y, type) {
                    var entity = null;
                    if (playerid === Tsh.Ddm.Player.playerid) {
                        console.log("By client Player Control ", id)
                        entity = Tsh.Ddm.Entity.getEntityById(id)

                        if (entity) {
                            entity.idle()
                            self.makeEntityGoTo(entity, x, y)
                        } else {
                            console.log("CANNOT FIND ENTITY ", id)
                        }
                    } else {
                        console.log("Not by client Player Control")
                        entity = Tsh.Ddm.Entity.getEntityById(id)

                        if (entity) {
                            entity.idle()
                            self.makeEntityGoTo(entity, x, y)
                        } else {
                            console.log("CANNOT FIND ENTITY ", id)
                        }
                    }
                });
                Tsh.Ddm.Client.onEntityDestroy(function (player, id, x, y) {

                });
                Tsh.Ddm.Client.onEntityAttack(function (player, id, x, y) {

                });
                Tsh.Ddm.Client.onEntityEffect(function (player, id, x, y) {

                });
                Tsh.Ddm.Client.onPropertyChanging(function (id, property, value) {

                });
                Tsh.Ddm.Client.onEffectTrigger(function (player, id, x, y) {

                });
                Tsh.Ddm.Client.onPlayerActive(function (playerid) {

                });
                Tsh.Ddm.Client.onPlayerDeactive(function (playerid) {

                });
                Tsh.Ddm.Client.onPlayerDie(function (playerid, result) {

                });
                Tsh.Ddm.Client.onRollDice(async function (playerid, roll1, roll2, roll3) {
                    Tsh.Ddm.Player.updateRollingResult([roll1, roll2, roll3])
                    await self.updateRollingDiceScreen()
                    if(playerid == id){
                        if(Tsh.Ddm.Player.isSelectionSummonable()){
                            self.haveGameSuccessPlayerRolled()                            
                        }else{
                            self.haveGameFailedPlayerRolled()
                        }
                    }
                }.bind(this));
                Tsh.Ddm.Client.onPhaseChanged(function (playerid, changephase) {
                
                });
                Tsh.Ddm.Client.onPoolChanged(async function (playerid, pool, unused) {
                    self.requestUpdatePlayerPool(playerid, pool, unused)
                });
                Tsh.Ddm.Client.onGameEnd(function (state, playerid) {

                });

                Tsh.Ddm.Client.onDisconnected(function (message) {

                });
            })
            Tsh.Ddm.Client.onSynchronizingData(function (data) {
                console.log("on Synchronizing Data");

            }.bind(this))

            Tsh.Ddm.Client.connect()
        },

        connectModule() {
            var self = this

            Tsh.Ddm.Board.onInitialized(function () {

            })
            Tsh.Ddm.Entity.onInitialized(function () {

                this.onAddEntity(function (entity) {
                    Tsh.Ddm.Entity  .registerToEntityGrid(entity, entity.point.col, entity.point.row)
                    Tsh.Ddm.Path    .registerToPathingGrid(entity, entity.point.col, entity.point.row)
                    Tsh.Ddm.Animator.registerEntityAnimator(entity)
                    Tsh.Ddm.View    .registerEntityView(entity)
                    Tsh.Ddm.Input   .registerEntityInput(entity)
                    if(entity.controllerid == Tsh.Ddm.Player.id){
                        Tsh.Ddm.Player.assignEntity(entity)
                    }
                })

                this.onRemoveEntity(function (entity) {
                    Tsh.Ddm.Entity  .removeFromEntityGrid(entity, entity.point.col, entity.point.row)
                    Tsh.Ddm.Path    .removeFromPathingGrid(entity, entity.point.col, entity.point.row)
                    Tsh.Ddm.Animator.unregisterEntityAnimator(entity)
                    Tsh.Ddm.View    .unregisterEntityView(entity)
                    Tsh.Ddm.Input   .unregisterEntityInput(entity)
                    if(entity.controllerid == Tsh.Ddm.Player.id){
                        Tsh.Ddm.Player.resignMonster(entity)
                    }
                })

                this.onRequestEntities(function (entitieIds) {
                    Tsh.Ddm.Client.sendWho(entitieIds)
                })

                this.onSpawnMonster(function (entity, col, row, controllerid, target) {
                    var _view = Tsh.Ddm.View.generateView(entity.view)
                    entity.setView(_view)
                    entity.setGridPosition(col, row)
                    
                    Tsh.Ddm.Entity.addEntity(entity)

                    entity.idle()
                    /**
                     * Connect Signal for Entity 
                     */
                    entity.onSolidChanged(function(){
                    })
                    entity.onGridPositionChanged(function(){
                    })

                    /**
                     * Connect Signal for Monster
                     */
                    entity.onSolidChanged(function(){
                    })
                    entity.onDamageTarget(function (target, points) {
                    })
                    entity.onDamageMultiTarget(function (targets, point) {
                    })
                    entity.onKillTarget(function (target) {
                    })
                    entity.onChangeStat(function (stat, val) {
                    })
                    entity.onChangeHealth(function (points, reason) {
                    })
                    entity.onKilled(function (reason) {
                    })
                    entity.onHasMoved(function (reason) {
                    })
                    entity.onRequestPath(function (point) {
                        var path = self.findPath(entity, point.col, point.row)
                        return path
                    })
                    entity.onStartPath(function (path) {
                        self.unregisterEntityPosition(entity)
                    })
                    entity.onBeforeStep(function () {
                        self.unregisterEntityPosition(entity)
                    })
                    entity.onStep(function () {
                        if (entity.hasNextStep()) {
                            self.registerEntityDualPosition(entity)
                        }
                    })
                    entity.onStopPath(function (point) {
                        self.unregisterEntityPosition(entity)
                        self.registerEntityPosition(entity)
                    })
                }.bind(this))

                this.onSpawnMonsterLord(function (entity, col, row, controllerid, target) {
                    var _view = Tsh.Ddm.View.generateView(entity.view)
                    entity.setView(_view)
                    entity.setGridPosition(col, row)

                    Tsh.Ddm.Entity.addEntity(entity)
                }.bind(this))

                this.onSpawnLand(function (entity, col, row, controllerid) {
                    var _view = Tsh.Ddm.View.generateView(entity.view)
                    entity.setView(_view)
                    entity.setGridPosition(col, row)

                    Tsh.Ddm.Entity.addEntity(entity)
                }.bind(this))

                this.onSpawnItem(function (entity, col, row, controllerid) {
                    var _view = Tsh.Ddm.View.generateView(entity.view)
                    entity.setView(_view)
                    entity.setGridPosition(col, row)

                    Tsh.Ddm.Entity.addEntity(entity)
                }.bind(this))

                this.onDespawnEntity(function (entity) {
                    Tsh.Ddm.Entity.removeEntity(entity)
                    entity.destroy()
                }.bind(this))

            }.bind(Tsh.Ddm.Entity))

            Tsh.Ddm.View.onInitialized(function () {
                Tsh.Ddm.Input.connectInput(this.getDOMItems())
                Tsh.Ddm.Board.connectBoardView(this.getBoard())

                this.onViewCreated(function (view) {
                    if (view.type == "monster") {
                        view.setBoard(Tsh.Ddm.View.getBoard())
                    } else if (view.type == "monsterlord") {
                        view.setBoard(Tsh.Ddm.View.getBoard())
                    } else if (view.type == "land") {
                        view.setBoard(Tsh.Ddm.View.getBoard())
                    }
                    Tsh.Ddm.Animator.registerViewAnimator(view)
                }.bind(this))

                this.onViewDestroyed(function (view) {
                    Tsh.Ddm.Animator.unregisterViewAnimator(view)
                }.bind(this))

                this.onDirty(function () {

                }.bind(this))

                this.onDisplayDicePool(function () {
                }.bind(this))

                this.onHideDicePool(function () {

                }.bind(this))
            }.bind(Tsh.Ddm.View))

            Tsh.Ddm.Input.onInitialized(function () {
                this.onCanvasClicked(function (ev) {
                    console.log("onCanvasClicked")
                    let entities = Tsh.Ddm.Input.getHovering()
                    if(self.isSummoningMode()){
                        self.playerInputPlayerSummoning()
                    }else if(self.isMainMode()){
                        if(self.inputvalue.piece.target == null){
                            self.playerInputSelectedMonster()
                        }
                    }else if(self.isPieceInputMode()){
                        if(self.inputvalue.piece.target != entities.monster){
                            self.playerInputSwitchSelectedMonster()
                        }else{
                            self.playerInputCancelSelectedMonster()
                        }
                    }
                })
                this.onCanvasPressed(function (ev) {
                    let entites = Tsh.Ddm.Input.getHovering()
                    if(self.isMainMode()){

                    }
                })
                this.onCanvasReleased(function (ev) {

                })
                this.onCanvasHover(function (ev) {
                    if (self.isSummoningMode()) {
                        console.log("hovering summoning Mode")
                        self.updatePlayerSummoningInput()
                        self.updateSummoningScreen()
                    }
                })
                this.onCanvasOut(function (ev) {

                })
                this.onCanvasPressAndHold(function (ev) {

                })
                this.onCanvasWheel(function(ev){

                })
                this.onDicePoolInput(function (source, index) {
                    if (source == "btnRollSelected") {
                        Tsh.Ddm.Game.playerInputRollingDice()
                    } else if (source == "btnCancelSelected") {
                        Tsh.Ddm.Player.deselectAllPoolItem()
                    } else if (source == "popup-grid") {
                        Tsh.Ddm.Player.toggleSelectedPoolItem(index)
                    }
                })
            }.bind(Tsh.Ddm.Input))

            Tsh.Ddm.Player.onInitialized(function () { })
        },
        run: function () {
            window.requestAnimationFrame(this.step.bind(this));
        },
        step(timestamp) {
            if (start === undefined)
                start = timestamp;
            const elapsed = timestamp - start;

            var delta = timestamp - previousTimeStamp;

            if (previousTimeStamp !== timestamp) {
                this.update(delta)
            }
            previousTimeStamp = timestamp
            var cb = this.step.bind(this)
            window.requestAnimationFrame(cb);

        },
        update(delta) {
            Tsh.Ddm.View.update(delta)
            Tsh.Ddm.Entity.update(delta)
            Tsh.Ddm.Animator.update(delta)
        },
        hideScreen: function (id) {
        },
        showScreen: function () {
        },
        hideScreens: function () {
        },
        restart() {
        },

        /**
         * Input Mode Handle
         */

        isSummoningMode() {
            return this.inputmode.summoning
        },
        startSummoningMode() {
            this.inputmode.summoning = true
        },
        endSummoningMode() {
            this.inputmode.summoning = false
        },
        isRollingMode() {
            return this.inputmode.rolling
        },
        startRollingMode() {
            this.inputmode.rolling = true
        },
        endRollingMode() {
            this.inputmode.rolling = false
        },
        isPieceInputMode(){
            return this.inputmode.piece
        },
        startPieceInputMode() {
            this.inputmode.piece = true
        },
        endPieceInputMode() {
            this.inputmode.piece = false
        },
        isDiceSelectingMode() {
            return this.inputmode.diceselecting
        },
        startDiceSelectingMode() {
            this.inputmode.diceselecting = true
        },
        endDiceSelectingMode() {
            this.inputmode.diceselecting = false
        },
        isMainMode(){
            return this.inputmode.standby 
        },
        startMainMode(){
            this.inputmode.standby = true
        },
        endMainMode(){
            this.inputmode.standby = false
        },
        resetInputMode() {
            this.inputmode.rolling = false
            this.inputmode.summoning = false
            this.inputmode.diceselecting = false
            this.inputmode.piece = false
            this.inputmode.standby = true;
        },

        async playerInputDisplayDicePool() {
            if (Tsh.Ddm.Player.allowedSelectionDice()
                && !Tsh.Ddm.View.isDicePoolDisplay()) {
                    this.haveGameRequestSelectingDice()
            }
        },
        async playerInputHideDicePool() {
            if (Tsh.Ddm.View.isDicePoolDisplay()) {
                this.haveGameCancelSelectingDice()
            }
        },
        async playerInputSelectingSummoningMonster(index) {
            if (this.isSummoningMode()) {
                Tsh.Ddm.Player.toggleSummoningDiceSelecting(index)
            } else {
                console.log("[ERROR] Currently does not summoning")
            }
        },
        async playerInputCancelSelectingSummoningMonster(){
            if(this.isSummoningMode()){ 
                Tsh.Ddm.Game.haveGameCancelSummoning()
            }else{
                console.log("[ERROR] Currently does not summoning")
            }
        },
        async playerInputRollingDice() {
            if (Tsh.Ddm.Player.checkDiceSelecting()) {
                if (Tsh.Ddm.Player.allowedActionRoll()) {
                    this.haveGameDoneSelectingDice()
                } else {
                    console.log("Not allowed to Roll")
                }
                //Done Player Selection Roll
                Tsh.Ddm.Player.notAllowedSelectionDice()
            } else {
                console.log("Cannot Roll Dice yet")
            }
        },
        async playerInputCancelSummoning(){
            this.haveGameCancelSummoning()
        },
        async playerInputPlayerSummoning(){
            let  nearby  = Tsh.Ddm.Input.getNearbyAll(),
                 playerid = Tsh.Ddm.Player.id,
                 monster   = Tsh.Ddm.Player.getSummoningTarget(),
                 canBeSpawn = this.inputvalue.summoning.placeable.length > 0 && this.inputvalue.summoning.unplaceable.length == 0
            if(canBeSpawn){
                if(monster){
                    //Request Server to Spawning Land
                    var monsterpoint = nearby[0],
                        landspoint   = nearby
                    _.each(landspoint,function(p){
                        Tsh.Ddm.Client.sendSpawn("NormalLand","land",p.col,p.row,playerid)
                    })
                    //Request Sever to spawning monster
                    Tsh.Ddm.Client.sendSpawn(monster.kind,"monster",monsterpoint.col,monsterpoint.row,playerid)

                    this.haveGameSuccessSummoning()
                }else{
                    console.log("[WARNING] Target Did not selected")
                }
            }else{
                console.log("[WARNING] Cannot be spawn in highlight")
            }
            //Request Server to spawning Monster
        },
        async playerInputSelectedMonster(){
            let entities = Tsh.Ddm.Input.getHovering()
            if(entities.monster){
                console.log("Contain Monster => Selected")
                this.inputvalue.piece.target = entities.monster
                this.haveGameSelectedPiece()
            }else{
                console.log("Does not contain Monster")
            }
        },

        async playerInputSwitchSelectedMonster(){
            let entities = Tsh.Ddm.Input.getHovering()
            if(entities.monster){
                console.log("Contain Monster => Selected")
                this.inputvalue.piece.target = entities.monster
                this.haveGameSelectedPiece()
            }else{
                console.log("Does not contain Monster")
            }
        },

        async playerInputCancelSelectedMonster(){
            this.inputvalue.piece.target = null
            this.haveGameCancelSelectedPiece()
        },


        /****************************************
         *           Update Screen 
         ****************************************/

        /**
         * Update Dice Selecting Screen
         * - If currently is Dice Selecting Mode, display Dice Selecting screen and request Query to server
         * - If not, Close The Dice Selecting Mode
         */
        async updateDiceSelectingScreen(){
            if(this.isDiceSelectingMode()){    
                if(!Tsh.Ddm.View.isDiceSelectingScreen()){
                    Tsh.Ddm.View.displayDicePool()    
                    Tsh.Ddm.Client.sendQuery(Tsh.Ddm.Player.playerid)      
                    Tsh.Ddm.View.setIsDiceSelectingScreen(true)              
                }
                var viewdata = Tsh.Ddm.View.viewdataPool()
                Tsh.Ddm.View.updatePlayerPoolViewAsync(viewdata) 
            }else{  // Not Dice Selecting Mode => Closed
                if(Tsh.Ddm.View.isDiceSelectingScreen()){
                    Tsh.Ddm.View.hideDicePool()
                    Tsh.Ddm.View.setIsDiceSelectingScreen(false)
                }
            }
        },

        /**
         * Update Rolling Dice Screen
         * - If currently is Rolling Dice Mode, display Rolling Dice screen and request Rolling result to server
         * - If not, Close The Rolling Dice Mode
         */
        async updateRollingDiceScreen(){
            if(this.isRollingMode()){
                if(!Tsh.Ddm.View.isDiceRollingScreen()){
                    Tsh.Ddm.View.displayDiceRolling()
                    Tsh.Ddm.View.setIsDiceRollingScreen(true)
                }
                var viewdata = Tsh.Ddm.View.viewdataRolling()
                await Tsh.Ddm.View.updateRollingDice(viewdata)   
            }else{
                if(Tsh.Ddm.View.isDiceRollingScreen()){
                    Tsh.Ddm.View.hideDiceRolling()
                    Tsh.Ddm.View.setIsDiceRollingScreen(false)
                }
            }
        },

        /**
         * Update Summoning Dice Screen
         * - If currently is Summoning Dice Mode, display Summoning Dice screen 
         * - If not, Close The Summoning Dice Mode
         */
        async updateSummoningScreen(){
            if(this.isSummoningMode()){
                if(!Tsh.Ddm.View.isDiceSummoningScreen()){
                    Tsh.Ddm.View.showDiceSummoningController()
                    Tsh.Ddm.View.setIsDiceSummoningScreen(true)
                }
                var viewdata = Tsh.Ddm.View.viewdataSummoning()
                Tsh.Ddm.View.updateSummoningDice(viewdata)    

                //Update Canvas 
                this.highlighPlaceableInRegion()
            }else{
                if(Tsh.Ddm.View.isDiceSummoningScreen()){
                    //Update DOM case Ending Summoning Screen
                    Tsh.Ddm.View.hideDiceSummoningController()

                    //Update Canvas case Ending Summoning Screen
                    this.clearHighlightPlaceableInRegion()

                    Tsh.Ddm.View.setIsDiceSummoningScreen(false)
                }

            }
        },

        /**
         * Update Piece Input Screen
         * - If currently is Piece Input Mode, display Piece Input  screen 
         * - If not, Close The Piece Input Mode
         */
        async updatePieceInputModeScreen(){
            if(this.isPieceInputMode()){
                if(!Tsh.Ddm.View.isPieceActionScreen()){
                    Tsh.Ddm.View.setIsPieceActionScreen(true)
                }
                var viewdata = Tsh.Ddm.View.viewdataInputMode()
                Tsh.Ddm.View.updatePieceInputMode(viewdata)
            }else{
                if(Tsh.Ddm.View.isPieceActionScreen()){
                    Tsh.Ddm.View.setIsPieceActionScreen(false)
                }
            }
        },

        /**
         * Update Main Mode Screen
         * - If currently is Main Mode mode, display Main Mode  screen 
         * - If not, Close The Main Mode Mode
         */
        async updateMainModeScreen(){
            if(this.isMainMode()){
                if(!Tsh.Ddm.View.isMainModeScreen()){
                    Tsh.Ddm.View.showMainModeController()
                    Tsh.Ddm.View.setIsMainModeScreen(true)
                }
                var viewdata = Tsh.Ddm.View.viewdataMainMode()
                Tsh.Ddm.View.updateMainMode(viewdata)
            }else{
                if(Tsh.Ddm.View.isMainModeScreen()){
                    Tsh.Ddm.View.hideMainModeController()
                    Tsh.Ddm.View.setIsMainModeScreen(false)
                }
                var viewdata = Tsh.Ddm.View.viewdataMainMode()
                Tsh.Ddm.View.updateMainMode(viewdata)
            }
        },

        /**
         * Moves a entity into a given point in board
         * 
         * @param {Number} x The x coordinate of target location
         * @param {Number} y The y coordinate of target location
         * @param {String} type The Type of moving to target location
         */
        makeEntityGoTo(entity, x, y, type) {
            entity.go(new Point(x, y), type)
        },

        findPath(entity, x, y) {
            var self = this,
                path = []
            if (entity) {
                path = Tsh.Ddm.Path.findMovingPath("", entity, x, y)
            }
            return path;
        },
        registerEntityPosition(entity) {
            if (entity) {
                Tsh.Ddm.Entity.registerToEntityGrid(entity, entity.point.col, entity.point.row)
                Tsh.Ddm.Path.registerToPathingGrid(entity, entity.point.col, entity.point.row)
            }
        },
        registerEntityDualPosition(entity) {
            if (entity) {
                Tsh.Ddm.Entity.registerToEntityGrid(entity, entity.point.col, entity.point.row)
                var nextPoint = entity.nextPoint()
                if (nextPoint.col >= 0 && nextPoint.row >= 0) {
                    Tsh.Ddm.Entity.registerToEntityGrid(entity, nextPoint.col, nextPoint.row)
                    Tsh.Ddm.Path.registerToPathingGrid(entity, nextPoint.col, nextPoint.row)
                }
            }
        },
        unregisterEntityPosition(entity) {
            if (entity) {
                Tsh.Ddm.Entity.removeFromEntityGrid(entity, entity.point.col, entity.point.row)
                Tsh.Ddm.Path.removeFromPathingGrid(entity, entity.point.col, entity.point.row)
                var nextPoint = entity.nextPoint()

                if (nextPoint.col >= 0 && nextPoint.row >= 0) {
                    Tsh.Ddm.Entity.removeFromEntityGrid(entity, nextPoint.col, nextPoint.row)
                    Tsh.Ddm.Path.removeFromPathingGrid(entity, nextPoint.col, nextPoint.row)
                }
            }
        },
        async haveGameStartedMainPhase(){
            console.log("Move To Main Mode")
            this.startMainMode()
            this.updateMainModeScreen()            
        },
        async haveGameSuccessPlayerRolled(){
            console.log("haveGameSuccessPlayerRolled")

            console.log("Ending Rolling Mode")
            this.endRollingMode()
            this.updateRollingDiceScreen()

            console.log("Move To Summon Mode")
            this.startSummoningMode()
            this.updateInputSummoningPath(0,false)
            this.updateSummoningScreen()                            
        },
        async haveGameFailedPlayerRolled(){
            console.log("haveGameSuccessPlayerRolled")

            console.log("Ending Rolling Mode")
            this.endRollingMode()
            this.updateRollingDiceScreen()

            console.log("Move To Main Mode")
            this.startMainMode()
            this.updateMainModeScreen()
        },
        async haveGameCancelSummoning(){
            console.log("Ending Summoning Mode")
            this.endSummoningMode()
            this.updateSummoningScreen()

            console.log("Move to Main Mode")
            this.startMainMode()
            this.updateMainModeScreen()
        },
        async haveGameSuccessSummoning(){
            console.log("Ending Summoning Mode")
            this.endSummoningMode()
            this.updateSummoningScreen()

            console.log("Move to Main Mode")
            this.startMainMode()
            this.updateMainModeScreen()
        },
        async haveGameDoneSelectingDice(){
            //End the Dice Selecting Mode
            console.log("Ending Dice Selecting Mode")
            this.endDiceSelectingMode()
            this.updateDiceSelectingScreen()

            //Started the Rolling Mode
            console.log("Move To Rolling Mode")
            this.startRollingMode()
            this.updateRollingDiceScreen()

            //Request Server to get Roll Result
            var selectionpool = Tsh.Ddm.Player.getSelectionPool()
            Tsh.Ddm.Client.sendRoll(Tsh.Ddm.Player.id, selectionpool[0].kind, selectionpool[1].kind, selectionpool[2].kind)
        },
        async haveGameRequestSelectingDice(){
            console.log("Ending Main Mode")
            this.endMainMode()
            this.updateMainModeScreen()

            console.log("Move To Selecting Mode")
            this.startDiceSelectingMode()
            this.updateDiceSelectingScreen()
        },
        async haveGameCancelSelectingDice(){
            console.log("Ending Selecing Mode")
            this.endDiceSelectingMode()
            this.updateDiceSelectingScreen()

            console.log("Move to Main Mode")
            this.startMainMode()
            this.updateMainModeScreen()
        },
        async haveGameSelectedPiece(){
            console.log("Ending Main Mode")
            this.endMainMode()
            this.updateMainModeScreen()

            console.log("Start Piece Input Mode")
            this.startPieceInputMode()
            this.updatePieceInputModeScreen()
        },
        async haveGameCancelSelectedPiece(){
            console.log("Ending Piece Input Mode")
            this.endPieceInputMode()
            this.updatePieceInputModeScreen()

            console.log("Move to Main Mode")
            this.startMainMode()
            this.updateMainModeScreen()
        },
        /**
        * Check if group is empty
        * @param {EntityGroup} entitygroup Entity Group need to checked
        * @return {boolean}    Result if  entity group is empty
        */
        isGroupEmpty(entitygroup) {
            return !(entitygroup.monster || entitygroup.land || entitygroup.monsterlord || entitygroup.item)
        },

        /**
        * Check if group is flat place or not
        * @param {EntityGroup} entitygroup Entity Group need to checked
        * @return {boolean}    Result if  entity group is flat place or not
        */
        isGroupFlat(entitygroup) {
            return !(entitygroup.monster || entitygroup.monsterlord || entitygroup.item)
        },

        isGroupLand(entitygroup){
            return entitygroup.land || false
        },
        /**
         * Check if can be placed into Entity Group (Empty Cell)
         * @param {EntityGroup} entitygroup Entity Group need to checked
         * @return {boolean}    Result if can be placed into entity group
         */
        isGroupPlaceable(entitygroup) {
            return !(entitygroup.monster || entitygroup.land || entitygroup.monsterlord || entitygroup.item)
        },

        /**
        * Check if can be moved into Entity Group (Not Contain monster/item/monster lord | non-solid monster/item/monster lord)
        * @param {EntityGroup} entitygroup Entity Group need to checked
        * @return {boolean}    Result if can not be moved into entity group
        */
        isGroupMovable(entitygroup) {
            return !((entitygroup.monster && entitygroup.monster.isSolid())
                || (entitygroup.item && entitygroup.item.isSolid())
                || (entitygroup.monsterlord && entitygroup.monsterlord.isSolid()))
        },

        /**
        * Check if can not be placed into Entity Group
        * @param {EntityGroup} entitygroup Entity Group need to checked
        * @return {boolean}    Result if can be placed into entity group
        */
        isGroupUnplaceable(entitygroup) {
            return !this.isGroupPlaceable(entitygroup)
        },

        /**
        * Check if can not be moved into Entity Group (solid Monster/solid Land/solid Item/solid MonsterLord )
        * @param {EntityGroup} entitygroup Entity Group need to checked
        * @return {boolean}    Result if can not be moved into entity group
        */
        isGroupNonmovable(entitygroup) {
            return !this.isGroupMovable(entitygroup)
        },

        /**
         * Check if at grid point can be placed
         * @param {number} col Column in board that need to checked
         * @param {number} row Row in board that need to checked
         * @returns {bool} Value of if the position that can be placed at
         */
        isPlacebaleAt(col,row){
            var entitygroup = Tsh.Ddm.Entity.getEntityGroupAt(col,row)
            return this.isGroupPlaceable(entitygroup)
        },

        /**
         * Check if at grid point can be moved
         * @param {number} col Column in board that need to checked
         * @param {number} row Row in board that need to checked
         * @returns {bool} Value of if the position that can be moved at
         */
        isMoveableAt(col,row){
            var entitygroup = Tsh.Ddm.Entity.getEntityGroupAt(col,row)
            return this.isGroupMovable(entitygroup)
        },
        /**
         * Retritve list of View Group from Entity Group
         * @param {EntityGroup} entitygroup entity group that need to get view from
         * @returns {ViewGroup} view group from list of entity group
         */
        getGroupView(entitygroup) {
            var viewgroup = {
                point: null,
                topview: null,
                monsterview: null,
                landview: null,
                monsterlordview: null,
                itemview: null,
            }
            if (!entitygroup) {
                return viewgroup
            }
            viewgroup.point = entitygroup.point
            if (entitygroup.first) {
                viewgroup.firstview = entitygroup.first.getView()
            }
            if (entitygroup.top) {
                viewgroup.topview = entitygroup.top.getView()
            }
            if (entitygroup.monster) {
                viewgroup.monsterview = entitygroup.monster.getView()
            }
            if (entitygroup.land) {
                viewgroup.landview = entitygroup.land.getView()
            }
            if (entitygroup.monsterlord) {
                viewgroup.monsterlordview = entitygroup.monsterlord.getView()
            }
            if (entitygroup.item) {
                viewgroup.itemview = entitygroup.item.getView()
            }
            return viewgroup
        },

        highlighPlaceableInRegion() {
            Tsh.Ddm.View.clearAllHighlight()
            this.highlightPlaceableInList()
            this.highlightNonPlaceableInList()
        },
        clearHighlightPlaceableInRegion(){
            Tsh.Ddm.View.clearAllHighlight()
            this.inputvalue.placeable = []
            this.inputvalue.unplaceable = []
        },
        highlightMoveableInRegion(region) {
            Tsh.Ddm.View.clearAllHighlight()
            var groups = Tsh.Ddm.Entity.getEntityGroupsAtRegion(region)
            this.highlightMoveableInList(groups)
            this.highlightNonMovableInList(groups)
        },

        /**
        * Highlight all the Flat Cell (Empty Cell / Land) in the list
        * @param {EntityGroup[]} list 
        */
        highlightFlatInList(list) {
            var points = []
            var lands = []
            var monsters = []
            var items = []
            for (var i in list) {
                var e = list[i]
                if(!e.point)
                    continue
                if (this.isGroupFlat(e)) {
                    var v = this.getGroupView(e)
                    if (this.isGroupEmpty(e)) {
                        points.push(v.point)
                    } else {
                        lands.push(v.landview)
                        monsters.push(v.monsterview)
                        items.push(v.itemview)
                    }
                }
            }
            Tsh.Ddm.View.highlightBoardView(points)
            Tsh.Ddm.View.highlightLandView(lands)
            Tsh.Ddm.View.highlightMonsterView(monsters)
            Tsh.Ddm.View.highlightItemView(items)
        },

        /**
         * Highlight all the cell and item that can movable (Land/ Monster that can move throguht) in the list
         * @param {EntityGroup[]} list 
         */
        highlightMoveableInList(list) {
            var points = []
            var lands = []
            var monsters = []
            var items = []
            for (var i in list) {
                var e = list[i]
                if(!e.point)
                    continue
                if (this.isGroupMovable(e)) {
                    var v = this.getGroupView(e)
                    if (this.isGroupEmpty(e)) {
                        points.push(v.point)
                    } else {
                        lands.push(v.landview)
                        monsters.push(v.monsterview)
                        items.push(v.itemview)
                    }
                }
            }
            Tsh.Ddm.View.highlightBoardView(points)
            Tsh.Ddm.View.highlightLandView(lands)
            Tsh.Ddm.View.highlightMonsterView(monsters)
            Tsh.Ddm.View.highlightItemView(items)
        },


        /**
         * Highlight all the cell and Item that cannot move throught (Monster/Item/MonsterLord) in the list
         * @param {EntityGroup[]} list 
         */
        highlightNonMovableInList(list) {
            var points = []
            var lands = []
            var monsters = []
            var items = []
            for (var i in list) {
                var e = list[i]
                if(!e.point)
                    continue
                if (this.isGroupNonmovable(e)) {
                    var v = this.getGroupView(e)
                    if (this.isGroupEmpty(e)) {
                        points.push(v.point)
                    } else {
                        lands.push(v.landview)
                        monsters.push(v.monsterview)
                        items.push(v.itemview)
                    }
                }
            }
            Tsh.Ddm.View.highlightBoardView(points)
            Tsh.Ddm.View.highlightLandView(lands)
            Tsh.Ddm.View.highlightMonsterView(monsters)
            Tsh.Ddm.View.highlightItemView(items)
        },

        /**
         * Highlight all the cell and item that can placed Land (Empty Cell) in the list
         * @param {EntityGroup[]} list 
         */
        highlightPlaceableInList() {
            var self = this

            var points = []
            var lands = []
            var monsters = []
            var items = []

            _.each(self.inputvalue.summoning.placeable,function(e){
                var v = self.getGroupView(e)
                if(self.isGroupEmpty(e)){
                    points.push(v.point)
                }else{
                    lands.push(v.landview)
                    monsters.push(v.monsterview)
                    items.push(v.itemview)
                }
            })
            Tsh.Ddm.View.highlightBoardView(points)
            Tsh.Ddm.View.highlightLandView(lands)
            Tsh.Ddm.View.highlightMonsterView(monsters)
            Tsh.Ddm.View.highlightItemView(items)
        },

        /**
         * Highlight all the cell and item that is non-placebale (Monster/Land/Item/MonsterLord) in list
         * @param {EntityGroup[]} list 
         */
        highlightNonPlaceableInList() {
            var self = this 

            var points = []
            var lands = []
            var monsters = []
            var items = []

            _.each(self.inputvalue.summoning.unplaceable,function(e){
                var v = self.getGroupView(e)
                if(self.isGroupEmpty(e)){
                    points.push(v.point)
                }else{
                    lands.push(v.landview)
                    monsters.push(v.monsterview)
                    items.push(v.itemview)
                }
            })

            Tsh.Ddm.View.highlightBoardView(points)
            Tsh.Ddm.View.highlightLandView(lands)
            Tsh.Ddm.View.highlightMonsterView(monsters)
            Tsh.Ddm.View.highlightItemView(items)
        },



        /**
         * Highlight following Mouse
         */
        updatePlayerSummoningInput(){
            var self = this
            var region = Tsh.Ddm.Input.getNearbyAll()
            var groups = Tsh.Ddm.Entity.getEntityGroupsAtRegion(region)

            //Clear previous summoning input value
            self.inputvalue.summoning.placeable = []
            self.inputvalue.summoning.unplaceable = []

            //Check if the list is in Placebale Zone or not
            _.each(groups,function(e){
                if(!e.point){
                    return
                }
                if(!e.point ||self.isGroupPlaceable(e)){
                    self.inputvalue.summoning.placeable.push(e)
                }else{
                    self.inputvalue.summoning.unplaceable.push(e)
                }
            })
            var result = _.filter(self.inputvalue.summoning.placeable,function(e){
                var near     = 
                [
                    [e.point.col,e.point.row - 1],
                    [e.point.col,e.point.row + 1],
                    [e.point.col - 1,e.point.row],
                    [e.point.col + 1,e.point.row]
                ]
                var rest = _.filter(near,function(a){
                    return self.isGroupLand(Tsh.Ddm.Entity.getEntityGroupAt(a[0],a[1]))
                }).length > 0;
                return rest
            }).length > 0

            if(result == false){//If not contain
                self.inputvalue.summoning.unplaceable = self.inputvalue.summoning.unplaceable.concat(self.inputvalue.summoning.placeable)
                self.inputvalue.summoning.placeable = []
            }
        },
        updatePlayerPieceInput(){
            var target = self.inputvalue.piece.target 

            self.inputvalue.piece.walkable = []
            self.inputvalue.piece.nonwalkable = []

            if(target){
                if(target instanceof Monster){

                }else{
                    console.log("[WARNING] target is not Monster")
                }
            }
        },
        async requestUpdatePlayerPool(playerid, contains, unused) {
            var self = this

            var ittemdatas = await Promise.all(_.map(contains, async function (data) {
                var result = await Tsh.Ddm.Blueprint.requestBlueprintMonsterAsync(data)
                var metadata = result.metadata

                var item = {}
                item.kind               = data
                item.name               = _.property("name")(metadata)
                item.available          = !_.contains(unused, data),
                item.portraitimg        = _.property("portraitimg")(metadata)
                item.pieceimg           = _.property("pieceimg")(metadata)
                item.dice               = _.property("dice")(metadata)

                return item
            }))
            if (playerid == Tsh.Ddm.Player.id) {
                Tsh.Ddm.Player.updatePoolAsync(ittemdatas)
            }
        },

        //For Placing Mode
        selectPieceAt(col, row) {
            if (Tsh.Ddm.Entity.outOfBound(col, row)) {
                console.log("[ERROR] Out of Bound ", col, " ", row)
            }
            if (this.selected) {
                Tsh.Ddm.Entity.deselectedEntity(this.selected)
                Tsh.Ddm.View.deselectedView(this.selected.getView())
                Tsh.Ddm.Input.deselectedInput(this.selected)
                this.selected = null
                this.selectedgroup = {}
            }
            var group = Tsh.Ddm.Entity.getEntityGroupAt(col, row)
            this.selectedgroup = group
            this.selected = group.top
            if (selected) {
                Tsh.Ddm.Entity.selectedEntity(this.selected)
                Tsh.Ddm.View.selectedView(this.selected.getView())
                Tsh.Ddm.Input.selectedInput(this.selected)
            }
        },
        deselectedPiece() {
            this.selected = null
            this.selectedgroup = {}
            this.isselecting = false
            Tsh.Ddm.Entity.deselectedEntity(this.selected)
            Tsh.Ddm.View.deselectedView(this.selected.getView())
            Tsh.Ddm.Input.deselectedInput(this.selected)
        },
        
        updateInputSummoningPath(index,rotate){
            var path = []
            if(this.index == index || index == -1){
                if(rotate){
                    this.inputvalue.summoning.rotate = (this.inputvalue.summoning.rotate + 1) % 4
                }
            }else{
                this.inputvalue.summoning.index     = index
                this.inputvalue.summoning.rotate    = 0
            }
            path = getRelativeList(this.inputvalue.summoning.index)
            this.inputvalue.summoning.path = path
            if(this.isSummoningMode()){
                Tsh.Ddm.Input.setNearbyRelative(this.inputvalue.summoning.path)
            }
        },
    }

    return Tsh
})