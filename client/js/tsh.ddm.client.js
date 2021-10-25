define(["ddm"],function(Tsh){
    Tsh = Tsh || {}
    Tsh.Ddm = Tsh.Ddm || {}

    Tsh.Ddm.Client = {
        init(host,port){
            this.connection = null;
            this.host = host;
            this.port = port;

            this._onConnected = null;
            
            this.handlers = [];
            this.handles[Messages.WELCOME] = this.receiveWelcome;
            
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

        }
    }
})