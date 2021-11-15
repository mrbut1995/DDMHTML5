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

           this.pool           = []
           this.selectionpool  = []

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
           this.actions_available = {
               roll           :  true,
               diceselection  :  true,
               summoning      :  true,
               piece          :  true              
          }

          this.summoning_mode = {
               summonable_dices : []
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
          return this.actions_available.roll
       },
       allowedSelectionDice(){
          return this.actions_available.diceselection
       },
       allowedSummoning(){
          return this.actions_available.diceselection
       },
       allowedPieceAction(){
          return this.actions_available.piece
       },

       resetAllowedActionRoll(){
          this.actions_available.roll = true
       },
       resetAllowedSelectionDice(){
          this.actions_available.diceselection = true
       },
       resetAllowedSummoning(){
          this.actions_available.summoning = true
       },
       resetAllowedPieceAction(){
          this.actions_available.piece = true
       },

       notAllowedActionRoll(){
          this.actions_available.roll = false
       },
       notAllowedSelectionDice(){
          this.actions_available.diceselection = false
       },
       notAllowedSummoning(){
          this.actions_available.summoning = false
       },
       notAllowedPieceAction(){
          this.actions_available.piece = false
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
       getPoolItemAt(index){
          return deepCopy(this.pool[index])
       },

       getPoolViewData(){
         var viewdata =  _.map(this.pool,item =>
            (item)
         )
         return viewdata
       },

       getDiceViewData(){
         var viewdata = _.map(this.selectionpool,item =>
            ({
                  faces : item.dice.faces
            })
         )
         return viewdata
       },
       selectPoolItem(index){
         var self = this

          if(index < 0 || index > this.pool.length){
               console.log("[ERROR] Out of Bound")
               return
          }
         if(self.selectionpool.length < 3){
            var item       =  _.values(this.pool)[index]
            var available  =  _.property("available")(item)
            if(available){
               item.selected = true
            }
         }
         
         self.selectionpool = _.where(this.pool,{selected:true})

         if(this._onselectiondice){
            this._onselectiondice()
         }
         Tsh.Ddm.View.updatePlayerPoolViewAsync(this.getPoolViewData())
       },
       deselectPoolItem(index){
          var self = this

          if(index < 0 || index > this.pool.length){
               console.log("[ERROR] Out of Bound")
               return
          }

          var item       =  _.values(this.pool)[index]
          item.selected  =  false

          self.selectionpool = _.where(this.pool,{selected:true})

          if(this._onselectiondice){
               this._onselectiondice()
          }
          Tsh.Ddm.View.updatePlayerPoolViewAsync(this.getPoolViewData())
       },
       containSeletectPoolItem(index){
         return _.property("selected")(this.pool[index])
       },
       isDoneSelected(){
          var self = this

          return self.selectionpool.length >= 3
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
         _.each(this.pool,
            item => item.selected = false
         )
         self.selectionpool = _.where(this.pool,{selected:true})

         Tsh.Ddm.View.updatePlayerPoolViewAsync(this.getPoolViewData())
       },


      async playerRequestDiceData(dices){
         _.each(dices,function(){

         }.bind(this))
      },
      async playerDisplayDicePool(){
          if(this.allowedSelectionDice() && !Tsh.Ddm.View.isDicePoolPopupDisplay()){
               Tsh.Ddm.View.displayDicePool()
          }
       },
       async playerHideDicePool(){
          if(Tsh.Ddm.View.isDicePoolPopupDisplay()){
               Tsh.Ddm.View.hideDicePool()
          }
       },
       
       async playerRequestUpdatePool(datas){
         this.pool           = _.map(datas, item => ({
            name        : _.property("name")(item),
            available   : _.property("available")(item),
            portraitimg : _.property("portraitimg")(item),
            pieceimg    : _.property("pieceimg")(item),
            dice        : _.property("dice")(item),

            selected     : false,
            used         : false,

            rollaction   : {
               faceresult  : "unknown",
               summonable  : false    ,
               used        : false    ,
            }
         }))

         //Cloning data to pass Async function in case of multiple request update Player Pool
         Tsh.Ddm.View.updatePlayerPoolViewAsync(this.getPoolViewData())
      },

       async requestPlayerRollDice(){
          if(this.isDoneSelected() && this.allowedSelectionDice() && this.allowedActionRoll()){
               
               Tsh.Ddm.View.updateRollingDice(this.getDiceViewData())

               this.playerHideDicePool()
               this.startedRolling()

               if(this._onRequestRollDice){
                    console.log("player:",this.id," request to roll dice")
                    this._onRequestRollDice(this.selectionpool)                    
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
       async requestPlayerCheckRollResult(results){
          var self = this

          if(this.rolling()){
               //Update status of selection pool
               _.each(this.selectionpool,function(item,i){
                  var faces = item.dice.faces,
                      nresult = results[i]
                  
                     item.rollaction.faceresult = faces[nresult]
                     item.rollaction.summonable = faces[nresult] == "summon"
                     item.rollaction.used       = false
               })
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

       onselectiondice    (callback)      {this._onselectiondice       = callback},
       onRequestRollDice (callback)      {this._onRequestRollDice    = callback},
       onPlayerRequestMessage (callback) {this._onPlayerRequestMessage = callback},
     }
})