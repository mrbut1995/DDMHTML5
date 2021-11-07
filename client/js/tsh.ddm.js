let start, previousTimeStamp;
var Tsh = Tsh || {}
Tsh.Ddm = Tsh.Ddm || {}

/**
 * @typedef {Object} ViewGroup
 * @property {object} point 
 * @property {object} monsterview    
 * @property {object} landview       
 * @property {object} monsterlordview
 * @property {object} itemview       
 */

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
            Tsh.Ddm.Input.init(Tsh.Ddm)

            Tsh.Ddm.Animator.init(Tsh.Ddm)
            Tsh.Ddm.Client.init(Tsh.Ddm)
            Tsh.Ddm.Player.init(Tsh.Ddm)
            Tsh.Ddm.Match.init(Tsh.Ddm)
            Tsh.Ddm.Path.init(Tsh.Ddm)
            Tsh.Ddm.Board.init(Tsh.Ddm)

            this.connectServer();

            Tsh.Ddm.Debug.init(Tsh.Ddm)

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
                    console.log("Spawn entity ", id)
                    Tsh.Ddm.Entity.spawnEntity(kind, id, x, y, name, controllerid, target)
                });
                Tsh.Ddm.Client.onDespawnEntity(function (player, id) {
                    console.log("Despawn entiy ", id)
                    Tsh.Ddm.Entity.despawnEntity(id)
                })

                Tsh.Ddm.Client.onEntityMove(function (playerid, id, x, y, type) {
                    var entity = null;
                    if (playerid === Tsh.Ddm.Player.playerid) {
                        console.log("By client Player Control ", id)
                        entity = Tsh.Ddm.Entity.getEntityById(id)

                        if (entity) {
                            entity.idle()
                            self.makeEntityGoTo(entity, x, y)
                        } else {
                            console.log("CANNOT FIND ENTITY ", id)
                        }
                    } else {
                        console.log("Not by client Player Control")
                        entity = Tsh.Ddm.Entity.getEntityById(id)

                        if (entity) {
                            entity.idle()
                            self.makeEntityGoTo(entity, x, y)
                        } else {
                            console.log("CANNOT FIND ENTITY ", id)
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
                Tsh.Ddm.Client.onRollDice(function (playerid, dice, result) {

                });
                Tsh.Ddm.Client.onPhaseChanged(function (playerid, changephase) {

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

            Tsh.Ddm.Board.onInitialized(function () {

            })
            Tsh.Ddm.Entity.onInitialized(function () {


                this.onAddEntity(function (entity) {
                    Tsh.Ddm.Entity.registerToEntityGrid(entity, entity.point.col, entity.point.row)
                    Tsh.Ddm.Path.registerToPathingGrid(entity, entity.point.col, entity.point.row)
                    Tsh.Ddm.Animator.registerEntityAnimator(entity)
                    Tsh.Ddm.View.registerEntityView(entity)
                    Tsh.Ddm.Input.registerEntityInput(entity)
                }.bind(this))

                this.onRemoveEntity(function (entity) {
                    Tsh.Ddm.Entity.removeFromEntityGrid(entity, entity.point.col, entity.point.row)
                    Tsh.Ddm.Path.removeFromPathingGrid(entity, entity.point.col, entity.point.row)
                    Tsh.Ddm.Animator.unregisterEntityAnimator(entity)
                    Tsh.Ddm.View.unregisterEntityView(entity)
                    Tsh.Ddm.Input.unregisterEntityInput(entity)
                }.bind(this))


                this.onRequestEntities(function (entitieIds) {
                    console.log("request data from list", entitieIds)
                    Tsh.Ddm.Client.sendQuery(entitieIds)
                })
                this.onSpawnMonster(function (entity, col, row, controllerid, target) {
                    var _view = Tsh.Ddm.View.generateView(entity.view)
                    entity.setView(_view)
                    entity.setGridPosition(col, row)

                    Tsh.Ddm.Entity.addEntity(entity)


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
                        var path = self.findPath(entity, point.col, point.row)
                        return path
                    })
                    entity.onStartPath(function (path) {
                        self.unregisterEntityPosition(entity)
                    })
                    entity.onBeforeStep(function () {
                        self.unregisterEntityPosition(entity)
                    })
                    entity.onStep(function () {
                        if (entity.hasNextStep()) {
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
                    entity.setGridPosition(col, row)

                    Tsh.Ddm.Entity.addEntity(entity)

                }.bind(this))

                this.onSpawnLand(function (entity, col, row, controllerid) {
                    var _view = Tsh.Ddm.View.generateView(entity.view)
                    entity.setView(_view)
                    entity.setGridPosition(col, row)

                    Tsh.Ddm.Entity.addEntity(entity)



                }.bind(this))

                this.onSpawnItem(function (entity, col, row, controllerid) {
                    var _view = Tsh.Ddm.View.generateView(entity.view)
                    entity.setView(_view)

                    Tsh.Ddm.Entity.addEntity(entity)

                    entity.setGridPosition(col, row)
                }.bind(this))

                this.onDespawnEntity(function (entity) {
                    Tsh.Ddm.Entity.removeEntity(entity)
                    entity.destroy()
                }.bind(this))

            }.bind(Tsh.Ddm.Entity))

            Tsh.Ddm.View.onInitialized(function () {
                Tsh.Ddm.Input.connectInput(this.getDOM("ddm-canvas"))
                Tsh.Ddm.Board.connectBoardView(this.getBoard())

                this.onViewCreated(function (view) {
                    if (view.type == "monster") {
                        view.setBoard(Tsh.Ddm.View.getBoard())
                    } else if (view.type == "monsterlord") {
                        view.setBoard(Tsh.Ddm.View.getBoard())
                    } else if (view.type == "land") {
                        view.setBoard(Tsh.Ddm.View.getBoard())
                    }
                    Tsh.Ddm.Animator.registerViewAnimator(view)
                }.bind(this))
                this.onViewDestroyed(function (view) {
                    Tsh.Ddm.Animator.unregisterViewAnimator(view)
                }.bind(this))
                this.onDirty(function () {

                }.bind(this))
            }.bind(Tsh.Ddm.View))

            Tsh.Ddm.Input.onInitialized(function () {
                this.onCanvasClicked(function (ev) {
                    let mouse = Tsh.Ddm.Input.mouse
                    console.log("onCanvasClicked")
                    Tsh.Ddm.View.requestViewsAt(mouse.x, mouse.y, function (views) {
                        for (var i in views) {
                            if (views[i].type == "monster") {
                                var monster = Tsh.Ddm.Entity.getEntityByView(views[i])
                                Tsh.Ddm.Debug.onMonsterClickedDebug(monster)
                                return;
                            } else {
                                console.log("NOT MONSTER TYPE => SKIP")
                            }
                        }
                    }.bind(this))
                })
                this.onCanvasPressed(function (ev) {
                    let mouse = Tsh.Ddm.Input.mouse
                    Tsh.Ddm.View.requestViewsAt(mouse.x, mouse.y, function (views) {

                    }.bind(this))
                })
                this.onCanvasReleased(function (ev) {
                    let mouse = Tsh.Ddm.Input.mouse
                    Tsh.Ddm.View.requestViewsAt(mouse.x, mouse.y, function (views) {

                    }.bind(this))
                })
                this.onCanvasHover(function (ev) {
                    let mouse = Tsh.Ddm.Input.mouse
                    Tsh.Ddm.View.requestViewsAt(mouse.x, mouse.y, function (views) {

                    }.bind(this))
                    Tsh.Ddm.Debug.onCanvasHoverDebug(mouse)
                })
                this.onCanvasOut(function (ev) {
                    let mouse = Tsh.Ddm.Input.mouse
                    Tsh.Ddm.View.requestViewsAt(mouse.x, mouse.y, function (views) {

                    }.bind(this))
                })
                this.onCanvasPressAndHold(function (ev) {
                    let mouse = Tsh.Ddm.Input.mouse
                    Tsh.Ddm.View.requestViewsAt(mouse.x, mouse.y, function (views) {

                    }.bind(this))
                })
            }.bind(Tsh.Ddm.Input))
        },
        run: function () {
            window.requestAnimationFrame(this.step.bind(this));
        },
        step(timestamp) {
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
            Tsh.Ddm.View.update(delta)
            Tsh.Ddm.Entity.update(delta)
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
        makeEntityGoTo(entity, x, y, type) {
            entity.go(new Point(x, y), type)
        },

        findPath(entity, x, y) {
            var self = this,
                path = []
            if (entity) {
                path = Tsh.Ddm.Path.findMovingPath("", entity, x, y)
            }
            return path;
        },
        registerEntityPosition(entity) {
            if (entity) {
                Tsh.Ddm.Entity.registerToEntityGrid(entity, entity.point.col, entity.point.row)
                Tsh.Ddm.Path.registerToPathingGrid(entity, entity.point.col, entity.point.row)
            }
        },
        registerEntityDualPosition(entity) {
            if (entity) {
                Tsh.Ddm.Entity.registerToEntityGrid(entity, entity.point.col, entity.point.row)
                var nextPoint = entity.nextPoint()
                if (nextPoint.col >= 0 && nextPoint.row >= 0) {
                    Tsh.Ddm.Entity.registerToEntityGrid(entity, nextPoint.col, nextPoint.row)
                    Tsh.Ddm.Path.registerToPathingGrid(entity, nextPoint.col, nextPoint.row)
                }
            }
        },
        unregisterEntityPosition(entity) {
            if (entity) {
                Tsh.Ddm.Entity.removeFromEntityGrid(entity, entity.point.col, entity.point.row)
                Tsh.Ddm.Path.removeFromPathingGrid(entity, entity.point.col, entity.point.row)
                var nextPoint = entity.nextPoint()

                if (nextPoint.col >= 0 && nextPoint.row >= 0) {
                    Tsh.Ddm.Entity.removeFromEntityGrid(entity, nextPoint.col, nextPoint.row)
                    Tsh.Ddm.Path.removeFromPathingGrid(entity, nextPoint.col, nextPoint.row)
                }
            }
        },

        /**
        * Check if group is empty
        * @param {EntityGroup} entitygroup Entity Group need to checked
        * @return {boolean}    Result if  entity group is empty
        */
        isGroupEmpty(entitygroup) {
            return !(entitygroup.monster || entitygroup.land || entitygroup.monsterlord || entitygroup.item)
        },

        /**
        * Check if group is flat place or not
        * @param {EntityGroup} entitygroup Entity Group need to checked
        * @return {boolean}    Result if  entity group is flat place or not
        */
        isGroupFlat(entitygroup) {
            return !(entitygroup.monster || entitygroup.monsterlord || entitygroup.item)
        },

        /**
         * Check if can be placed into Entity Group (Empty Cell)
         * @param {EntityGroup} entitygroup Entity Group need to checked
         * @return {boolean}    Result if can be placed into entity group
         */
        isGroupPlaceable(entitygroup) {
            return !(entitygroup.monster || entitygroup.land || entitygroup.monsterlord || entitygroup.item)
        },

        /**
        * Check if can be moved into Entity Group (Not Contain monster/item/monster lord | non-solid monster/item/monster lord)
        * @param {EntityGroup} entitygroup Entity Group need to checked
        * @return {boolean}    Result if can not be moved into entity group
        */
        isGroupMovable(entitygroup) {
            return !((entitygroup.monster && entitygroup.monster.isSolid())
                || (entitygroup.item && entitygroup.item.isSolid())
                || (entitygroup.monsterlord && entitygroup.monsterlord.isSolid()))
        },

        /**
        * Check if can not be placed into Entity Group
        * @param {EntityGroup} entitygroup Entity Group need to checked
        * @return {boolean}    Result if can be placed into entity group
        */
        isGroupUnplaceable(entitygroup) {
            return !this.isGroupPlaceable(entitygroup)
        },

        /**
        * Check if can not be moved into Entity Group (solid Monster/solid Land/solid Item/solid MonsterLord )
        * @param {EntityGroup} entitygroup Entity Group need to checked
        * @return {boolean}    Result if can not be moved into entity group
        */
        isGroupNonmovable(entitygroup) {
            return !this.isGroupMovable(entitygroup)
        },

        /**
         * Retritve list of View Group from Entity Group
         * @param {EntityGroup} entitygroup entity group that need to get view from
         * @returns {ViewGroup} view group from list of entity group
         */
        getGroupView(entitygroup) {
            var viewgroup = {
                point: null,
                topview: null,
                monsterview: null,
                landview: null,
                monsterlordview: null,
                itemview: null,
            }
            if (!entitygroup) {
                return viewgroup
            }
            viewgroup.point = entitygroup.point
            if (entitygroup.top) {
                viewgroup.topview = entitygroup.top.getView()
            }
            if (entitygroup.monster) {
                viewgroup.monsterview = entitygroup.monster.getView()
            }
            if (entitygroup.land) {
                viewgroup.landview = entitygroup.land.getView()
            }
            if (entitygroup.monsterlord) {
                viewgroup.monsterlordview = entitygroup.monsterlord.getView()
            }
            if (entitygroup.item) {
                viewgroup.itemview = entitygroup.item.getView()
            }
            return viewgroup
        },
        highlighPlaceableInRegion(region) {
            Tsh.Ddm.View.clearAllHighlight()
            var groups = Tsh.Ddm.Entity.getEntityGroupsAtRegion(region)
            this.highlightPlaceableInList(groups)
            this.highlightNonPlaceableInList(groups)
        },
        highlightMoveableInRegion(region) {
            Tsh.Ddm.View.clearAllHighlight()
            var groups = Tsh.Ddm.Entity.getEntityGroupsAtRegion(region)
            this.highlightMoveableInList(groups)
            this.highlightNonMovableInList(groups)
        },

        /**
        * Highlight all the Flat Cell (Empty Cell / Land) in the list
        * @param {EntityGroup[]} list 
        */
        highlightFlatInList(list) {
            var points = []
            var lands = []
            var monsters = []
            var items = []
            for (var i in list) {
                var e = list[i]
                if(this.isGroupFlat(e)){
                    var v = this.getGroupView(e)
                    if(this.isGroupEmpty(e)){
                        points.push(v.point)
                    }else{
                        lands.push(v.landview)
                        monsters.push(v.monsterview)
                        items.push(v.itemview)
                    }
                }
            }
            Tsh.Ddm.View.highlightBoardView(points)
            Tsh.Ddm.View.highlightLandView(lands)
            Tsh.Ddm.View.highlightMonsterView(monsters)
            Tsh.Ddm.View.highlightItemView(items)
        },

        /**
         * Highlight all the cell and item that can movable (Land/ Monster that can move throguht) in the list
         * @param {EntityGroup[]} list 
         */
        highlightMoveableInList(list) {
            var points = []
            var lands = []
            var monsters = []
            var items = []
            for (var i in list) {
                var e = list[i]
                if(this.isGroupMovable(e)){
                    var v = this.getGroupView(e)
                    if(this.isGroupEmpty(e)){
                        points.push(v.point)
                    }else{
                        lands.push(v.landview)
                        monsters.push(v.monsterview)
                        items.push(v.itemview)
                    }
                }
            }
            Tsh.Ddm.View.highlightBoardView(points)
            Tsh.Ddm.View.highlightLandView(lands)
            Tsh.Ddm.View.highlightMonsterView(monsters)
            Tsh.Ddm.View.highlightItemView(items)
        },


        /**
         * Highlight all the cell and Item that cannot move throught (Monster/Item/MonsterLord) in the list
         * @param {EntityGroup[]} list 
         */
        highlightNonMovableInList(list) {
            var points = []
            var lands = []
            var monsters = []
            var items = []
            for (var i in list) {
                var e = list[i]
                if(this.isGroupNonmovable(e)){
                    var v = this.getGroupView(e)
                    if(this.isGroupEmpty(e)){
                        points.push(v.point)
                    }else{
                        lands.push(v.landview)
                        monsters.push(v.monsterview)
                        items.push(v.itemview)
                    }
                }
            }
            Tsh.Ddm.View.highlightBoardView(points)
            Tsh.Ddm.View.highlightLandView(lands)
            Tsh.Ddm.View.highlightMonsterView(monsters)
            Tsh.Ddm.View.highlightItemView(items)
        },

        /**
         * Highlight all the cell and item that can placed Land (Empty Cell) in the list
         * @param {EntityGroup[]} list 
         */
        highlightPlaceableInList(list) {
            var points = []
            var lands = []
            var monsters = []
            var items = []
            for (var i in list) {
                var e = list[i]
                if(this.isGroupPlaceable(e)){
                    var v = this.getGroupView(e)
                    if(this.isGroupEmpty(e)){
                        points.push(v.point)
                    }else{
                        lands.push(v.landview)
                        monsters.push(v.monsterview)
                        items.push(v.itemview)
                    }
                }
            }
            Tsh.Ddm.View.highlightBoardView(points)
            Tsh.Ddm.View.highlightLandView(lands)
            Tsh.Ddm.View.highlightMonsterView(monsters)
            Tsh.Ddm.View.highlightItemView(items)
        },

        /**
         * Highlight all the cell and item that is non-placebale (Monster/Land/Item/MonsterLord) in list
         * @param {EntityGroup[]} list 
         */
        highlightNonPlaceableInList(list) {
            var points = []
            var lands = []
            var monsters = []
            var items = []
            for (var i in list) {
                var e = list[i]
                if(this.isGroupUnplaceable(e)){
                    var v = this.getGroupView(e)
                    if(this.isGroupEmpty(e)){
                        points.push(v.point)
                    }else{
                        lands.push(v.landview)
                        monsters.push(v.monsterview)
                        items.push(v.itemview)
                    }
                }
            }
            Tsh.Ddm.View.highlightBoardView(points)
            Tsh.Ddm.View.highlightLandView(lands)
            Tsh.Ddm.View.highlightMonsterView(monsters)
            Tsh.Ddm.View.highlightItemView(items)
        },

    }

    return Tsh
})