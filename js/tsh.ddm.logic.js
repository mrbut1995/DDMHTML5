define(function(){
    console.log("LOAD TSH.DDM.LOGIC")
// var Tsh = Tsh || {}
    Tsh.Ddm = Tsh.Ddm || {}


let Player = function(){

}
let Piece  = function(){

}
let Land   = function(){
    
}

Tsh.Ddm.Model = new function(){
    this.pieces = []
    this.lands  = []
    this.players = []

}

Tsh.Ddm.Logic = new function(){
    this.isPointInBound = function(point){
        return (point && point.row <= Config.boardRow  && point.row >= 0 
                        && point.col <= Config.boardCol && point.col >= 0)
    }
    this.CreateLand = function(){}
    this.CreatePiece = function(){}
    this.Roll = function(){}
}

Tsh.Ddm.Game = new function(){    
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
})