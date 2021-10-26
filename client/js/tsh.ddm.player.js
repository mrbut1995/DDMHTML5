define(["ddm"],function(Tsh){
    Tsh.Ddm.Player = {
       init(){
           this.id = ""
           this.name = ""
           this.contain = []
           this.crests = {}
           this.avatar = null
           this.avatarSource = ""
           this.lp = lp

           this.isActive     = true
           this.isLose       = false
           this.isConnect    = false
           
           this.isCurrentTurn = false

           this.isSummoning = false
           this.isRolling   = false
           
       },

       getAvatar(){

       },
       getAvatarSource(){

       },
       setAvatarSource(src){
            this.avatar = avatar;
       },
       active(){
            this.isActive = true
            if(this._onActive){
                this._onActive()
            }
       },
       deactive(){
            this.isActive = false
            if(this._onDeactive){
                this._onDeactive()
            }
       },
       getIsActive(){
            return this.isActive
       },
       toggleActive(){
            if(this.getIsActive()){
                this.deactive()
            }else{
                this.active()
            }
       },


       //Signal
       onActive         (callback) {this._onActive          = callback},
       onDeactive       (callback) {this._onDeactive        = callback},
       onLose           (callback) {this._onLose            = callback},
       onConnected      (callback) {this._onConnected       = callback},
       onDeclareEndPhase(callback) {this._onDeclareEndPhase = callback},
       onCrestsChanged  (callback) {this._onCrestChanged    = callback},
    }
})