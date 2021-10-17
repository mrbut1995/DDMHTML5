var Tsh = Tsh || {}
Tsh.Ddm = Tsh.Ddm || {}

Tsh.Ddm.Debug = new function(){
    
    var main = this

    this.debugPieceSelected = null
    this.isSelectingPiece   = false
    this.debugHighlightOnMove = false

    var rot = 0

    this.init = function(){
        DOMBoard.addEventListener("itemclicked" ,onItemClicked,false)
        DOMBoard.addEventListener("boardmousemove" ,onBoardMouseMove,false)

    }
    this.CreatePieceView = function(){
        var lCol = document.getElementById("pieceColId").value
        var lRow = document.getElementById("pieceRowId").value
        lCol = Math.max(lCol,0)
        lRow = Math.max(lRow,0)
        Tsh.Ddm.View.CreatePieceView(new Point(lCol,lRow),{},null,()=>{})
    }
    this.CreateLandView  = function(){
        var pCol = document.getElementById("landColId").value
        var pRow = document.getElementById("landRowId").value
        pCol = Math.max(pCol,0)
        pRow = Math.max(pRow,0)

        Tsh.Ddm.View.CreateLandView(new Point(pCol,pRow),{},null,()=>{})
    }
    this.DestroyedSelectedView = function(){
        
    }
    this.DrawPieceSelectedInfo = function(){

    }
    this.btnSelectPieceClicked = function(){
        if(this.isSelectingPiece){
            this.StopSelectingPiece()
        }else{
            this.StartSelectingPiece()
        }
    }
    this.btnDestroySelectedPiece = function(){
        if(this.debugPieceSelected != null){
            Tsh.Ddm.View.DestroyView(this.debugPieceSelected.uuid)
            this.debugPieceSelected = null
            this.SetSelectingPiece(this.debugPieceSelected)
        }
    }
    this.btnPositionChange = function(){
        if(this.debugPieceSelected == null){
            console.log("DEBUG ERROR")
            return
        }
        var mCol = document.getElementById("moveToCol").value
        var mRow = document.getElementById("moveToRow").value
        mCol = Math.min(Math.max(mCol,0),12)
        mRow = Math.min(Math.max(mRow,0),18)


        Tsh.Ddm.View.MoveView(this.debugPieceSelected.uuid,new Point(mCol,mRow))
    }
    this.btnDisplayActionPopup = function(){

    }
    this.btnRoll = function(){
        roll()
    }
    this.checkBoxHighlight = function(){
        var val = document.getElementById("higlightchecked").checked
        var varRot 

        if(val){
            this.debugHighlightOnMove = true
            Tsh.Ddm.View.StartHighlight();
        }else{
            this.debugHighlightOnMove = false
            Tsh.Ddm.View.StopHighlight();
        }
    }
    this.StartSelectingPiece = function(){
        console.log("started selecting")
        this.isSelectingPiece = true
        document.getElementById("selPieceBtn").innerHTML   = "Stop Selecting"
        document.getElementById("selPieceInfo").innerHTML  = "Selecting"
    }
    this.StopSelectingPiece = function(){
        this.isSelectingPiece = false
        document.getElementById("selPieceBtn").innerHTML   = "Select Piece"
        if(this.debugPieceSelected == null){
            document.getElementById("selPieceInfo").innerHTML  = "None"
        }
    }
    this.SetSelectingPiece = function(piece){
        this.debugPieceSelected = piece
        if(piece != null){
            document.getElementById("selPieceInfo").innerHTML = piece.toString()
        }else{
            document.getElementById("selPieceInfo").innerHTML  = "None"
        }
        this.UpdateSelectingPieceDebugMenu()
    }

    this.UpdateSelectingPieceDebugMenu = function(){
        var html = ''
        if(this.debugPieceSelected != null){
        }
        else{
        }
    }
    this.onSelectedPieceVisibleChanged = function(){
        if(this.debugPieceSelected == null){
            console.log("DEBUG ERROR")
            return
        }

        var val = document.getElementById("pieceVisible").checked

        Tsh.Ddm.View.SetViewProperty(this.debugPieceSelected.uuid,"visible",val)
    }
    this. onSelectedPieceHighlightChanged = function(){
        if(this.debugPieceSelected == null){
            console.log("DEBUG ERROR")
            return
        }

        var val = document.getElementById("pieceHighlight").checked

        Tsh.Ddm.View.SetViewProperty(this.debugPieceSelected.uuid,"highlight",val)
    }
    this. onSelectedPieceFocusChanged = function(){
        if(this.debugPieceSelected == null){
            console.log("DEBUG ERROR")
            return
        }

        var val = document.getElementById("pieceFocus").checked

        Tsh.Ddm.View.SetViewProperty(this.debugPieceSelected.uuid,"focused",val)
    }
    this. onSelectedPiecePositionChanged = function(){
        console.log("onSelectedPiecePositionChanged")

    }

    var onItemClicked = function(opts){
        console.log("debug onItemClicked = ",opts)
        if(main.isSelectingPiece){
            // var uuid = opts.uuid
            // var type = Tsh.Ddm.View.GetViewProperty()
            if(opts.detail.source.type == "piece"){
                main.SetSelectingPiece(opts.detail.source)
            }else{
                main.SetSelectingPiece(null)
            }
            main.StopSelectingPiece()
        }
    }
    var onBoardMouseMove = function(opts){
        if(main.debugHighlightOnMove){
            console.log("===>>HIGHLIGHT")
            var point = Tsh.Ddm.View.GetCanvasMousePoint()
            var lst = pointsFromPattern(point,"TYPE_10",rot)
            Tsh.Ddm.View.Highlight(lst)
        }
    }

}