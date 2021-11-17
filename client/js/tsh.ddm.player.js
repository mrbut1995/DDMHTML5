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



define(["ddm"], function (Tsh) {
   Tsh = Tsh || {}
   Tsh.Ddm = Tsh.Ddm || {}

   Tsh.Ddm.Player = {
      init(app) {
         this.id = ""
         this.name = ""

         this.pool = []
         this.selectionpool = []

         this.fullpool = {}

         this.crests = {
            attack: 0,
            defend: 0,
            movement: 0,
            summon: 0,
            magic: 0,
            trap: 0
         }

         this.avatar = null
         this.avatarSource = ""
         this.lp = 0

         this.isActive = true
         this.isLose = false
         this.isConnect = false

         this.isCurrentTurn = false

         this.isSummoning = false
         this.isRolling = false
         this.isMoving = false

         this.selectedMonster = null
         this.selectedEntityGroup = null

         this.controlmonster = {}
         this.controlland = {}

         this.resolvedMonster = {}

         //Player Action
         this.actions_available = {
            roll: true,
            diceselection: true,
            summoning: true,
            piece: true
         }

         this.summoningtarget = null

         this.app = app
         if (this._onInitialized) {
            this._onInitialized()
         }
      },
      /**
       * Get value of crest
       * @param   {string} name name of crest user want to get
       * @returns {number} value of crest user want to get
       */
      getCrest(name) {
         if (name in this.crests) {
            return this.crests[name]
         } else {
            return -1
         }
      },

      /**
       * Set Value of crest
       * @param {string} name  Name of Crest user want set
       * @param {number} value Value want to set to crest
       */
      setCrest(name, value) {
         if (name in this.crests) {
            this.crests[name] = value
         }
      },

      getCrests() {
         return this.crests;
      },
      getAvatar() {

      },
      getAvatarSource() {

      },
      setAvatarSource(src) {
         this.avatar = avatar;
      },
      active() {
         this.isActive = true
         if (this._onActive) {
            this._onActive()
         }
      },
      deactive() {
         this.isActive = false
         if (this._onDeactive) {
            this._onDeactive()
         }
      },
      getIsActive() {
         return this.isActive
      },
      toggleActive() {
         if (this.getIsActive()) {
            this.deactive()
         } else {
            this.active()
         }
      },
      selected(monster) {

      },
      assignMonster(monster) {

      },
      resignMonster(monster) {

      },
      assignLand(land) {

      },
      resignLand(land) {

      },
      getControlMonsters() {
         return this.controlmonster
      },
      getControlLands() {
         return this.controlland
      },

      displayAvatar() {

      },
      displayCrestInfo() {

      },

      allowedActionRoll() {
         return this.actions_available.roll
      },
      allowedSelectionDice() {
         return this.actions_available.diceselection
      },
      allowedSummoning() {
         return this.actions_available.diceselection
      },
      allowedPieceAction() {
         return this.actions_available.piece
      },

      resetAllowedActionRoll() {
         this.actions_available.roll = true
      },
      resetAllowedSelectionDice() {
         this.actions_available.diceselection = true
      },
      resetAllowedSummoning() {
         this.actions_available.summoning = true
      },
      resetAllowedPieceAction() {
         this.actions_available.piece = true
      },

      notAllowedActionRoll() {
         this.actions_available.roll = false
      },
      notAllowedSelectionDice() {
         this.actions_available.diceselection = false
      },
      notAllowedSummoning() {
         this.actions_available.summoning = false
      },
      notAllowedPieceAction() {
         this.actions_available.piece = false
      },

      actionablePieces() {
         if (this.notAllowedPieceAction()) {
            return []
         }
      },

      rolling() {
         return this.isRolling
      },
      startedRolling() {
         this.isRolling = true
      },
      endRolling() {
         this.isRolling = false
      },
      summoning() {
         return this.isSummoning
      },
      startedSummoning() {
         this.isSummoning = true
      },
      endSummoning() {
         this.isSummoning = false
      },
      reset() {

      },
      clear() {

      },

      getPoolItemAt(index) {
         return deepCopy(this.pool[index])
      },
      getSelectionPool() {
         return this.selectionpool
      },
      getPool() {
         return this.pool
      },
      getSummoningTarget(){
         return this.summoningtarget
      },
      /**View Data */


      updateSelectionPool() {
         var self = this
         self.selectionpool = _.where(this.pool, { selected: true })
      },
      selectPoolItem(index) {
         var self = this

         if (index < 0 || index > this.pool.length) {
            console.log("[ERROR] Out of Bound")
            return
         }
         if (self.selectionpool.length < 3) {
            var item = _.values(this.pool)[index]
            var available = _.property("available")(item)
            if (available) {
               item.selected = true
            }
         }

         this.updateSelectionPool()

         if (this._onselectiondice) {
            this._onselectiondice()
         }
         Tsh.Ddm.Game.updateDiceSelectingScreen()
      },
      deselectPoolItem(index) {
         var self = this

         if (index < 0 || index > this.pool.length) {
            console.log("[ERROR] Out of Bound")
            return
         }

         var item = _.values(this.pool)[index]
         item.selected = false

         this.updateSelectionPool()

         if (this._onselectiondice) {
            this._onselectiondice()
         }
         Tsh.Ddm.Game.updateDiceSelectingScreen()
      },
      containSeletectPoolItem(index) {
         return _.property("selected")(this.pool[index])
      },
      checkDiceSelecting() {
         return this.selectionpool.length >= 3 && this.allowedSelectionDice()
      },
      isSelectionSummonable() {
         return _.filter(this.selectionpool, i => i.summon.active == true).length > 0
      },
      toggleSelectedPoolItem(index) {
         if (index < 0 || index > this.pool.length) {
            console.log("[ERROR] Out of Bound")
            return
         }
         if (this.containSeletectPoolItem(index)) {
            console.log("deselected")
            this.deselectPoolItem(index)
         } else {
            console.log("selected")
            this.selectPoolItem(index)
         }
      },
      deselectAllPoolItem() {
         _.each(this.pool,
            item => item.selected = false
         )
         this.updateSelectionPool()

         Tsh.Ddm.Game.updateDiceSelectingScreen()
      },
      selectingSummoningDice(index) {
         var self = this
         if (index < 0 || index > this.selectionpool.length) {
            console.log("[ERROR] Out of Bound index = ", i)
            return
         }

         _.each(self.selectionpool, function (item, i) {
            item.summon.selected = (i == index)
         })

         this.summoningtarget = self.selectionpool[index]

         Tsh.Ddm.Game.updateSummoningScreen()
      },
      deselectingSummoningDice(index) {
         var self = this
         if (index < 0 || index > this.selectionpool.length) {
            console.log("[ERROR] Out of Bound index = ", i)
            return
         }
         _.each(self.selectionpool, function (item) {
            item.summon.selected = false
         })
         this.summoningtarget = null
         
         Tsh.Ddm.Game.updateSummoningScreen()
      },

      isSummoningDiceSelecting(index) {
         if (index < 0 || index > this.selectionpool.length) {
            console.log("[ERROR] Out of Bound index = ", i)
            return false
         }
         return this.selectionpool[index].summon.selected
      },

      toggleSummoningDiceSelecting(index) {
         if (this.isSummoningDiceSelecting(index)) {
            this.deselectingSummoningDice(index)
         } else {
            this.selectingSummoningDice(index)
         }
      },

      async updatePoolAsync(datas) {
         this.pool = _.map(datas, item => ({

            kind: _.property("kind")(item),
            name: _.property("name")(item),
            available: _.property("available")(item),
            portraitimg: _.property("portraitimg")(item),
            pieceimg: _.property("pieceimg")(item),
            dice: _.property("dice")(item),

            selected: false,
            used: false,

            roll: {
               active: true,
               value: -1,
               result: "unknow",
            },

            summon: {
               active: false,
               selected: false,
               used: false,
            },
         }))

         //Cloning data to pass Async function in case of multiple request update Player Pool
         Tsh.Ddm.Game.updateDiceSelectingScreen()
      },


      async updateRollingResult(results) {
         var self = this

         //Update status of selection pool
         _.each(self.selectionpool, function (item, i) {
            var faces = item.dice.faces,
               nresult = results[i]

            //Update Roll data of selection pool
            item.roll.active = false
            item.roll.value = results[i]
            item.roll.result = faces[nresult]

            item.summon.active = faces[nresult] == "summon"
            item.summon.selected = false
            item.summon.used = false
         })

         self.notAllowedActionRoll()
      },
      //Signal
      onLoaded(callback) { this._onLoaded = callback },
      onActive(callback) { this._onActive = callback },
      onDeactive(callback) { this._onDeactive = callback },
      onLose(callback) { this._onLose = callback },
      onConnected(callback) { this._onConnected = callback },
      onDeclareEndPhase(callback) { this._onDeclareEndPhase = callback },
      onCrestsChanged(callback) { this._onCrestChanged = callback },

      onSelectedMonster(callback) { this._onSelectedMonster = callback },
      onDeselectedMonster(callback) { this._onDeselectedMonster = callback },
      onInitialized(callback) { this._onInitialized = callback },

      onselectiondice(callback) { this._onselectiondice = callback },
      onRequestRollDice(callback) { this._onRequestRollDice = callback },
      onPlayerRequestMessage(callback) { this._onPlayerRequestMessage = callback },
   }
})