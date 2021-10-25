define(["ddm"],function(Tsh){
    Tsh.Ddm.Player = {
       init(){
           this.id = ""
           this.isActive     = true
           this.isLose       = false
           this.isConnect    = false
       },

       //Signal
       onActive         (callback) {this._onActive          = callback},
       onLose           (callback) {this._onLose            = callback},
       onConnected      (callback) {this._onConnected       = callback},
       onDeclareEndPhase(callback) {this._onDeclareEndPhase = callback},
    }
})