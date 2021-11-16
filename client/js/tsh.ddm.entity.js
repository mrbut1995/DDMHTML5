/**
 * @typedef {Object} EntityGroup
 * @property {object} point 
 * @property {object} monster    
 * @property {object} land       
 * @property {object} monsterlord
 * @property {object} item       
 */

define(["ddm","jquery","entity/entityfactory","entity/monster","entity/land","entity/item","entity/monsterlord"],function(Tsh,$,EntityFactory,Monster,Land,Item,MonsterLord){
    console.log("LOAD TSH.DDM.ENTITY")
    Tsh = Tsh || {}
    Tsh.Ddm = Tsh.Ddm || {}

    Tsh.Ddm.Entity = {
        
        init(app){
            this.entities         = {}
            this.entityGrid       = null
            this.groupGrid        = null
            this.map              = null
            this.obsoleteEntities = null

            /**@type {EntityGroup} */
            this.selected = {}

            this.app = app
            if(this._onInitialized){
                this._onInitialized()
            }
        },
        addEntity(entity){
            if(this.entities[entity.id] === undefined){
                this.entities[entity.id] = entity

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
                delete this.entities[entity.id]
            }   
        },
        
        forEachEntity(callback){
            _.each(this.entities,callback)
        },
        findIfEntity(callback){
            return _.find(this.entities,callback)
        },
        
        update(delta){
            this.forEachEntity((entity)=>{
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
        getEntityByView(view){
            return this.findIfEntity(function(entity){
                return entity.containView(view)
            })
        },
        getEntitiesByClass(c){
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
            console.log("Initialized the entity grid.");

        },
        registerToEntityGrid(entity,col,row){
            var col = entity.point.col,
                row = entity.point.row

            if(entity){
                this.entityGrid[row][col][entity.id] = entity
                
            }
        },
        removeFromEntityGrid(entity,col,row){
            if(this.entityGrid[row][col][entity.id]){
                delete this.entityGrid[row][col][entity.id]
            }
        },
        isOutOfBound(col,row){
            return col < 0 || row < 0 || col > 12 || row > 18 || col === undefined || row === undefined
        },
        /**
         * 
         * @param {number} col Column in board that contain entites
         * @param {number} row Row in board that contain entites
         * @returns {EntityGroup} 
         */
        getEntityGroupAt(col,row){
            var entity = {
                point       : null,
                first       : null,
                top         : null,
                monster     : null,
                land        : null,
                monsterlord : null,
                item        : null,
            }

            if(this.entityGrid == null){
                return entity;
            }
            if(this.isOutOfBound(col,row)){
                return entity;
            }

            entity.point = new Point(col,row)

            var entities =  this.entityGrid[row][col]
            if(!entities)
                return entity
                
            entity.first = _.first(entities)
            _.each(entities,function(e){
                if(e instanceof Monster){
                    entity.monster = e
                }else if(e instanceof Land){
                    entity.land = e
                }else if(e instanceof Item){
                    entity.item = e
                }else if(e instanceof MonsterLord){
                    entity.monsterlord = e
                }
            })
            if(entity.monsterlord){
                entity.top = entity.monsterlord
            }else if(entity.monster){
                entity.top = entity.monster
            }else if(entity.item){
                entity.top = entity.item
            }else if(entity.land){
                entity.top = entity.land
            }
            return entity
        },
        /**
         * Retrive List of Entity at region
         * @param {Point[]}         region  List of position need to get  
         * @return {EntityGroup[]}
         */
        getEntityGroupsAtRegion(region){
            var self = this
            var lst = _.map(region, p => self.getEntityGroupAt(p.col,p.row))
            // _.each(region,p => {
            //     if(isPoint(p)){
            //         lst.push(self.getEntityGroupAt(p.col,p.row))
            //     }
            // })
            console.log("lst = ",lst)
            return lst 
        },
        getEntityAt(col,row){
            return this.getEntityGroupAt(col,row).first;
        },
        getMonsterAt(col,row){
            return this.getEntityGroupAt(col,row).monster
        },
        getLandAt(col,row){
            return this.getEntityGroupAt(col,row).land
        },
        getMonsterLordAt(col,row){
            return this.getEntityGroupAt(col,row).monsterlord
        },
        getItemAt(col,row){
            return this.getEntityGroupAt(col,row).item
        },

        entityIds(){
            return _.keys(this.entities)
        },

        containIds(lst){
            var ids = this.entityIds()
            return _.intersection(lst,ids)
        },

        notContainIds(lst){
            var ids = this.entityIds()
            return _.difference(lst, _.intersection(lst,ids))
        },

        removeObsoleteEntities(){
            if(this.obsoleteEntities.length == 0){
                return;
            }
            _.each(this.obsoleteEntities,e => this.removeEntity(e))
            this.obsoleteEntities = [];
        },

        updateList(lst){
            var knowIds = this.containIds(lst),
                newIds  = this.notContainIds(lst),
                ids     = this.entityIds()
            this.obsoleteEntities = []

            //Find obsolete Entity
            this.obsoleteEntities = _.reject(this.entities,function(e){
                return _.include(knowIds,e.id)
            })

            //Remove all the obsolete
            this.removeObsoleteEntities()

            //Request the news Ids data
            if(newIds.length > 0){
                if(this._onRequestEntities){
                    this._onRequestEntities(newIds)
                }
            }
        },
        selectedEntity(entity){

        },
        deselectedEntity(entity){
            
        },
        //SPECIFY ENTITY
        isMonsterOnSameTile(monster,col,row){
            var Col = col || monster.point.col,
                Row = row || monster.point.row,
                list = this.entityGrid[Row][Col]
            return _.findIndex(list,e => e instanceof Monster && e.id !== monster.id) != -1
        },
        isMonsterOnLand(monster,col,row){
            var Col = col || monster.point.col,
                Row = row || monster.point.row,
                list = this.entityGrid[Row][Col]
            return _.findIndex(list,e => e instanceof Land) != -1
        },
             
        getSelected(){
            return this.selected
        },
        selectAt(col,row){
            this.selected.monster = this.getMonsterAt(col,row)
            this.selected.land    = this.getLandAt(col,row)
            if(this._onSelectedEntity){
                this._onSelectedEntity(this.selected)
            }
        },
        clearSelection(){
            this.selected.monster = null
            this.selected.land    = null
        },

        //Creating Entity
        async requestSpawnEntityAsync(kind,id,x,y,name,controllerid,target){
            console.log("spawnEntity")
            if(this.entityIdExists(id)){
                console.log("ALREADY CREATED ",id)
                return
            }

            var entity = await EntityFactory.createRequestEntityAsync(kind,id,name)
            console.log("Request get entity")
                if(isLandKind(kind)){
                    if(this._onSpawnLand)
                        this._onSpawnLand(entity,x,y)
                }else if(isItemKind(kind)){
                    if(this._onSpawItem)
                        this._onSpawItem(entity,x,y)
                }else if(isMonsterKind(kind)){
                    if(this._onSpawnMonster)
                        this._onSpawnMonster(entity,x,y)
                }else if(isMonsterLordKind(kind)){
                    if(this._onSpawnMonsterLord)
                        this._onSpawnMonsterLord(entity,x,y,target)
                }else{
                    console.log("CANNOT FIND")
                }    
        },

        async requestDespawnEntityAsync(id){
            var entity = this.getEntityById(id)
            if(entity){
                if(this._onDespawnEntity)
                    this._onDespawnEntity(entity)
            }
        },

        //Handle When Adding Specify Monster to list
        addMonster(entity,x,y,target){
            if(!this.entityIdExists(entity.id)){
                return true;
            }else{
                return false
            }
        },
        addLand(entity,x,y,target){
            return true;
        },
        addItem(entity,x,y){
            return true;
        },

        //Callback
        onAddEntity     (callback){ this._onAddEntity    = callback},
        onRemoveEntity  (callback){ this._onRemoveEntity = callback},
        
        onRequestEntities   (callback){ this._onRequestEntities = callback},

        onSpawnMonster            (callback){this._onSpawnMonster = callback},
        onSpawnMonsterLord      (callback){this._onSpawnMonsterLord = callback},
        onSpawnLand             (callback){this._onSpawnLand = callback},
        onSpawnItem(callback){this._onSpawItem = callback},
        onDespawnEntity(callback){this._onDespawnEntity = callback},

        onSelectedEntity(callback){this._onSelectedEntity = callback},

        onInitialized   (callback){this._onInitialized = callback},
        
    }
})