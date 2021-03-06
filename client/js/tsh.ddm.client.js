define(["ddm"], function (Tsh) {
    Tsh = Tsh || {}
    Tsh.Ddm = Tsh.Ddm || {}

    /**
     * @exports tsh/ddm/client
     * @namespace Tsh.Ddm.Client
     */
    Tsh.Ddm.Client = {

        init(app) {
            this.connection = null;
            // this.host = host;
            // this.port = port;

            this._onConnected = null;
            this._onDisconnected = null;

            this.handlers = [];
            this.handlers[Messages.WELCOME] = this.receiveWelcome;
            this.handlers[Messages.DISPATCH] = this.receiveDispatch;
            this.handlers[Messages.LIST] = this.receiveEntityList;
            this.handlers[Messages.SYNCHRONIZING] = this.receiveSynchronizingData;
            this.handlers[Messages.SPAWN] = this.receiveSpawnEntity;
            this.handlers[Messages.DESPAWN] = this.receiveDespawnEntity;
            this.handlers[Messages.MOVE] = this.receiveEntityMove;
            this.handlers[Messages.DESTROY] = this.receiveEntityDestroy;
            this.handlers[Messages.ATTACK] = this.receiveEntityAttack;
            this.handlers[Messages.EFFECT] = this.receiveEntityEffect;
            this.handlers[Messages.CHANGING] = this.receivePropertyChanging;
            this.handlers[Messages.TRIGGER] = this.receiveEffectTrigger;
            this.handlers[Messages.ACTIVE] = this.receivePlayerActive;
            this.handlers[Messages.DEACTIVE] = this.receivePlayerDeactive;
            this.handlers[Messages.DIE] = this.receivePlayerDie;
            this.handlers[Messages.ROLL] = this.receiveRollDice;
            this.handlers[Messages.PHASE] = this.receivePhaseChanged;
            this.handlers[Messages.END] = this.receiveGameEnd;
            this.handlers[Messages.POOL] = this.receivePool;

            this.useBison = false;

            this.socketQueueId = 0;
            this.socketQueue = {};

            this.enable();

            this.app = app
            if (this._onInitialized) {
                this._onInitialized()
            }

        },
        setServerOption(host, port, name) {
            this.host = host;
            this.port = port;
            this.username = name;
        },
        setup(host, port) {
            this.host = host;
            this.port = port;
        },
        enable() {
            this.isListening = true;
        },
        disable() {
            this.isListening = false;
        },
        connect(dispatcherMode) {
            var url = "ws://" + this.host + ":" + this.port + "/",
                self = this;

            if (Tsh.Ddm.Debug) {
                console.log("is debugging connection")
                Tsh.Ddm.Debug.debugConnection()
            }
            else if (window.MozWebSocket) {
                this.connection = new MozWebSocket(url)
            } else {
                this.connection = new WebSocket(url);
            }

            if (dispatcherMode) {

            } else {
                this.connection.onopen = function () {

                }
                this.connection.onmessage = function (e) {
                    if(self.data === "go"){
                        if(self._onConnected)
                        {
                            self._onConnected()
                        }
                    }
                    self.receiveMessage(e.data)
                }
                this.connection.onerror = function () {

                }
            }
        },
        sendMessage(json) {
            var data;
            if (this.connection.readyState !== 1) {
                console.log("Connection is not ready")
                return;
            }
            if (this.useBison) {
                data = BISON.encode(json);
            } else {
                data = JSON.stringify(json);
            }
            console.log("send", data)
            this.connection.send(data)

        },
        sendMessageCallback(json, callback) {
            if (this.connection.readyState !== 1) {
                console.log("Connection is not ready")
                return;
            }
            this.socketQueueId++
            if (typeof (callback) == 'function') {
                this.socketQueue['i_' + this.socketQueueId] = callback
            }
            if (this.useBison) {
                data = BISON.encode(json);
            } else {
                data = JSON.stringify(json);
            }
            console.log("send message callback", data)
            this.connection.send(data)
        },
        receiveMessage(message) {
            var data, action;

            if (!this.isListening) {
                console.log("[ERROR] Connection is not listening")
                return
            }
            if (this.useBison) {
                data = BISON.decode(message);
            } else {
                data = JSON.parse(message);
            }
            if (data instanceof Array) {
                if (data[0] instanceof Array) {
                    // Multiple actions received
                    this.receiveActionBatch(data);
                } else {
                    // Only one action received
                    this.receiveAction(data);
                }
            }

        },
        receiveAction(data) {
            var action = data[0];
            if (this.handlers[action] && isFunction(this.handlers[action])) {
                this.handlers[action].call(this, data);
            }
            else {
                console.log("Unknown action : " + action);
            }
        },
        receiveActionBatch: function (actions) {
            var self = this;
            for (var i in actions) {
                self.receiveAction(actions[i]);
            }
        },
        receiveRequestResponse : function(data){
            
        },
        //Messge Handler
        receiveWelcome(data) {
            var playerid = data[1],
                name = data[2],
                pool = data[3],
                avatar = data[4],
                lp = data[5],
                crests = data[6],
                matchid = data[7]
            if (this._onWelcome) {
                this._onWelcome(playerid, name, pool, avatar, lp, crests, matchid)
            }
        },
        receiveDispatch(data) {

        },
        receiveEntityList(data) {
            data.shift()
            if (this._onEntityList)
                this._onEntityList(data)
        },
        receiveSynchronizingData(data) {

        },
        receiveSpawnEntity(data) {
            var kind = data[1],
                id = data[2],
                x = data[3],
                y = data[4],
                name = data[5],
                controllerid = data[6],
                target = data[7]
            if (this._onSpawnEntity) {
                this._onSpawnEntity(kind, id, x, y, name, controllerid, target)
            }
        },
        receiveDespawnEntity(data) {
            var playerid = data[1],
                id = data[2]
            if (this._onDespawnEntity) {
                this._onDespawnEntity(playerid, id)
            }
        },
        receiveEntityMove(data) {
            var playerid = data[1],
                id = data[2],
                x = data[3],
                y = data[4],
                type = data[5]
            if (this._onEntityMove) {
                this._onEntityMove(playerid, id, x, y, type)
            }
        },
        receiveEntityDestroy(data) {
            var id = data[1]
            if (this._onEntityDestroy) {
                this._onEntityDestroy(id)
            }
        },
        receiveEntityAttack(data) {

        },
        receiveEntityEffect(data) {

        },
        receivePropertyChanging(data) {

        },
        receiveEffectTrigger(data) {

        },
        receivePlayerActive(data) {

        },
        receivePlayerDeactive(data) {

        },
        receivePlayerDie(data) {

        },
        /**
         * Request To display the result of Dice Rolling from server
         * @param {object[]} data   Data send from server 
         */
        receiveRollDice(data) {
            var playerid = data[1],
                roll1 = data[2],
                roll2 = data[3],
                roll3 = data[4]
            if (this._onRollDice) {
                this._onRollDice(playerid, roll1, roll2, roll3)
            }
        },
        receivePhaseChanged(data) {
            var idplayer = data[1],
                phase = data[2],
                turn = data[3],
                status = data[4]
            if (this._onPhaseChanged) {
                this._onPhaseChanged(idplayer, phase, turn, status)
            }
        },
        receiveGameEnd(data) {

        },
        receivePool(data) {
            var playerid = data[1],
                pool = data[2],
                unavailablepool = data[3]
            if (this._onPoolChanged) {
                this._onPoolChanged(playerid, pool, unavailablepool)
            }
        },
        //Send Method
        sendAttack(source, target) {
            this.sendMessage([Messages.ATTACK,
            source.id, target.id])
        },

        /**
         * @memberof Tsh.Ddm.Client
         * @method sendQuery
         * Request Server to get Data of player 
         * @param {string} player Ids of  player that need information of to get Query
         */
        sendQuery(playerid) {
            this.sendMessage([Messages.QUERY,
                playerid])
        },

        /**
         * Request Server to retrive the information of Entity
         * @param {string[]} ids List of id of entity that need to retrive information 
         */
        sendWho(ids) {
            var data = ids
            data.unshift(Messages.WHO)
            this.sendMessage(data)
        },

        /**
         * Request server to Spawning Entity of given information
         * @param {string} kind 
         * @param {string} type 
         * @param {number} col 
         * @param {number} row 
         * @param {number} controllerid 
         * @param {object} target 
         */
        sendSpawn(kind, type, col, row, controllerid, target) {
            this.sendMessage([Messages.SPAWN,
                kind, type, col, row, controllerid, target])
        },
        sendRoll(playerid, roll1, roll2, roll3) {
            this.sendMessage([Messages.ROLL,
                playerid, roll1, roll2, roll3])
        },
        sendPhase(playerid, phase) {
            this.sendMessage([Messages.PHASE,
                playerid, phase])
        },
        /**
         * Request Server to update Player Pool
         * @param {string} playerid Id of player want to update Pool State
         * @param {string[]} pool 
         * @param {string[]} unused 
         */
        sendPool(playerid, pool, unused) {
            this.sendMessage([Messages.POOL,
                playerid, pool, unused])
        },


        //Signal Handle
        onDispatch(callback) { this._onDispatch = callback },
        onConnected(callback) { this._onConnected = callback },
        onEntityList(callback) { this._onEntityList = callback },
        onWelcome(callback) { this._onWelcome = callback },
        onDisconnected(callback) { this._onDisconnected = callback },
        onSynchronizingData(callback) { this._onSynchronizingData = callback },

        onSpawnEntity(callback) { this._onSpawnEntity = callback },
        onDespawnEntity(callback) { this._onDespawnEntity = callback },
        onEntityMove(callback) { this._onEntityMove = callback },
        onEntityDestroy(callback) { this._onEntityDestroy = callback },
        onEntityAttack(callback) { this._onEntityAttack = callback },
        onEntityEffect(callback) { this._onEntityEffect = callback },
        onPropertyChanging(callback) { this._onPropertyChanging = callback },
        onEffectTrigger(callback) { this._onEffectTrigger = callback },
        onPlayerActive(callback) { this._onPlayerActive = callback },
        onPlayerDeactive(callback) { this._onPlayerDeactive = callback },
        onPlayerDie(callback) { this._onPlayerDie = callback },
        onRollDice(callback) { this._onRollDice = callback },
        onPhaseChanged(callback) { this._onPhaseChanged = callback },
        onPoolChanged(callback) { this._onPoolChanged = callback },

        onGameEnd(callback) { this._onDisconnected = callback },

        onInitialized(callback) { this._onInitialized = callback },
    }

})