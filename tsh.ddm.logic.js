var Tsh = Tsh || {}
Tsh.Ddm = Tsh.Ddm || {}

let BoardModel = function(){
    this.pieces = []
    this.lands  = []
    
    this.GetLandAt = function(point){}
    this.GetPieceAt = function(point){}
    this.SetLandAt  = function(point,item){}
    this.SetPieceAt = function(point,item){}
}

Tsh.Ddm.Logic = new function(){
    this.isPointInBound = function(point){
        return (point && point.row <= Config.boardRow  && point.row >= 0 
                        && point.col <= Config.boardCol && point.col >= 0)
    }
    this.CreateLand = function(){}
    this.CreatePiece = function(){}
}
Tsh.Ddm.Game = new function(){
    this.model = new BoardModel()
    
    this.players = []
    this.activeCreature = {
        uuid:0
    }
    this.matchid = null
    this.playerReady = null
    this.currentPlayer = null
    this.state = Constants.GameState.INITIALIZED
    
    //Match
    this.match = {}
    this.gameplay = {}
    this.configMatch = {}
    this.turn = 0

    //Pausing
    this.pause = false
    this.pauseTime = 0

    //Sever Online
    this.session =null
    this.client = null
    this.connect = null
    this.multiplayer = false

    //Resource
    this.resSoundEffect = [

    ]

    this.dataLoaded = function(data){
    }

    this.loadResource = function(){
        //Load Image
    }

    this.reset = function(){

    }
}