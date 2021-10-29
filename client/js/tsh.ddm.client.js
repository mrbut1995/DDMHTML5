define(["ddm"],function(Tsh){
    Tsh = Tsh || {}
    Tsh.Ddm = Tsh.Ddm || {}
    
    Tsh.Ddm.Client = {
        init(app){
            this.connection = null;
            // this.host = host;
            // this.port = port;

            this._onConnected = null;
            this._onDisconnected = null;

            this.handlers = [];
            this.handlers[Messages.WELCOME]          = this.receiveWelcome;
            this.handlers[Messages.DISPATCH ]        = this.receiveDispatch;
            this.handlers[Messages.LIST ]            = this.receiveEntityList;
            this.handlers[Messages.SYNCHRONIZING ]   = this.receiveSynchronizingData;
            this.handlers[Messages.SPAWN ]           = this.receiveSpawnEntity;
            this.handlers[Messages.DESPAWN ]         = this.receiveDespawnEntity;
            this.handlers[Messages.MOVE]             = this.receiveEntityMove;
            this.handlers[Messages.DESTROY ]         = this.receiveEntityDestroy;
            this.handlers[Messages.ATTACK ]          = this.receiveEntityAttack;
            this.handlers[Messages.EFFECT ]          = this.receiveEntityEffect;
            this.handlers[Messages.CHANGING ]        = this.receivePropertyChanging;
            this.handlers[Messages.TRIGGER ]         = this.receiveEffectTrigger;
            this.handlers[Messages.ACTIVE]           = this.receivePlayerActive;
            this.handlers[Messages.DEACTIVE ]        = this.receivePlayerDeactive;
            this.handlers[Messages.DIE ]             = this.receivePlayerDie;
            this.handlers[Messages.ROLL ]            = this.receivePlayerRollDice;
            this.handlers[Messages.PHASE ]           = this.receivePlayerChangePhase;
            this.handlers[Messages.END ]             = this.receiveGameEnd;
        
            this.useBison = false;
            this.enable();

            this.app = app
            if(this._onInitialized){
                this._onInitialized()
            }

        },
        setServerOption(host,port,name){
            this.host = host;
            this.port = port;
            this.username = name;
        },
        setup(host,port){
            this.host = host;
            this.port = port;
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
            var playerid = data[0],
                name     = data[1],
                contain  = data[2],
                avatar   = data[3],
                lp       = data[4],
                crests   = data[5],
                matchid  = data[6]
            if(this._onWelcome){
                this._onWelcome(playerid,name,contain,avatar,lp,crests,matchid)
            }
        },
        receiveDispatch(data){

        },
        receiveEntityList(data){

        },
        receiveSynchronizingData(data){

        },
        receiveSpawnEntity(data){
            var kind            = data[0],
                id              = data[1],
                x               = data[2],
                y               = data[3],
                name            = data[4],
                controllerid    = data[5],
                target          = data[6]
            if(this._onSpawnEntity){
                this._onSpawnEntity(kind,id,x,y,name,controllerid,target)
            }
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

        onInitialized       (callback){this._onInitialized = callback},
    }

})