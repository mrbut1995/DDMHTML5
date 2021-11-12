define(["entity/lands", "entity/monsters", "entity/items","ddm"], function (Lands, Monsters, Items,Tsh) {
    console.log("LOAD ENTITY FACTORY")
    var EntityFactory = {};
    EntityFactory.createRequestEntityAsync = async function (kind, id, name) {
        if (!kind) {
            console.log("kind is undefined", true)
        }
        if (!(kind in EntityFactory.builders)) {
            console.log("Request Prototype of ", kind ," check Tsh = ",Tsh)
            var blueprint = await Tsh.Ddm.Blueprint.requestBlueprintMonsterAsync(kind)
            console.log("Result request Monster Metadata ", blueprint)
            if (blueprint && blueprint.classdata) {
                console.log("Assign Builder for ",kind)
                //Assign Builder 
                EntityFactory.builders[kind] = function (id) {
                    return new blueprint.classdata(id)
                }
            }
        }
        if (!isFunction(EntityFactory.builders[kind])) {
            console.log(kind + " is not a valid Entity type");
            return null;
        }
        var object = null
        try {
            object = EntityFactory.builders[kind](id, name)
        } catch (err) {
            console.log("[ERROR] Cannot created Object:", err)
        }
        return object;
    }

    //Builder Define
    EntityFactory.builders = {};

    //Land
    EntityFactory.builders["NormalLand"] = function (id) {
        return new Lands.NormalLand(id)
    }
    EntityFactory.builders["PoisonLand"] = function (id) {
        return new Lands.PoisonLand(id)
    }
    EntityFactory.builders["DestroyedLand"] = function (id) {
        return new Lands.DestroyedLand(id)
    }
    EntityFactory.builders["GrassLand"] = function (id) {
        return new Lands.GrassLand(id)
    }
    EntityFactory.builders["PortalLand"] = function (id) {
        return new Lands.PortalLand(id)
    }

    return EntityFactory;
})