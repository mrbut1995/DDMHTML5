/**
 * @typedef {object}  PoolItemView
 * @property {string} name
 * @property {bool}   available
 * @property {bool}   selected
*/
/**
 * @typedef    {object}                      PoolViewData
 * @property   {Map<string::PoolItemView>}   items
 * @property   {bool}                        displayRoll
 */


define(["ddm"],function(Tsh){
     Tsh.Ddm.Player = {
       init(app){
           this.id = ""
           this.name = ""

           
           this.pool         = []
           this.unavailable  = []
           this.selectedpool = []

           this.fullpool     = {}

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

           this.resolvedMonster   = {}

           //Player Action
           this.player_actions = {
               roll           : {
                    available : true
               },
               diceselection  : {
                    available : true
               },
               summoning      : {
                    available : true
               },
               piece          : {
                    available  : true
               },                   
          }

           this.app = app
           if(this._onInitialized){
               this._onInitialized()
           }
       },
       /**
        * Get value of crest
        * @param   {string} name name of crest user want to get
        * @returns {number} value of crest user want to get
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

       allowedActionRoll(){
          return this.player_actions.roll.available
       },
       allowedSelectionDice(){
          return this.player_actions.diceselection.available
       },
       allowedSummoning(){
          return this.player_actions.diceselection.available
       },
       allowedPieceAction(){
          return this.player_actions.piece.available
       },

       resetAllowedActionRoll(){
          this.player_actions.roll.available = true
       },
       resetAllowedSelectionDice(){
          this.player_actions.diceselection.available = true
       },
       resetAllowedSummoning(){
          this.player_actions.summoning.available = true
       },
       resetAllowedPieceAction(){
          this.player_actions.piece.available = true
       },

       notAllowedActionRoll(){
          this.player_actions.roll.available = false
       },
       notAllowedSelectionDice(){
          this.player_actions.diceselection.available = false
       },
       notAllowedSummoning(){
          this.player_actions.summoning.available = false
       },
       notAllowedPieceAction(){
          this.player_actions.piece.available = false
       },

       actionablePieces(){
          if(this.notAllowedPieceAction()){
               return []
          }
       },

       rolling(){
          return this.isRolling
       },
       startedRolling(){
          this.isRolling = true
       },
       endRolling(){
          this.isRolling = false
       },
       reset(){

       },
       clear(){

       },
       updatePlayerPool(pool,unused){
          this.pool           = [...pool]
          this.unavailable    = [...unused]
          this.selectedpool   = []

          this.updateFullPool()
          //Cloning data to pass Async function in case of multiple request update Player Pool
          Tsh.Ddm.View.updatePlayerPoolViewAsync(this.getFullPool())
       },
       updateFullPool(){
          this.fullpool = {}
          for(var i = 0;i < this.pool.length;i++ ){
               var item = {
                    name      : this.pool[i],
                    available : !this.unavailable.includes(this.pool[i]),
                    selected  : this.selectedpool.includes(this.pool[i])
               }
               this.fullpool[item.name] = item
          }
       },
       getPoolItemAt(index){
          return deepCopy(this.pool[index])
       },
       getPool(){
          return this.pool.map( a => {return {...a}})
       },
       getFullPool(){
          return deepCopy(this.fullpool)
       },

       selectPoolItem(index){
          if(index < 0 || index > this.pool.length){
               console.log("[ERROR] Out of Bound")
               return
          }
          var isAvailable = !this.unavailable.includes(this.pool[index])
          if(! this.selectedpool.includes(this.pool[index]) && isAvailable){
               this.selectedpool.push(this.pool[index])
               this.selectedpool.length = Math.min(3,this.selectedpool.length)
          }else{
               
          }
          this.updateFullPool()
          if(this._onSelectedPool){
               this._onSelectedPool()
          }
          Tsh.Ddm.View.updatePlayerPoolViewAsync(this.getFullPool())
       },
       deselectPoolItem(index){
          if(index < 0 || index > this.pool.length){
               console.log("[ERROR] Out of Bound")
               return
          }
          for(var i = 0 ;i < this.selectedpool.length;i++){
               if(this.selectedpool[i] == this.pool[index]){
                    this.selectedpool.splice(i,1)
               }
          }
          this.updateFullPool()
          if(this._onSelectedPool){
               this._onSelectedPool()
          }
          Tsh.Ddm.View.updatePlayerPoolViewAsync(this.getFullPool())
       },
       containSeletectPoolItem(index){
          return this.selectedpool.includes(this.pool[index])
       },
       isDoneSelected(){
          return this.selectedpool.length >= 3
       },
       toggleSelectedPoolItem(index){
          if(index < 0 || index > this.pool.length){
               console.log("[ERROR] Out of Bound")
               return
          }
          if(this.containSeletectPoolItem(index)){
               console.log("deselected")
               this.deselectPoolItem(index)
          }else{
               console.log("selected")
               this.selectPoolItem(index)
          }
       },
       deselectAllPoolItem(){
          this.selectpool = []
          this.updateFullPool()
          Tsh.Ddm.View.updatePlayerPoolViewAsync(this.getFullPool())
       },

       /**
        * Player Action Handle
        */


       playerDisplayDicePool(){
          if(this.allowedSelectionDice() && !Tsh.Ddm.View.isDicePoolPopupDisplay()){
               Tsh.Ddm.View.displayDicePool()
          }
       },
       playerHideDicePool(){
          if(Tsh.Ddm.View.isDicePoolPopupDisplay()){
               Tsh.Ddm.View.hideDicePool()
          }
       },
       
       playerRollDice(){
          if(this.isDoneSelected() && this.allowedSelectionDice() && this.allowedActionRoll()){
               this.playerHideDicePool()
               this.startWaitingForRollResult()

               if(this._onRequestRollDice){
                    console.log("player:",this.id," request to roll dice")
                    this._onRequestRollDice(deepCopy(this.selectedpool))                    
               }

               //Done Player Selection Roll
               this.notAllowedSelectionDice()
               this.notAllowedActionRoll()               
          }else{
               console.log("player:",this.id," request message")
               if(this._onPlayerRequestMessage){
                    this._onPlayerRequestMessage("Cannot Roll Dice yet")
               }
          }
       },
       playerCheckRollResult(results){
          var roll1 = results[0],
              roll2 = results[1],
              roll3 = results[2]
          if(this.rolling()){

               this.endRolling()
          }
          
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

       onSelectedPool    (callback) {this._onSelectedPool       = callback},
       onRequestRollDice (callback) {this._onRequestRollDice    = callback},
       onPlayerRequestMessage (callback) {this._onPlayerRequestMessage = callback},
     }
})