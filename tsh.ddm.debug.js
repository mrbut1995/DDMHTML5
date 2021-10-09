var Tsh = Tsh || {}
Tsh.Ddm = Tsh.Ddm || {}

Tsh.Ddm.Debug = new function(){
    
    var main = this

    this.debugPieceSelected = null
    this.isSelectingPiece   = false

    this.init = function(){
        DOMBoard.addEventListener("itemclicked" ,onItemClicked,false)

    }
    this.CreatePieceView = function(){
        var lCol = document.getElementById("pieceColId").value
        var lRow = document.getElementById("pieceRowId").value

        console.log("create piece (",lCol,",",lRow,")")
    }
    this.CreateLandView  = function(){
        var pCol = document.getElementById("landColId").value
        var pRow = document.getElementById("landRowId").value

        console.log("create land (",pCol,",",pRow,")")
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
        }
        this.UpdateSelectingPieceDebugMenu()
    }
    this.UpdateSelectingPieceDebugMenu = function(){
        var html = ''
        if(this.debugPieceSelected != null){
            // document.getElementById("selectedPieceController").innerHTML = html
        }
        else{
            // document.getElementById("selectedPieceController").innerHTML = ""
        }
    }
    this.onSelectedPieceVisibleChanged = function(){
        console.log("onSelectedPieceVisibleChanged")
    }
    this. onSelectedPieceHighlightChanged = function(){
        console.log("onSelectedPieceHighlightChanged")
    }
    this. onSelectedPiecePositionChanged = function(){
        console.log("onSelectedPiecePositionChanged")

    }
    this. onSelectedPieceFocusChanged = function(){
        console.log("onSelectedPieceFocusChanged")

    }
    this. onSelectedPiecePositionChanged = function(){
        console.log("onSelectedPiecePositionChanged")

    }
    this. onSelectedPieceDestroyChanged = function(){
        console.log("onSelectedPieceDestroyChanged")

    }

    var onItemClicked = function(opts){
        if(main.isSelectingPiece){
            console.log("opts = ",opts.detail.source.type)
            if(opts.detail.source.type == "piece"){
                main.SetSelectingPiece(opts.detail.source)
            }else{
                main.SetSelectingPiece(null)
            }
            main.StopSelectingPiece()
        }
    }
}