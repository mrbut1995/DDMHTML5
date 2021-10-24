define(["ddm","jquery"],function(Tsh,$){
    Tsh.Ddm.Entities = {
        init(){
            this.entities = {}
            this.entityGrid = null
        },
        add(entity){
            if(this.entities[entity.id] === undefined){
                this.entities[entity.id] = entity
                if(this._onAddEntity){
                    this._onAddEntity(entity)
                }
            }else{
                console.log("This entity already exist")
            }
        },
        remove(entity){
            if(entity.id in this.entities){
                if(this._onRemoveEntity)
                    this._onRemoveEntity(entity)
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
        registerToEntityGrid(entity,col,row){
            if(this.entityGrid[row][col][entity.id]){
                console.log("[ERROR] Already in Register list")
            }else{
                
            }
        },
        getEntityAt(col,row){

        },
        //Callback
        onAddEntity(callback){ this._onAddEntity = callback},
        onRemoveEntity(callback){ this._onRemoveEntity = callback},
        onUpdateList(callback){this._onUpdateList = callback}
    }
})