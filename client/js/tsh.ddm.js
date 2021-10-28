let start, previousTimeStamp;
var Tsh = Tsh || {}
Tsh.Ddm = Tsh.Ddm || {}

//Define Modul
define(function (Entity ) {

    console.log("LOAD TSH.DDM")

    Tsh.Ddm.Game = {
        init: function () {

            Tsh.Ddm.View.init()
            Tsh.Ddm.Debug.init()
            Tsh.Ddm.Loader.init()
            Tsh.Ddm.Animator.init()
            Tsh.Ddm.Input.init()
            Tsh.Ddm.Entity.init()
            Tsh.Ddm.Client.init()
            Tsh.Ddm.Player.init()
            Tsh.Ddm.Match.init()

            this.connectModule();
            this.connectServer();

            Tsh.Ddm.Client.receiveWelcome(["","","","","","","",""])

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
            Tsh.Ddm.Client.onWelcome(function(id,name,contain,avatar,lp,crests,matchid){
                console.log("Successfull Connect to server => Init handle")
                
                Tsh.Ddm.Player.id = id
                Tsh.Ddm.Player.name = name;
                Tsh.Ddm.Player.contain = contain;
                Tsh.Ddm.Player.avatar = avatar;
                Tsh.Ddm.Player.lp     = lp;
                Tsh.Ddm.Player.crests = crests

                Tsh.Ddm.Match.matchid = matchid
                
                Tsh.Ddm.Entity.initEntityGrid({
                    width:13,
                    height:19
                })

                //Connecting Player Handle
                Tsh.Ddm.Player.onActive(function(){

                })
                Tsh.Ddm.Player.onLose(function(){

                })
                Tsh.Ddm.Player.onConnected(function(){
                    
                })
                Tsh.Ddm.Player.onDeclareEndPhase(function(){

                })
                Tsh.Ddm.Player.onSelectedMonster(function(monster){
                    
                })  
                Tsh.Ddm.Player.onDeselectedMonster(function(monster){

                })

                Tsh.Ddm.Client.onSpawnEntity(function(kind,id,x,y,name,controllerid,target){
                    Tsh.Ddm.Entity.spawnEntity(kind,id,x,y,name,controllerid,target)
                });
                Tsh.Ddm.Client.onDespawnEntity(function(player,id){
                    
                })

                Tsh.Ddm.Client.onEntityMove(function(player,id,x,y){

                });
                Tsh.Ddm.Client.onEntityDestroy(function(player,id,x,y){

                });
                Tsh.Ddm.Client.onEntityAttack(function(player,id,x,y){

                });
                Tsh.Ddm.Client.onEntityEffect(function(player,id,x,y){

                });
                Tsh.Ddm.Client.onPropertyChanging(function(id,property,value){

                });
                Tsh.Ddm.Client.onEffectTrigger(function(player,id,x,y){

                });
                Tsh.Ddm.Client.onPlayerActive(function(playerid){

                });
                Tsh.Ddm.Client.onPlayerDeactive(function(playerid){

                });
                Tsh.Ddm.Client.onPlayerDie(function(playerid,result){

                });
                Tsh.Ddm.Client.onPlayerRollDice(function(playerid,dice,result){

                });
                Tsh.Ddm.Client.onPlayerChangePhase(function(playerid,changephase){

                });
                Tsh.Ddm.Client.onGameEnd(function(state,playerid){

                });

                Tsh.Ddm.Client.onDisconnected(function(message){

                });                
            })
            // Tsh.Ddm.Client.onWaitingConnecting(function(){

            // }.bind(this))
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

            Tsh.Ddm.Entity.onSpawnMonster(function(entity,col,row,controllerid,target){
                console.log("onSpawnMonster ",entity)
                entity.setView(Tsh.Ddm.View.createView(Types.Views.MONSTERVIEW))
                entity.setGridPosition(col,row)
                entity.idle()
                if(controllerid == Tsh.Ddm.Player.playerid){
                    
                }

                entity.onDamageTarget(function(target,points){

                })
                entity.onDamageMultiTarget(function(targets,point){

                })
                entity.onKillTarget(function(target){

                })
                entity.onChangeStat(function(stat,val){

                })
                entity.onChangeHealth(function(points,reason){

                })
                entity.onKilled(function(reason){

                })
                entity.onHasMoved(function(reason){

                })
                entity.onRequestPath(function(col,row){

                })
                entity.onStopPathing(function(col,row){

                })
                entity.onStep(function(){

                })
                entity.onBeforeStep(function(){

                })
                entity.onStartPathing(function(path){

                })
            }.bind(this))

            Tsh.Ddm.Entity.onSpawnMonsterLord(function(entity,col,row,controllerid,target){
                entity.setView(Tsh.Ddm.View.createView(Types.Views.MONSTERLORDVIEW))
                entity.setGridPosition(col,row)

            }.bind(this))

            Tsh.Ddm.Entity.onSpawnLand(function(entity,col,row,controllerid){
                entity.setView(Tsh.Ddm.View.createView(Types.Views.LANDVIEW))
                entity.setGridPosition(col,row)

            }.bind(this))

            Tsh.Ddm.Entity.onSpawnItem(function(entity,col,row,controllerid){

            }.bind(this))

            Tsh.Ddm.Entity.onDespawnEntity(function(){

            }.bind(this))

            Tsh.Ddm.View.onViewCreated(function(view){
                console.log("board == ",Tsh.Ddm.View.getBoard().type)
                if(view.type == "monster"){
                    view.setBoard(Tsh.Ddm.View.getBoard())
                }else if(view.type == "monsterlord"){
                    view.setBoard(Tsh.Ddm.View.getBoard())
                }else if(view.type == "land"){
                    view.setBoard(Tsh.Ddm.View.getBoard())
                }
            }.bind(this))
            Tsh.Ddm.View.onViewDestroyed(function(view){

            }.bind(this))
            Tsh.Ddm.View.onDirty(function(){

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
        setCursor(name,orientation){

        },
        updateCursorLogic(){

        },
        getMouseGridPosition(){

        },
        makeMonsterGoTo(monster,x,y){
            
        },
        makeMonsterTeleportTo(monster,x,y){
            
        },
        makePlayerRollDice(){

        },
        makePlayerSummon(monster,x,y){

        },
        findPath(monster,x,y,ignorelist){

        },
        restart(){
            
        }
    }

    return Tsh
})