define(["ddm","jquery","entity/entityfactory","entity/monster","entity/land","entity/entity"],function(Tsh,$,EntityFactory,Monster,Land,Entity){
    console.log("LOAD TSH.DDM.ENTITY")
    Tsh = Tsh || {}
    Tsh.Ddm = Tsh.Ddm || {}

    Tsh.Ddm.Entity = {
        init(){
            this.entities = {}
            this.entityGrid = null
        },
        addEntity(entity){
            if(this.entities[entity.id] === undefined){
                this.entities[entity.id] = entity
                this.registerToEntityGrid(entity)

                if(this._onAddEntity){
                    this._onAddEntity(entity)
                }
            }else{
                console.log("This entity already exist")
            }
        },
        removeEntity(entity){
            if(entity.id in this.entities){
                if(this._onRemoveEntity)
                    this._onRemoveEntity(entity)
                this.unregisterEntityPosition(entity)
                delete this.entities[entities.id]
            }   
        },
        forEachEntity(callback){
            for(var i in this.entities){
                var entity = this.entities[i]
                callback(entity)
            }
        },
        update(delta){
            forEachEntity((entity)=>{
                if(isFunction(entity.update))
                    entity.update(delta)
            })
        },
        entityIdExists(id){
            return id in this.entities
        },
        getEntityById(id){
            if(id in this.entities){
                return this.entities[id]
            }else{
                console.log("Non-exist Entity "+id)
            }
        },
        getEntityByClass(c){
            var lst = [];
            this.forEachEntity(function(entity){
                if(entity instanceof c){
                    lst.push(entity)
                }
            }.bind(this))
            return lst
        },
        //For Controlling Entities Grid
        initEntityGrid(map){
            if(this.entityGrid != null){
                console.log("[ERROR] Entity Grid alreay exist")
            }
            this.entityGrid = [];
            for(var i=0; i < map.height; i += 1) {
                this.entityGrid[i] = [];
                for(var j=0; j < map.width; j += 1) {
                    this.entityGrid[i][j] = {};
                }
            }
            log.info("Initialized the entity grid.");

        },


        removeFromEntityGrid(entity,col,row){
            if(this.entityGrid[row][col][entity.id]){
                delete this.entityGrid[row][col][entity.id]
            }
        },
        registerEntityDualPosition(entity){
            if(entity){
                this.entityGrid[entity.point.row][entity.point.col][entity.id]=entity
                
                var nextPoint = entity.nextPoint()
                if(nextPoint.col >= 0 && nextPoint.row >= 0){
                    this.entityGrid[nextPoint.row][nextPoint.col][entity.id] = entity
                }
            }
        },
        unregisterEntityPosition(entity){
            if(entity){
                this.removeFromEntityGrid(entity,entity.point.col,entity.point.row)
                var nextPoint = entity.nextPoint()
                if(nextPoint.col >= 0 && nextPoint.row >= 0){
                    this.removeFromEntityGrid(entity,nextPoint.col,nextPoint.row)
                }
            }
        },
        registerToEntityGrid(entity){
            var col = entity.point.col,
                row = entity.point.row

            if(entity){
                if(entity instanceof Monster || entity instanceof Land){
                    this.entityGrid[row][col][entity.id] = entity
                }
            }
        },

        getEntityAt(col,row){
            if(!this.entityGrid){
                return null;
            }
            var entites = this.entityGrid[row][col], entity = null;
            if(Object.keys(entites).length > 0){
                entity = entites[Object.keys(entites)[0]]
            }
            return entity
        },

        //SPECIFY ENTITY
        isMonsterOnSameTile(monster,col,row){
            var Col = col || monster.point.col,
                Row = row || monster.point.row,
                list = this.entityGrid[Row][Col],
                result =false;
            var keys = Object.keys(list);
            for(var i in keys){
                var entity = keys[i]
                if(entity instanceof Monster && entity.id !== monster.id){
                    result = true;
                }
            }
            return result;
        },
        isMonsterOnLand(monster,col,row){
            var Col = col || monster.point.col,
                Row = row || monster.point.row,
                list = this.entityGrid[Row][Col],
                result =false;
            var keys = Object.keys(list);
            for(var i in keys){
                var entity = keys[i]
                if(entity instanceof Land){
                    result = true;
                }
            }
            return result;

        },     

        //Creating Entity
        spawnEntity(kind,id,x,y,name,controllerid,target){
            var result;
            if(this.isLand(kind)){
                var item    = EntityFactory.createEntity(kind,id)
                result  = this.addLand(item,x,y,controllerid)
                if(result){
                    if(this._onSpawnLand)
                        this._onSpawnLand(item,x,y)
                }
            }else if(this.isItem(kind)){
                var item    = EntityFactory.createEntity(kind,id)
                result  = this.addItem(item,x,y,controllerid)
                if(result){
                    if(this._onSpawItem)
                        this._onSpawItem(item,x,y)
                }
            }else if(this.isMonster(kind)){
                var item    = EntityFactory.createEntity(kind,id)
                result  = this.addMonster(item,x,y,controllerid,target)
                if(result){
                    if(this._onSpawnMonster)
                        this._onSpawnMonster(item,x,y)
                }
            }else if(this.isMonsterLord(kind)){
                var item = EntityFactory.createEntity(kind,id,name)
                if(this.addMonster(item,x,y,controllerid,target)){
                    if(this._onSpawnMonsterLord)
                        this._onSpawnMonsterLord(item,x,y,target)
                }
            }
        },

        despawnEntity(id){
            if(this._onDespawnEntity)
                this._onDespawnEntity(id)
        },

        //Handle When Adding Specify Monster to list
        addMonster(entity,x,y,target){
            if(!this.entityIdExists(entity.id)){
                // this.setGridPosition(new Point(x,y))
                this.addEntity(entity)
                return true;
            }else{
                return false
            }
        },
        addLand(entity,x,y,target){
            // this.setGridPosition(new Point(x,y))
            this.addEntity(entity)
            return true;
        },
        addItem(entity,x,y){
            // this.setGridPosition(new Point(x,y))
            this.addEntity(entity)
            return true;

        },

        //Checking Entity Kind
        isLand(kind){
            return ["NormalLand","PoisonLand","DestroyedLand","GrassLand","PortalLand"].includes(kind)
        },
        isMonster(kind){
            return ["DummyMonster1","DummyMonster2"].includes(kind)
        },
        isMonsterLord(kind){
            return false
        },
        isItem(kind){
            return false
        },

        //Callback
        onAddEntity     (callback){ this._onAddEntity = callback},
        onRemoveEntity  (callback){ this._onRemoveEntity = callback},
        onUpdateList    (callback){this._onUpdateList = callback},
        
        onSpawnPiece            (callback){this._onSpawnMonster = callback},
        onSpawnMonsterLord      (callback){this._onSpawnMonsterLord = callback},
        onSpawnLand(callback){this._onSpawnLand = callback},
        onSpawnItem(callback){this._onSpawItem = callback},
        onDespawnEntity(callback){this._onDespawnEntity = callback},

        onConstructingPiece(callback){this._onConstructingPiece = callback},
        onConstructingLand(callback){this._onConstructingLand = callback},
        onConstructingItem(callback){this._onConstructingItem = callback},
    }
})