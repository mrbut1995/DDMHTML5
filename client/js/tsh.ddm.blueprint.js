define(["jquery","ddm","entity/monster","entity/land","entity/item"],function($,Tsh,Monster,Land,Item){
    console.log("LOAD TSH.DDM.BLUEPRINT")
    Tsh = Tsh || {}
    Tsh.Ddm = Tsh.Ddm || {}
    Tsh.Ddm.Blueprint = {
        init(app){
            this.blueprint ={}
            this.blueprint.monster = {}
            this.blueprint.land    = {}
            this.blueprint.item    = {}
            console.log("this.blueprint = ",this.blueprint)

            this.app = app
            if(this._onInitialized){
                this._onInitialized()
            }
        },

         requestBlueprintMonsterAsync(name){
            if(this.containBlueprintMonster(name)){
                console.log("Contain Blueprint Monster ",name)
                return this.blueprint.monster[name]
            }
            this.blueprint.monster[name] = {}

            var data =  Tsh.Ddm.Loader.loadModule("server-meta-data/monster/"+name,function(){
                if(data){
                    if(data.status == "complete"){
                        this.blueprint.monster[name].classdata = Monster.extend(data.data)
                        this.blueprint.monster[name].metadata = data.data
                        console.log("SUCCESSED LOADING ",name," = ",this.blueprint.monster[name])
                    }
                }else{
                    console.log("[ERROR] current status = ",data.status)
                }
            }.bind(this))
            return this.blueprint.monster[name]
        },

        requestBlueprintLandAsync(name){
            if(this.containBlueprintLand(name)){
                console.log("Contain Blueprint Land ",name)
                return this.blueprint.land[name]
            }
            this.blueprint.land[name] = {}
             var data = Tsh.Ddm.Loader.loadModule("server-meta-data/land/"+name,function(){
                if(data){
                    if(data.status == "complete"){
                        console.log("get data = ",data.data)
                        this.blueprint.land[name].classdata = Land.extend(data.data)
                        this.blueprint.land[name].metadata  = data.data
                        console.log("SUCCESSED LOADING ",name," = ",this.blueprint.land[name])
                    }
                }else{
                    console.log("[ERROR] current status = ",data.status)
                }
            }.bind(this))
            console.log("WAIT")
            return this.blueprint.land[name]
        },

        requestBlueprintItemAsync(name){
            if(this.containBlueprintItem(name)){
                console.log("Contain Blueprint Item ",name)
                return this.blueprint.item[name]
            }
            this.blueprint.item[name] = {}
            var data = Tsh.Ddm.Loader.loadModule("server-meta-data/item/"+name,function(){
                if(data){
                    if(data.status == "complete"){
                        console.log("get data = ",data.data)
                        this.blueprint.item[name].classdata = Item.extend(data.data)
                        this.blueprint.item[name].metadata  = data.data
                        console.log("SUCCESSED LOADING ",name," = ",this.blueprint.item[name])
                    }
                }else{
                    console.log("[ERROR] current status = ",data.status)
                }
            }.bind(this))
            return this.blueprint.item[name]
        },

        containBlueprintMonster(name){
            return name in this.blueprint.monster
        },
        containBlueprintLand(name){
            return name in this.blueprint.land
        },
        containBlueprintItem(name){
            return name in this.blueprint.item
        },

        usingMonsterBlueprint(object,name){
            if(!(name in this.blueprint.monster))
                return false
            return object instanceof this.blueprint.monster[name].classdata
        },
        usingLandBlueprint(object,name){
            if(!(name in this.blueprint.land))
                return false
            return object instanceof this.blueprint.land[name].classdata
        },
        usingItemBlueprint(object,name){
            if(!(name in this.blueprint.item))
                return false
            return object instanceof this.blueprint.item[name].classdata
        },

        onInitialized   (callback){this._onInitialized = callback},
    }
})