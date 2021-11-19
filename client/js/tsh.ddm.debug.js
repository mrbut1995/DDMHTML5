
var landDebugData = [
    [0,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,0,1,1,1,0,0,0,0],
    [0,0,0,1,0,0,1,0,1,0,0,0,0],
    [0,0,0,1,0,0,1,0,1,0,0,0,0],
    [0,0,0,1,1,1,1,0,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,1,0,1,1,1,0,0,0,0],
    [0,0,0,0,1,0,1,1,1,0,0,0,0],
    [0,0,0,0,1,0,1,0,0,0,0,0,0],
    [0,0,1,1,1,1,1,0,0,0,0,0,0],
    [0,0,1,0,0,1,1,0,0,0,0,0,0],
    [0,0,1,0,0,0,1,0,0,0,0,0,0],
    [0,0,1,0,0,0,1,0,0,0,0,0,0],
    [0,0,1,1,1,1,1,0,0,0,0,0,0]
]

var monsterDebugData = [
    [0,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,0]
]
var player1debug = {
    id:"player1",
    name:"Player 1",
    pool :           ["dummymonster1","dummymonster2","dummymonster4","dummymonster6","dummymonster8","dummymonster10"],
    unavailablepool :["dummymonster2","dummymonster4"]
}
var player2debug = {
    id:"player2",
    name:"Player 2",
}
var isLoaded = false;

define(["ddm","jquery"],function(Tsh,$){    
    Tsh = Tsh || {}
    Tsh.Ddm = Tsh.Ddm || {}

    Tsh.Ddm.Debug = new function () {
    
    
        this.debugPieceSelected = null
        this.isSelectingPiece = false
        this.debugHighlightOnMove = false
        var rot = 0
        this.CreateDebugDOM = function(){
            var pieceDebugDOM = document.createElement('div');
            $(pieceDebugDOM)
                .append('<div>Piece View Changing</div>')
                .append('<label for="selPieceInfo">Piece:</label><div id = "selPieceInfo">None</div>')
                .append(
                    $('<div id="selectedPieceController"></div>')
                        .append(
                            $('<span id="toggleLink">[Toggle Property Tools]</span>')
                                .addClass('link')
                                .click(function(){$('#devPiecePropertyTools').slideToggle()})
                            )
                        .append(
                            $('<div id="devPiecePropertyTools"></div>')
                                .append(
                                    $('<ul id="devPiecePropertyAction"></ul>')
                                        .append('<div class="action"><label>Highlight:</label><input type="checkbox" id="pieceHighlight"></div>')
                                        .append('<div class="action"><label>Focus:</label><input type="checkbox" id="pieceFocus"></div>	')
                                        .append('<div class="action"><label>Visible:</label><input type="checkbox" id="pieceVisible"></div>	')
                                        .append(
                                            $('<div class="action"></div>')
                                                .append('<label>Position:</label>')
                                                .append('<span><label for="moveToCol">Col:</label><input type="number" id="moveToCol" class = "coord_input"></span>')
                                                .append('<span><label for="moveToRow">Row:</label><input type="number" id="moveToRow" class = "coord_input"></span>')
                                                .append('<span><button class="button" id="dbPieceChangePosition"> Move To </button></span>')
                                        )
                                        .append('<div class="action"><label>Destroy</label><button class="button" id="dbPieceDestroy">Destory Object</button></div>	')
                                        .append('<div class="action"><label>Display Action Popup</label><button class="button" id="dbDisplayAction">Display</button></div>	')
                                        .append(
                                            $('<div></div>').addClass('action').append('<button class="button" id="dbAttack">Attack</button>')
                                        )                
                                )
                        )
                )

            $('<ul id="devActions"></ul>')
                .appendTo('#devTools')

            $('<div></div>').addClass('action')
                .append('<span><button class="button" id="dbCreateLand"> Create Land View </button></span>')
                .append('<span><label for="landColId">Col:</label><input type="number" id="landColId" class = "coord_input" name="landColId"></span>')
                .append('<span><label for="landRowId">Row:</label><input type="number" id="landRowId" class = "coord_input" name="landRowId"></span>')

                .appendTo('#devActions')
            $('<div></div>').addClass('action')
                .append('<button class="button"  id="dbCreatePiece" >Create Piece View</button>')
                .append('<span><label for="pieceColId">Col:</label><input type="number" id="pieceColId" class = "coord_input" name="pieceColId"></span>')
                .append('<span><label for="pieceRowId">Row:</label><input type="number" id="pieceRowId" class = "coord_input" name="pieceRowId"></span>')

                .appendTo('#devActions')
            $('<div></div>').addClass('action')
                .append(pieceDebugDOM)
                .appendTo('#devActions')

            $('<div></div>').addClass('action')
                .append('<button class="button" id = "btnRollDice">Roll Dice</button>')
                .appendTo('#devActions')

                
            $('<div></div>').addClass('action')
                .append('<button class="button" id="dbSendFakeData">Send Fake Data</button>')
                .appendTo('#devActions')

             $('<div></div>').addClass('action')
                .append('<button class="button" id="dbSendCurrentData">Send Current Data</button>')
                .appendTo('#devActions')

            $('<div></div>').addClass('action')
                .append(
                    $('<select id="inputMode"></select>').attr("size","3")
                        .append($('<option value="val1">Rolling</option>'))
                        .append($('<option value="val2">Summoning</option>'))
                        .append($('<option value="val3">Dice Selecting</option>'))
                        .append($('<option value="val4">Piece</option>'))
                        .append($('<option value="val5">Main Mode</option>'))
                )
                .appendTo('#devActions')

            $('<div></div>').addClass('action')
                .append('<input id= "higlightchecked" type="checkbox">Highlight on Move</button>')
                .appendTo('#devActions')

        }
        this.init = function (app) {
            this.CreateDebugDOM()
    
            var self = this
            $("#dbCreateLand").click(this.createViewLand.bind(this))
            $("#dbCreatePiece").click(this.createViewMonster.bind(this))
            $("#pieceHighlight").click(this.onSelectedPieceHighlightChanged.bind(this))
            $("#pieceFocus").click(this.onSelectedPieceFocusChanged.bind(this))
            $("#pieceVisible").click(this.onSelectedPieceVisibleChanged.bind(this))
            $("#dbPieceChangePosition").click(this.btnPositionChange.bind(this))
            $("#dbPieceDestroy").click(this.btnDestroySelectedPiece.bind(this))
            $("#dbDisplayAction").click(this.btnDisplayActionPopup.bind(this))
            $("#dbSendFakeData").click(this.sendList.bind(this))
            $("#dbSendCurrentData").click(this.sendCurrentList.bind(this))
            $("#dbAttack").click(this.btnSelectedPieceAttack.bind(this))
            $("#btnRollDice").click(this.btnRoll.bind(this))
            $("#inputMode").change(function(ev){
                var val = $(this).val()
                if(val == "val1"){
                    Tsh.Ddm.Game.endSummoningMode()
                    Tsh.Ddm.Game.startRollingMode()
                    Tsh.Ddm.Game.endPieceInputMode()
                    Tsh.Ddm.Game.endDiceSelectingMode()
                    Tsh.Ddm.Game.endMainMode()
                }else if(val == "val2"){
                    Tsh.Ddm.Game.startSummoningMode()
                    Tsh.Ddm.Game.endRollingMode()
                    Tsh.Ddm.Game.endPieceInputMode()
                    Tsh.Ddm.Game.endDiceSelectingMode()
                    Tsh.Ddm.Game.endMainMode()
                }else if(val == "val3"){
                    Tsh.Ddm.Game.endSummoningMode()
                    Tsh.Ddm.Game.endRollingMode()
                    Tsh.Ddm.Game.endPieceInputMode()
                    Tsh.Ddm.Game.startDiceSelectingMode()
                    Tsh.Ddm.Game.endMainMode()
                }else if(val == "val4"){
                    Tsh.Ddm.Game.endSummoningMode()
                    Tsh.Ddm.Game.endRollingMode()
                    Tsh.Ddm.Game.startPieceInputMode()
                    Tsh.Ddm.Game.endDiceSelectingMode()
                    Tsh.Ddm.Game.endMainMode()
                }else if(val == "val5"){
                    Tsh.Ddm.Game.endSummoningMode()
                    Tsh.Ddm.Game.endRollingMode()
                    Tsh.Ddm.Game.endPieceInputMode()
                    Tsh.Ddm.Game.endDiceSelectingMode()
                    Tsh.Ddm.Game.startMainMode()
                }
                Tsh.Ddm.Game.updateRollingDiceScreen()
                Tsh.Ddm.Game.updateSummoningScreen() 
                Tsh.Ddm.Game.updateDiceSelectingScreen()
                Tsh.Ddm.Game.updatePieceInputModeScreen()
                Tsh.Ddm.Game.updateMainModeScreen()                          
            })
        }
        this.debugConnection = function(){
            Tsh.Ddm.Client.enable()
            Tsh.Ddm.Debug.loadPrefabData()
            var debugClientConnectionHandle = {
                readyState : 1,
                send : function(msg){
                    if(debugSeverConnectionHandle.onmessage){
                        debugSeverConnectionHandle.onmessage(msg)
                    }
                },
    
                onopen      : null,
                onmessage   : null,
                onerror     : null,
                onclose     : null,
            }
    
            var debugSeverConnectionHandle = {
                readyState : 1,
                send : function(msg){
                    if(debugClientConnectionHandle.onmessage){
                        var e = {}
                        e.data = msg
                        debugClientConnectionHandle.onmessage(e)
                    }
                },

                onopen      : null,
                onmessage   : function(msg){
                    Tsh.Ddm.Debug.receiveMessage(msg)
                },
                onerror     : null,
                onclose     : null,
            }

            Tsh.Ddm.Client.connection = debugClientConnectionHandle;
            Tsh.Ddm.Client.enable()
            Tsh.Ddm.Client.receiveWelcome([Messages.WELCOME,player1debug.id, player1debug.name, player1debug.pool, "", "3", "[0,0,0,0,0]", "M00001"])
        
            this.connection = debugSeverConnectionHandle
        }
        this.entityData = {}
        this.sendPool = function(playerid,pool,unusedpool){
            console.log("sendPool")
            var data = []
            data[0] = Messages.POOL 
            data[1] = playerid
            data[2] = pool
            data[3] = unusedpool
            this.connection.send(JSON.stringify(data))
        },
        this.sendRollResult = function(playerid,roll1,roll2,roll3){
            var data = []
            data[0] = Messages.ROLL
            data[1] = playerid
            data[2] = roll1
            data[3] = roll2
            data[4] = roll3
            this.connection.send(JSON.stringify(data))
        },
        this.sendCreateEntity   = function(id,kind,col,row,name,controller){
            var data = []
            data[0] = Messages.SPAWN
            data[1] = kind
            data[2] = id
            data[3] = col
            data[4] = row
            data[5] = name
            data[6] = controller
            data[7] = "player2"
            this.connection.send(JSON.stringify(data))
        }
        this.sendMoveTo = function(toCol,toRow){
            var data = []
            data[0] = Messages.MOVE
            data[1] = ""
            data[2] = this.debugPieceSelected.id
            data[3] = toCol
            data[4] = toRow
            data[5] = "walk"
            this.connection.send(JSON.stringify(data))
        }
        this.sendDestroy = function(){
            var data = []
            data[0] = Messages.DESPAWN
            data[1] = ""
            data[2] = this.debugPieceSelected.id 
            this.connection.send(JSON.stringify(data))
        }
        this.sendAttack = function(selectedid,targetid){
            var data = []
            data[0] = Messages.ATTACK
            data[1] = selectedid
            data[2] = targetid
            this.connection.send(JSON.stringify(data))
        }
        this.sendList = function(){
            var data = []
            data[0] = Messages.LIST
            for(var i in Object.keys(this.entityData)){
                data.push(this.entityData[Object.keys(this.entityData)[i]].id)
            }
            console.log("send fake data ",data)
            this.connection.send(JSON.stringify(data))
        }
        this.sendCurrentList = function(){
            var data = []
            data[0] = Messages.LIST
            for(var i in Object.keys(this.entityData)){
                data.push(this.entityData[Object.keys(this.entityData)[i]].id)
            }
            console.log("send fake data ",data)
            this.connection.send(JSON.stringify(data))
        },
        this.receiveMessage = function(msg){
            var data = JSON.parse(msg)
            var id = data[0]
            if(id == Messages.WHO){
                data.shift()
                this.handleSpawnEntity(data)
            }else if(id == Messages.QUERY){
                this.sendPool(player1debug.id,player1debug.pool,player1debug.unavailablepool)
            }else if(id == Messages.ROLL){
                this.sendRollResult(player1debug.id,Math.floor(Math.random() * 6),Math.floor(Math.random() * 6),Math.floor(Math.random() * 6))
            }else if(id == Messages.SPAWN){
                var kind = data[1],
                    type = data[2],
                    col  = data[3],
                    row  = data[4],
                    controllerid = data[5],
                    target = data[6]

                var eId = entityId()

                this.entityData[eId] = {
                    id : eId + "",
                    type : kind,
                    col  : col,
                    row  : row,
                    name : "Receive Message Monster "+id,
                    controllerid : controllerid
                }
                this.sendCreateEntity(eId,kind,col,row,this.entityData[eId].name,controllerid)
                console.log("Add to Database = ",this.entityData[eId])
            }
        },
        this.handleSpawnEntity = function(data){
            console.log("handleSpawnEntity")
            for(var i in data){
                var e = this.entityData[data[i]]
                if(e){
                    var kind = e.type,
                        id   = e.id,
                        col  = e.col,
                        row  = e.row,
                        controllerid = e.controllerid,
                        name = e.name
                    this.sendCreateEntity(id,kind,col,row,name,controllerid)
                }
            }
        },
        this.loadPrefabData = function(){
            const col = 13
            const row = 19
            this.entityData = {}
            mId = 0
            for(var i = 0; i < row;i++){
                for(var j= 0; j <col;j++){
                    if(landDebugData[i][j] == 1){
                        var eId = entityId()
                        this.entityData[eId] = {
                                        id  : eId + "",
                                        type: "NormalLand",
                                        col : j,
                                        row : i,
                                        name: "Debug Prefab Land "+eId, 
                                        controllerid : (i + j) % 2 == 0 ? player1debug.id : player2debug.id
                                    }
                    }
                    if(monsterDebugData[i][j] == 1){
                        var eId = entityId()
                        this.entityData[eId] = {
                                        id  : eId + "",
                                        type: "dummymonster1",
                                        col : j,
                                        row : i,
                                        name: "Debug Prefab Monster "+eId, 
                                        controllerid : (i + j) % 2 == 0 ? player1debug.id : player2debug.id
                                    }
                    }
                }
            }
        },
        this.createViewMonster = function () {
            console.log("createViewMonster")
            var lCol = document.getElementById("pieceColId").value
            var lRow = document.getElementById("pieceRowId").value
            lCol = Math.max(lCol, 0)
            lRow = Math.max(lRow, 0)
            var id = entityId()
            this.sendCreateEntity(id,"dummymonster1",lCol,lRow,"Debug Spawning Monster"+id,player1debug.id)
        }
        this.createViewLand = function () {
            console.log("createViewLand")
            var pCol = document.getElementById("landColId").value
            var pRow = document.getElementById("landRowId").value
            pCol = Math.max(pCol, 0)
            pRow = Math.max(pRow, 0)

            this.sendCreateEntity(entityId(),"NormalLand",pCol,pRow,"Debug Spawning Land"+id,player1debug.id)
        }

        this.btnDestroySelectedPiece = function () {
            console.log("btnDestroySelectedPiece")
            if (this.debugPieceSelected != null) {
                this.sendDestroy()
                this.debugPieceSelected = null
                this.SetSelectingPiece(this.debugPieceSelected)
            }
        }
        this.btnSelectedPieceAttack = function () {
            console.log("btnDestroySelectedPiece")
            if (this.debugPieceSelected != null) {
                this.debugPieceSelected.attack(1)
            }
        }
        this.btnPositionChange = function () {
            console.log("btnPositionChange")
            if (this.debugPieceSelected == null) {
                console.log("DEBUG ERROR")
                return
            }
            var mCol = document.getElementById("moveToCol").value
            var mRow = document.getElementById("moveToRow").value
            mCol = Math.min(Math.max(mCol, 0), 12)
            mRow = Math.min(Math.max(mRow, 0), 18)
            this.sendMoveTo(mCol,mRow)
        }
        this.btnDisplayActionPopup = function () {
            console.log("btnDisplayActionPopup")
        }
        this.btnRoll = function () {
            Tsh.Ddm.Game.roll()
        }
        
        this.checkBoxHighlight = function () {
            var val = document.getElementById("higlightchecked").checked
            var varRot
    
            if (val) {
                this.debugHighlightOnMove = true
            } else {
                this.debugHighlightOnMove = false
            }
        }
        this.SetSelectingPiece = function (piece) {
            this.debugPieceSelected = piece
            if (piece != null) {
                document.getElementById("selPieceInfo").innerHTML = piece.toString()
            } else {
                document.getElementById("selPieceInfo").innerHTML = "None"
            }
            this.UpdateSelectingPieceDebugMenu()
        }
    
        this.UpdateSelectingPieceDebugMenu = function () {
            var html = ''
            if (this.debugPieceSelected != null) {
            }
            else {
            }
        }
        this.onSelectedPieceVisibleChanged = function () {
            if (this.debugPieceSelected == null) {
                console.log("DEBUG ERROR")
                return
            }
    
            var val = document.getElementById("pieceVisible").checked
    
        }
        this.onSelectedPieceHighlightChanged = function () {
            if (this.debugPieceSelected == null) {
                console.log("DEBUG ERROR")
                return
            }
    
            var val = document.getElementById("pieceHighlight").checked
    
        }
        this.onSelectedPieceFocusChanged = function () {
            if (this.debugPieceSelected == null) {
                console.log("DEBUG ERROR")
                return
            }
    
            var val = document.getElementById("pieceFocus").checked
    
        }
        this.onSelectedPiecePositionChanged = function () {
        }
        this.mouseClicked = function(mouse){}
        this.onMonsterClickedDebug = function(monster){
            console.log("monster =",monster," this.debugPieceSelected ",this.debugPieceSelected," this.debugPieceSelected == monster",this.debugPieceSelected == monster)
            if(monster == this.debugPieceSelected){
                Tsh.Ddm.Debug.SetSelectingPiece(null)
            }else{
                Tsh.Ddm.Debug.SetSelectingPiece(monster)
            }
        }
        this.onCanvasHoverDebug = function(mouse){
        }
    }
})