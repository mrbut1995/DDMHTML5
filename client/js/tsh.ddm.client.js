define(["ddm"],function(Tsh){
    Tsh = Tsh || {}
    Tsh.Ddm = Tsh.Ddm || {}

    Tsh.Ddm.Client = {
        init(host,port){
            this.connection = null;
            this.host = host;
            this.port = port;

            this._onConnected = null;
            this._onDisconnected = null;

            this.handlers = [];
            this.handles[Messages.WELCOME]          = this.receiveWelcome;
            this.handles[Messages.DISPATCH ]        = this.receiveDispatch;
            this.handles[Messages.LIST ]            = this.receiveEntityList;
            this.handles[Messages.SYNCHRONIZING ]   = this.receiveSynchronizingData;
            this.handles[Messages.SPAWN ]           = this.receiveSpawnEntity;
            this.handles[Messages.DESPAWN ]         = this.receiveDespawnEntity;
            this.handles[Messages.MOVE]             = this.receiveEntityMove;
            this.handles[Messages.DESTROY ]         = this.receiveEntityDestroy;
            this.handles[Messages.ATTACK ]          = this.receiveEntityAttack;
            this.handles[Messages.EFFECT ]          = this.receiveEntityEffect;
            this.handles[Messages.CHANGING ]        = this.receivePropertyChanging;
            this.handles[Messages.TRIGGER ]         = this.receiveEffectTrigger;
            this.handles[Messages.ACTIVE]           = this.receivePlayerActive;
            this.handles[Messages.DEACTIVE ]        = this.receivePlayerDeactive;
            this.handles[Messages.DIE ]             = this.receivePlayerDie;
            this.handles[Messages.ROLL ]            = this.receivePlayerRollDice;
            this.handles[Messages.PHASE ]           = this.receivePlayerChangePhase;
            this.handles[Messages.END ]             = this.receiveGameEnd;
        
            this.useBison = false;
            this.enable();
        },

        enable(){
            this.isListening = true;
        },
        disable(){
            this.isListening = false;
        },
        connect(dispatcherMode){
            var url = "ws://"+ this.host +":"+ this.port +"/",
            self = this;

            if(window.MozWebSocket){
                this.connect    = new MozWebSocket(url)
            }else{
                this.connection = new WebSocket(url);
            }
        },
        sendMessage(json){
            var data;
            if(this.connection.readyState === 1){
                if(this.useBison){
                    data = BISON.encode(json);
                }else{
                    data = JSON.stringify(json);
                }
                this.connection.send(data)
            }
        },
        receiveMessage(message){
            var data,action;

            if(this.isListening){
                if(this.useBison) {
                    data = BISON.decode(message);
                } else {
                    data = JSON.parse(message);
                }
                if(data instanceof Array) {
                    if(data[0] instanceof Array) {
                        // Multiple actions received
                        this.receiveActionBatch(data);
                    } else {
                        // Only one action received
                        this.receiveAction(data);
                    }
                }
            }
        },
        receiveAction(data) {
            var action = data[0];
            if(this.handlers[action] && isFunction(this.handlers[action])) {
                this.handlers[action].call(this, data);
            }
            else {
                log.error("Unknown action : " + action);
            }
        },
        receiveActionBatch: function(actions) {
            var self = this;
            for(var i in actions){
                self.receiveAction(actions[i]);
            }
        },

        //Messge Handler
        receiveWelcome(data){

        },
        receiveDispatch(data){

        },
        receiveEntityList(data){

        },
        receiveSynchronizingData(data){

        },
        receiveSpawnEntity(data){

        },
        receiveDespawnEntity(data){

        },
        receiveEntityMove(data){

        },
        receiveEntityDestroy(data){

        },
        receiveEntityAttack     (data){

        }, 
        receiveEntityEffect     (data){

        },
        receivePropertyChanging (data){

        },
        receiveEffectTrigger    (data){

        },
        receivePlayerActive     (data){

        },
        receivePlayerDeactive   (data){

        },
        receivePlayerDie        (data){

        },
        receivePlayerRollDice   (data){

        },
        receivePlayerChangePhase(data){

        },
        receiveGameEnd(data){

        },


        //Signal Handle
        onDispatch          (callback){this._onDispatch             = callback},
        onConnected         (callback){this._onConnected            = callback},
        onEntityList        (callback){this._onEntityList           = callback},
        onWelcome           (callback){this._onWelcome              = callback},
        onDisconnected      (callback){this._onDisconnected         = callback},
        onSynchronizingData (callback){this._onSynchronizingData    = callback},

        onSpawnEntity       (callback){this._onSpawnEntity          = callback},
        onDespawnEntity     (callback){this._onDespawnEntity        = callback},
        onEntityMove        (callback){this._onEntityMove           = callback},
        onEntityDestroy     (callback){this._onEntityDestroy        = callback},
        onEntityAttack      (callback){this._onEntityAttack         = callback},
        onEntityEffect      (callback){this._onEntityEffect         = callback},
        onPropertyChanging  (callback){this._onPropertyChanging     = callback},
        onEffectTrigger     (callback){this._onEffectTrigger        = callback},
        onPlayerActive      (callback){this._onPlayerActive         = callback},
        onPlayerDeactive    (callback){this._onPlayerDeactive       = callback},
        onPlayerDie         (callback){this._onPlayerDie            = callback},
        onPlayerRollDice    (callback){this._onPlayerRollDice       = callback},
        onPlayerChangePhase (callback){this._onPlayerChangePhase    = callback},

        onGameEnd           (callback){this._onDisconnected    = callback},

    }
})