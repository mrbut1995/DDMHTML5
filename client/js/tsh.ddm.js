let start, previousTimeStamp;
var Tsh = Tsh || {}
Tsh.Ddm = Tsh.Ddm || {}

//Define Modul
define(function (Entity) {

    console.log("LOAD TSH.DDM")

    Tsh.Ddm.Game = {
        init: function () {

            this.app = Tsh.Ddm

            this.connectModule();

            Tsh.Ddm.Loader.init(Tsh.Ddm)

            Tsh.Ddm.View.init(Tsh.Ddm)
            Tsh.Ddm.Entity.init(Tsh.Ddm)

            Tsh.Ddm.Animator.init(Tsh.Ddm)
            Tsh.Ddm.Debug.init(Tsh.Ddm)
            Tsh.Ddm.Input.init(Tsh.Ddm)
            Tsh.Ddm.Client.init(Tsh.Ddm)
            Tsh.Ddm.Player.init(Tsh.Ddm)
            Tsh.Ddm.Match.init(Tsh.Ddm)
            Tsh.Ddm.Path.init(Tsh.Ddm)
            Tsh.Ddm.Board.init(Tsh.Ddm)

            this.connectServer();

            Tsh.Ddm.Client.receiveWelcome(["", "", "", "", "", "", "", ""])

        },
        connectServer() {
            var self = this
            Tsh.Ddm.Client.onDispatch(function (host, port) {
                console.log("Dispatched to game server " + host + ":" + port);
            })
            Tsh.Ddm.Client.onConnected(function () {
                console.log("on Connected To Server");

            })
            Tsh.Ddm.Client.onEntityList(function (list) {
                console.log("Receive Entity List");
                Tsh.Ddm.Entity.updateList(list)
            })
            Tsh.Ddm.Client.onWelcome(function (id, name, contain, avatar, lp, crests, matchid) {
                console.log("Successfull Connect to server => Init handle")

                Tsh.Ddm.Player.id = id
                Tsh.Ddm.Player.name = name;
                Tsh.Ddm.Player.contain = contain;
                Tsh.Ddm.Player.avatar = avatar;
                Tsh.Ddm.Player.lp = lp;
                Tsh.Ddm.Player.crests = crests

                Tsh.Ddm.Match.matchid = matchid

                Tsh.Ddm.Entity.initEntityGrid({
                    width: 13,
                    height: 19
                })
                Tsh.Ddm.Path.initPathingGrid({
                    width: 13,
                    height: 19
                })
                //Connecting Player Handle
                Tsh.Ddm.Player.onActive(function () {

                })
                Tsh.Ddm.Player.onLose(function () {

                })
                Tsh.Ddm.Player.onConnected(function () {

                })
                Tsh.Ddm.Player.onDeclareEndPhase(function () {

                })
                Tsh.Ddm.Player.onSelectedMonster(function (monster) {

                })
                Tsh.Ddm.Player.onDeselectedMonster(function (monster) {

                })

                Tsh.Ddm.Client.onSpawnEntity(function (kind, id, x, y, name, controllerid, target) {
                    console.log("Spawn entity ",id)
                    Tsh.Ddm.Entity.spawnEntity(kind, id, x, y, name, controllerid, target)
                });
                Tsh.Ddm.Client.onDespawnEntity(function (player, id) {
                    console.log("Despawn entiy ",id)
                    Tsh.Ddm.Entity.despawnEntity(id)
                })

                Tsh.Ddm.Client.onEntityMove(function (playerid, id, x, y,type) {
                    var entity = null;
                    if(playerid === Tsh.Ddm.Player.playerid){
                        console.log("By client Player Control ",id)
                        entity = Tsh.Ddm.Entity.getEntityById(id)

                        if(entity){
                            entity.idle()
                            self.makeEntityGoTo(entity,x,y)
                        }else{
                            console.log("CANNOT FIND ENTITY ",id)
                        }
                    }else{
                        console.log("Not by client Player Control")
                        entity = Tsh.Ddm.Entity.getEntityById(id)

                        if(entity){
                            entity.idle()
                            self.makeEntityGoTo(entity,x,y)
                        }else{
                            console.log("CANNOT FIND ENTITY ",id)
                        }
                    }
                });
                Tsh.Ddm.Client.onEntityDestroy(function (player, id, x, y) {

                });
                Tsh.Ddm.Client.onEntityAttack(function (player, id, x, y) {

                });
                Tsh.Ddm.Client.onEntityEffect(function (player, id, x, y) {

                });
                Tsh.Ddm.Client.onPropertyChanging(function (id, property, value) {

                });
                Tsh.Ddm.Client.onEffectTrigger(function (player, id, x, y) {

                });
                Tsh.Ddm.Client.onPlayerActive(function (playerid) {

                });
                Tsh.Ddm.Client.onPlayerDeactive(function (playerid) {

                });
                Tsh.Ddm.Client.onPlayerDie(function (playerid, result) {

                });
                Tsh.Ddm.Client.onPlayerRollDice(function (playerid, dice, result) {

                });
                Tsh.Ddm.Client.onPlayerChangePhase(function (playerid, changephase) {

                });
                Tsh.Ddm.Client.onGameEnd(function (state, playerid) {

                });

                Tsh.Ddm.Client.onDisconnected(function (message) {

                });
            })
            // Tsh.Ddm.Client.onWaitingConnecting(function(){

            // }.bind(this))
            Tsh.Ddm.Client.onSynchronizingData(function (data) {
                console.log("on Synchronizing Data");

            }.bind(this))
        },

        connectModule() {
            var self = this

            Tsh.Ddm.Board.onInitialized(function(){
                
            })
            Tsh.Ddm.Entity.onInitialized(function () {

                
                this.onAddEntity(function (entity) {    
                    Tsh.Ddm.Entity  .registerToEntityGrid   (entity,entity.point.col,entity.point.row)
                    Tsh.Ddm.Path    .registerToPathingGrid  (entity,entity.point.col,entity.point.row)
                    Tsh.Ddm.Animator.registerAnimator       (entity)
                    Tsh.Ddm.View    .registerEntityView     (entity)
                    Tsh.Ddm.Input   .registerEntityInput    (entity)
                }.bind(this))

                this.onRemoveEntity(function (entity) {
                    Tsh.Ddm.Entity  .removeFromEntityGrid   (entity,entity.point.col,entity.point.row)
                    Tsh.Ddm.Path    .removeFromPathingGrid  (entity,entity.point.col,entity.point.row)
                    Tsh.Ddm.Animator.unregisterAnimator     (entity)
                    Tsh.Ddm.View    .unregisterEntityView   (entity)
                    Tsh.Ddm.Input   .unregisterEntityInput  (entity)
                }.bind(this))


                this.onRequestEntities(function(entitieIds){
                    console.log("request data from list",entitieIds)
                    
                })
                this.onSpawnMonster(function (entity, col, row, controllerid, target) {
                    var _view = Tsh.Ddm.View.generateView(entity.view)
                    entity.setView(_view)

                    Tsh.Ddm.Entity.addEntity(entity)

                    entity.setGridPosition(col, row)

                    entity.idle()
                    if (controllerid == Tsh.Ddm.Player.playerid) {
                    }
                    entity.onDamageTarget(function (target, points) {
                        
                    })
                    entity.onDamageMultiTarget(function (targets, point) {

                    })
                    entity.onKillTarget(function (target) {

                    })
                    entity.onChangeStat(function (stat, val) {

                    })
                    entity.onChangeHealth(function (points, reason) {

                    })
                    entity.onKilled(function (reason) {

                    })
                    entity.onHasMoved(function (reason) {

                    })
                    entity.onRequestPath(function (point) {
                        var path = self.findPath(entity,point.col,point.row)
                        return path
                    })
                    entity.onStartPath(function (path) {
                        self.unregisterEntityPosition(entity)
                    })
                    entity.onBeforeStep(function () {
                        self.unregisterEntityPosition(entity) 
                    })
                    entity.onStep(function () {
                        if(entity.hasNextStep()){
                            self.registerEntityDualPosition(entity) 
                        }
                    })
                    entity.onStopPath(function (point) {
                        self.unregisterEntityPosition(entity)
                        self.registerEntityPosition(entity)
                    })
                }.bind(this))

                this.onSpawnMonsterLord(function (entity, col, row, controllerid, target) {
                    var _view = Tsh.Ddm.View.generateView(entity.view)
                    entity.setView(_view)

                    Tsh.Ddm.Entity.addEntity(entity)

                    entity.setGridPosition(col, row)

                    Tsh.Ddm.Entity.addEntity(entity)

                }.bind(this))

                this.onSpawnLand(function (entity, col, row, controllerid) {
                    var _view = Tsh.Ddm.View.generateView(entity.view)
                    entity.setView(_view)

                    Tsh.Ddm.Entity.addEntity(entity)

                    entity.setGridPosition(col, row)

                    
                }.bind(this))

                this.onSpawnItem(function (entity, col, row, controllerid) {
                    var _view = Tsh.Ddm.View.generateView(entity.view)
                    entity.setView(_view)

                    Tsh.Ddm.Entity.addEntity(entity)

                    entity.setGridPosition(col, row)
                }.bind(this))

                this.onDespawnEntity(function (entity) {
                    Tsh.Ddm.Entity  .removeEntity(entity)
                    entity.destroy()
                }.bind(this))

            }.bind(Tsh.Ddm.Entity))

            Tsh.Ddm.View.onInitialized(function () {
                Tsh.Ddm.Input.connectInput      (this.getDOM("ddm-canvas"))
                Tsh.Ddm.Board.connectBoardView  (this.getBoard())

                this.onViewCreated(function (view) {
                    if (view.type == "monster") {
                        view.setBoard(Tsh.Ddm.View.getBoard())
                    } else if (view.type == "monsterlord") {
                        view.setBoard(Tsh.Ddm.View.getBoard())
                    } else if (view.type == "land") {
                        view.setBoard(Tsh.Ddm.View.getBoard())
                    }
                }.bind(this))
                this.onViewDestroyed(function (view) {

                }.bind(this))
                this.onDirty(function () {

                }.bind(this))
            }.bind(Tsh.Ddm.View))

            Tsh.Ddm.Input.onInitialized(function () {
                this.onCanvasClicked(function (ev) {
                    let mouse = Tsh.Ddm.Input.mouse
                    console.log("onCanvasClicked")
                    Tsh.Ddm.View.requestViewsAt(mouse.x,mouse.y,function(views){
                        for(var i in views){
                            if(views[i].type == "monster"){
                                var monster = Tsh.Ddm.Entity.getEntityByView(views[i])
                                Tsh.Ddm.Debug.onMonsterClickedDebug(monster)
                                return;
                            }else{
                                console.log("NOT MONSTER TYPE => SKIP")
                            }
                        }
                    }.bind(this))
                })
                this.onCanvasPressed(function (ev) {
                    let mouse = Tsh.Ddm.Input.mouse
                    Tsh.Ddm.View.requestViewsAt(mouse.x,mouse.y,function(views){
                        
                    }.bind(this))
                })
                this.onCanvasReleased(function (ev) {
                    let mouse = Tsh.Ddm.Input.mouse
                    Tsh.Ddm.View.requestViewsAt(mouse.x,mouse.y,function(views){
                        
                    }.bind(this))
                })
                this.onCanvasMove(function (ev) {
                    let mouse = Tsh.Ddm.Input.mouse
                    Tsh.Ddm.View.requestViewsAt(mouse.x,mouse.y,function(views){
                        
                    }.bind(this))
                })
                this.onCanvasOut(function (ev) {
                    let mouse = Tsh.Ddm.Input.mouse
                    Tsh.Ddm.View.requestViewsAt(mouse.x,mouse.y,function(views){
                        
                    }.bind(this))
                })
                this.onCanvasPressAndHold(function (ev) {
                    let mouse = Tsh.Ddm.Input.mouse
                    Tsh.Ddm.View.requestViewsAt(mouse.x,mouse.y,function(views){
                        
                    }.bind(this))
                })
            }.bind(Tsh.Ddm.Input))
        },
        run: function () {
            window.requestAnimationFrame(this.step.bind(this));
        },
        step (timestamp) {
            if (start === undefined)
                start = timestamp;
            const elapsed = timestamp - start;

            var delta = timestamp - previousTimeStamp;

            if (previousTimeStamp !== timestamp) {
                this.update(delta)   
            }
            previousTimeStamp = timestamp
            var cb = this.step.bind(this)
            window.requestAnimationFrame(cb);

        },
        update(delta) {
            Tsh.Ddm.View    .update  (delta)
            Tsh.Ddm.Entity  .update(delta)
            Tsh.Ddm.Animator.update(delta)
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
        updateCursorLogic() {

        },
        restart() {

        },

        /**
         * Moves a entity into a given point in board
         * 
         * @param {Number} x The x coordinate of target location
         * @param {Number} y The y coordinate of target location
         * @param {String} type The Type of moving to target location
         */
        makeEntityGoTo(entity,x,y,type){
            entity.go(new Point(x,y),type)
        },
        findPath(entity,x,y){
            var self = this,
                path = []
            if(entity){
                path = Tsh.Ddm.Path.findMovingPath("",entity,x,y)
            }
            return path;
        },
        registerEntityPosition(entity){
            if(entity){
                Tsh.Ddm.Entity.registerToEntityGrid(entity,entity.point.col,entity.point.row)
                Tsh.Ddm.Path  .registerToPathingGrid(entity,entity.point.col,entity.point.row)
            }
        },
        registerEntityDualPosition(entity){
            if(entity){
                Tsh.Ddm.Entity.registerToEntityGrid(entity,entity.point.col,entity.point.row)
                var nextPoint = entity.nextPoint()
                if(nextPoint.col >= 0 && nextPoint.row >= 0){
                    Tsh.Ddm.Entity.registerToEntityGrid(entity,nextPoint.col,nextPoint.row)
                    Tsh.Ddm.Path  .registerToPathingGrid(entity,nextPoint.col,nextPoint.row)
                }
            }
        },
        unregisterEntityPosition(entity){
            if(entity){
                Tsh.Ddm.Entity.removeFromEntityGrid(entity,entity.point.col,entity.point.row)
                Tsh.Ddm.Path  .removeFromPathingGrid(entity,entity.point.col,entity.point.row)
                var nextPoint = entity.nextPoint()

                if(nextPoint.col >= 0 && nextPoint.row >= 0){
                    Tsh.Ddm.Entity.removeFromEntityGrid(entity,nextPoint.col,nextPoint.row)
                    Tsh.Ddm.Path  .removeFromPathingGrid(entity,nextPoint.col,nextPoint.row)
                }
            }
        }
    }

    return Tsh
})