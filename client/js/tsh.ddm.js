let start, previousTimeStamp;

//Define Modul
define(function () {

    console.log("LOAD TSH.DDM")

    var Tsh = Tsh || {}
    Tsh.Ddm = Tsh.Ddm || {}

    Tsh.Ddm.Match = {
        data: {
            pieces: [],
            lands: [],
            dices:[],
            player:[],
            phase:"standby-phase",
            turn: 0,
            playerindex:0
        },
        init(){

        }
    }

    Tsh.Ddm.Game = {
        init: function () {

            Tsh.Ddm.Match.init()
            Tsh.Ddm.View.init()
            Tsh.Ddm.Debug.init()
            Tsh.Ddm.Loader.init()
            Tsh.Ddm.Animator.init()
            Tsh.Ddm.Input.init()
            Tsh.Ddm.Entity.init()
            Tsh.Ddm.Client.init()
            Tsh.Ddm.Player.init()

            Tsh.Ddm.Match.load()

            // var entity = EntityFactory.createEntity("DummyMonster1","00001")
            // console.log(entity)
            Tsh.Ddm.Entity.testing()

            this.connectModule();
            this.connectServer();
        },
        connectServer(){
            var self = this
            Tsh.Ddm.Client.onDispatch(function(host,port){
                console.log("Dispatched to game server "+host+ ":"+port);
            })
            Tsh.Ddm.Client.onConnected(function(){
                console.log("on Connected To Server");

            })
            Tsh.Ddm.Client.onEntityList(function(list){

            })
            Tsh.Ddm.Client.onWelcome(function(id,name,data){
                console.log("Successfull Connect to server => Init handle")
                
                //Connecting Player Handle
                Tsh.Ddm.Player.onActive(function(){

                })
                Tsh.Ddm.Player.onLose(function(){

                })
                Tsh.Ddm.Player.onConnected(function(){

                })
                Tsh.Ddm.Player.onDeclareEndPhase(function(){

                })

                Tsh.Ddm.Client.onSpawnEntity(function(){

                });
                Tsh.Ddm.Client.onDespawnEntity(function(id){
                    
                })
                Tsh.Ddm.Client.onEntityMove(function(id,x,y){

                });
                Tsh.Ddm.Client.onEntityDestroy(function(id,x,y){

                });
                Tsh.Ddm.Client.onEntityAttack(function(id,x,y){

                });
                Tsh.Ddm.Client.onPlayerActive(function(playerid){

                })
                Tsh.Ddm.Client.onDisconnected(function(message){

                });
                
            })
            Tsh.Ddm.Client.onWaitingConnecting(function(){

            }.bind(this))
            Tsh.Ddm.Client.onSynchronizingData(function(data){
                console.log("on Synchronizing Data");

            }.bind(this))
        },

        connectModule(){
            var self = this

            Tsh.Ddm.Entity.onAddEntity(function(){

            }.bind(this))
            Tsh.Ddm.Entity.onRemoveEntity(function(){

            }.bind(this))
            Tsh.Ddm.Entity.onUpdateList(function(){

            }.bind(this))

            Tsh.Ddm.Entity.onSpawnPiece(function(entity,x,y,target){
                entity.idle()
            }.bind(this))

            Tsh.Ddm.Entity.onSpawnLand(function(entity,x,y){

            }.bind(this))

            Tsh.Ddm.Entity.onSpawnItem(function(entity,x,y){

            }.bind(this))

            Tsh.Ddm.Entity.onDespawnEntity(function(){

            }.bind(this))

        },
        run: function () {
            window.requestAnimationFrame(this.step.bind(this));
        },
        step: function (timestamp) {
            if (start === undefined)
                start = timestamp;
            const elapsed = timestamp - start;

            var delta = timestamp - previousTimeStamp;

            if (previousTimeStamp !== timestamp) {
                Tsh.Ddm.View.update({ delta: delta })
            }

            previousTimeStamp = timestamp
            var cb = this.step.bind(this)
            window.requestAnimationFrame(cb);
        },
        hideScreen: function (id) {
        },
        showScreen: function () {
        },
        hideScreens: function () {
        },
        roll: function () {
            console.log("roll")
            Tsh.Ddm.View.displayDice(1300)
            Tsh.Ddm.View.rollDice(0, Math.floor(Math.random() * 6))
            Tsh.Ddm.View.rollDice(1, Math.floor(Math.random() * 6))
            Tsh.Ddm.View.rollDice(2, Math.floor(Math.random() * 6))
        },
    }

    return Tsh
})