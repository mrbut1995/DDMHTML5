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
            this.handlers[Messages.LIST]            = this.receiveEntityList;
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
            this.handlers[Messages.ROLL ]            = this.receiveRollDice;
            this.handlers[Messages.PHASE ]           = this.receivePhaseChanged;
            this.handlers[Messages.END ]             = this.receiveGameEnd;
            this.handlers[Messages.POOL]             = this.receivePool;

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
                console.log("Unknown action : " + action);
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
            var playerid = data[1],
                name     = data[2],
                contain  = data[3],
                avatar   = data[4],
                lp       = data[5],
                crests   = data[6],
                matchid  = data[7]
            if(this._onWelcome){
                this._onWelcome(playerid,name,contain,avatar,lp,crests,matchid)
            }
        },
        receiveDispatch(data){

        },
        receiveEntityList(data){
            data.shift()
            if(this._onEntityList)
                this._onEntityList(data)
        },
        receiveSynchronizingData(data){

        },
        receiveSpawnEntity(data){
            var kind            = data[1],
                id              = data[2],
                x               = data[3],
                y               = data[4],
                name            = data[5],
                controllerid    = data[6],
                target          = data[7]
            if(this._onSpawnEntity){
                this._onSpawnEntity(kind,id,x,y,name,controllerid,target)
            }
        },
        receiveDespawnEntity(data){
            var playerid = data[1],
                id       = data[2]
            if(this._onDespawnEntity){
                this._onDespawnEntity(playerid,id)
            }
        },
        receiveEntityMove(data){
            var playerid = data[1],
                id = data[2],
                x  = data[3],
                y  = data[4],
                type = data[5]
            if(this._onEntityMove){
                this._onEntityMove(playerid,id,x,y,type)
            }
        },
        receiveEntityDestroy(data){
            var id = data[1]
            if(this._onEntityDestroy){
                this._onEntityDestroy(id)
            }
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
        receiveRollDice   (data){
            var result = data;
            result.shift()
            if(this._onRollDice){
                this._onRollDice(result)
            }
        },
        receivePhaseChanged(data){
            var idplayer = data[1],
                phase    = data[2],
                turn     = data[3],
                status   = data[4]
            if(this._onPhaseChanged){
                this._onPhaseChanged(idplayer,phase,turn,status)
            }
        },
        receiveGameEnd(data){

        },
        receivePool(data){
            
        },
        //Send Method
        sendAttack(source,target){
            this.sendMessage([Messages.ATTACK,
                              source.id,target.id])
        },
        sendQuery(ids){
            var data = ids
            data.unshift(Messages.QUERY)
            this.sendMessage(data)
        },
        sendWho(ids){
            var data = ids
            data.unshift(Messages.WHO)
            this.sendMessage(data)
        },
        sendSpawn(kind,type,col,row,controllerid,target){
            this.sendMessage([Messages.SPAWN,
                              kind,type,col,row,controllerid,target])
        },
        sendRoll(playerid,roll1,roll2,roll3){
            this.sendMessage([Messages.ROLL,
                             playerid,roll1,roll2,roll3])
        },
        sendPhase(playerid,phase){
            this.sendMessage([Messages.PHASE,
                             playerid,phase])
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
        onRollDice          (callback){this._onRollDice             = callback},
        onPhaseChanged      (callback){this._onPhaseChanged         = callback},

        onGameEnd           (callback){this._onDisconnected    = callback},

        onInitialized       (callback){this._onInitialized = callback},
    }

})