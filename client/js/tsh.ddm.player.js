define(["ddm"],function(Tsh){
    Tsh.Ddm.Player = {
       init(app){
           this.id = ""
           this.name = ""
           this.contain = []
           this.crests =  {
                attack :  0,
                defend :  0,
                movement: 0,
                summon:   0,
                magic:    0,
                trap:     0
           }

           this.avatar = null
           this.avatarSource = ""
           this.lp = 0

           this.isActive     = true
           this.isLose       = false
           this.isConnect    = false
           
           this.isCurrentTurn = false

           this.isSummoning = false
           this.isRolling   = false
           this.isMoving    = false
           
           this.selectedMonster   = null
           this.selectedEntityGroup = null
           
           this.controlmonster    = {}
           this.controlland       = {}
           this.movablemonster    = {}
           this.monsterlord       = null

           this.app = app
           if(this._onInitialized){
               this._onInitialized()
           }
       },
       /**
        * Get value of crest
        * @param {string} name name of crest user want to get
        * @returns value of crest user want to get
        */
       getCrest(name){
          if(name in this.crests){
               return this.crests[name]
          }else{
               return -1
          }
       },

       /**
        * Set Value of crest
        * @param {string} name  Name of Crest user want set
        * @param {number} value Value want to set to crest
        */
       setCrest(name,value){
          if(name in this.crests){
               this.crests[name] = value
          }
       },

       getCrests(){
          return this.crests;
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
       selected(monster){
            
       },
       assignMonster(monster){
        
       },
       resignMonster(monster){

       },
       assignLand(land){

       },
       resignLand(land){

       },
       getControlMonsters(){
            return this.controlmonster
       },
       getControlLands(){
            return this.controlland
       },

       displayAvatar(){
          
       },
       displayCrestInfo(){

       },
       displaySelectionEntity(){

       },
       displayPlayerPool(){

       },

       //Signal
       onLoaded         (callback) {this._onLoaded              = callback},
       onActive         (callback) {this._onActive              = callback},
       onDeactive       (callback) {this._onDeactive            = callback},
       onLose           (callback) {this._onLose                = callback},
       onConnected      (callback) {this._onConnected           = callback},
       onDeclareEndPhase(callback) {this._onDeclareEndPhase     = callback},
       onCrestsChanged  (callback) {this._onCrestChanged        = callback},

       onSelectedMonster(callback) {this._onSelectedMonster     = callback},
       onDeselectedMonster(callback){this._onDeselectedMonster  = callback},
       onInitialized   (callback){this._onInitialized = callback},
     }
})