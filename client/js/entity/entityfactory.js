define(["entity/lands", "entity/monsters", "entity/items","ddm"], function (Lands, Monsters, Items,Tsh) {
    console.log("LOAD ENTITY FACTORY")
    var EntityFactory = {};
    EntityFactory.createRequestEntityAsync = async function (kind,id,name,playerid) {

        if (!kind) {
            console.log("kind is undefined")
            return null
        }

        if (!(kind in EntityFactory.builders)) {
            var prototype = await EntityFactory.requestBuilderPrototype(kind)
            if(prototype){
                EntityFactory.registerBuilder(kind,prototype)
            }else{
                console.log("[ERROR]Cannot find prototype")
            }
        }

        if (!isFunction(EntityFactory.builders[kind])) {
            console.log(kind + " is not a valid Entity type");
            return null;
        }
        
        var object = null
        // try {
            object = EntityFactory.builders[kind](id,name,playerid,kind)
        // } catch (err) {
            // console.log("[ERROR] Cannot created Object:", err)
        // }
        return object;
    }

    EntityFactory.requestBuilderPrototype = async function(kind){
        console.log("Request Prototype of ", kind ," check Tsh = ",Tsh)
        var blueprint = await Tsh.Ddm.Blueprint.requestBlueprintMonsterAsync(kind)
        console.log("Result request Monster Metadata ", blueprint)
        if(blueprint && blueprint.classdata){
            return blueprint.classdata
        }else{
            return null
        }
    }

    EntityFactory.registerBuilder = function(kind, prototype){
        console.log("register kind = ",kind)
        EntityFactory.builders[kind] = function(id,name,playerid,kind){
            console.log("Build ",kind)
            return new prototype(id,name,playerid,kind)
        }
    }
    
    //Builder Define
    EntityFactory.builders = {};

    //Land
    EntityFactory.builders["NormalLand"] = function (id,name,playerid,kind) {
        return new Lands.NormalLand(id,name,playerid,kind)
    }
    EntityFactory.builders["PoisonLand"] = function (id,name,playerid,kind) {
        return new Lands.PoisonLand(id,name,playerid,kind)
    }
    EntityFactory.builders["DestroyedLand"] = function (id,name,playerid,kind) {
        return new Lands.DestroyedLand(id,name,playerid,kind)
    }
    EntityFactory.builders["GrassLand"] = function (id,name,playerid,kind) {
        return new Lands.GrassLand(id,name,playerid,kind)
    }
    EntityFactory.builders["PortalLand"] = function (id,name,playerid,kind) {
        return new Lands.PortalLand(id,name,playerid,kind)
    }

    return EntityFactory;
})