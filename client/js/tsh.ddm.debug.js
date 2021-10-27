
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
                .append('<button id = "selPieceBtn" id="dbSelectPiece" class="button">Select Piece</button><br>')
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
                                        )
                                        .append('<div class="action"><label>Destroy</label><button class="button" id="dbPieceDestroy">Destory Object</button></div>	')
                                        .append('<div class="action"><label>Display Action Popup</label><button class="button" id="dbDisplayAction">Display</button></div>	')
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
                .append('<button class="button">Roll Dice</button>')
                .appendTo('#devActions')

            $('<div></div>').addClass('action')
                .append('<input id= "higlightchecked" type="checkbox">Highlight on Move</button>')
                .appendTo('#devActions')

        }
        this.init = function () {
            var DOMBoard = Tsh.Ddm.View.getDOM("board")
            this.CreateDebugDOM()
            DOMBoard.addEventListener("itemclicked", onItemClicked, false)
            DOMBoard.addEventListener("boardmousemove", onBoardMouseMove, false)
    
            $("#dbCreateLand").click(this.createViewLand.bind(this))
            $("#dbCreatePiece").click(this.createViewMonster.bind(this))
            $("#dbSelectPiece").click(this.btnSelectPieceClicked.bind(this))
            $("#pieceHighlight").click(this.onSelectedPieceHighlightChanged.bind(this))
            $("#pieceFocus").click(this.onSelectedPieceFocusChanged.bind(this))
            $("#pieceVisible").click(this.onSelectedPieceVisibleChanged.bind(this))
            $("#dbPieceChangePosition").click(this.btnPositionChange.bind(this))
            $("#dbPieceDestroy").click(this.btnDestroySelectedPiece.bind(this))
            $("#dbDisplayAction").click(this.btnDisplayActionPopup.bind(this))

        }
        this.createViewMonster = function () {
            console.log("createViewMonster")
            var lCol = document.getElementById("pieceColId").value
            var lRow = document.getElementById("pieceRowId").value
            lCol = Math.max(lCol, 0)
            lRow = Math.max(lRow, 0)

            var data = []
            data[0] = "DummyMonster1"
            data[1] = uuid()
            data[2] = lCol
            data[3] = lRow
            data[4] = ""
            data[5] = "player1"
            data[6] = "playe2"

            Tsh.Ddm.Client.receiveSpawnEntity(data)
        }
        this.createViewLand = function () {
            console.log("createViewLand")
            var pCol = document.getElementById("landColId").value
            var pRow = document.getElementById("landRowId").value
            pCol = Math.max(pCol, 0)
            pRow = Math.max(pRow, 0)
        }
        this.DestroyedSelectedView = function () {
            console.log("DestroyedSelectedView")

        }
        this.DrawPieceSelectedInfo = function () {
            console.log("DrawPieceSelectedInfo")

        }
        this.btnSelectPieceClicked = function () {
            console.log("btnSelectPieceClicked")
            if (this.isSelectingPiece) {
                this.StopSelectingPiece()
            } else {
                this.StartSelectingPiece()
            }
        }
        this.btnDestroySelectedPiece = function () {
            console.log("btnDestroySelectedPiece")
            if (this.debugPieceSelected != null) {
                Tsh.Ddm.View.destroyView(this.debugPieceSelected.id)
                this.debugPieceSelected = null
                this.SetSelectingPiece(this.debugPieceSelected)
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
    
        }
        this.btnDisplayActionPopup = function () {
            console.log("btnDisplayActionPopup")
        }
        this.btnRoll = function () {
            // roll()
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
        this.StartSelectingPiece = function () {
            console.log("started selecting")
            this.isSelectingPiece = true
            document.getElementById("selPieceBtn").innerHTML = "Stop Selecting"
            document.getElementById("selPieceInfo").innerHTML = "Selecting"
        }
        this.StopSelectingPiece = function () {
            this.isSelectingPiece = false
            document.getElementById("selPieceBtn").innerHTML = "Select Piece"
            if (this.debugPieceSelected == null) {
                document.getElementById("selPieceInfo").innerHTML = "None"
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
            console.log("onSelectedPiecePositionChanged")
    
        }
    
        var onItemClicked = function (opts) {
            console.log("debug onItemClicked = ", opts)
            if (Tsh.Ddm.Debug.isSelectingPiece) {
                if (opts.detail.source.type == "piece") {
                    Tsh.Ddm.Debug.SetSelectingPiece(opts.detail.source)
                } else {
                    Tsh.Ddm.Debug.SetSelectingPiece(null)
                }
                Tsh.Ddm.Debug.StopSelectingPiece()
            }
        }
        var onBoardMouseMove = function (opts) {
            if (Tsh.Ddm.Debug.debugHighlightOnMove) {
            }
        }
    
    }
})