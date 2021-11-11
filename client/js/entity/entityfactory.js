define(["entity/lands", "entity/monsters", "entity/items"], function (Lands, Monsters, Items) {
    console.log("LOAD ENTITY FACTORY")
    var EntityFactory = {};
    EntityFactory.createRequestEntityAsync =async function (kind,id,name) {
        await new Promise(r => setTimeout(r, 2000))
        if (!kind) {
            console.log("kind is undefined", true)
        }
        if (!isFunction(EntityFactory.builders[kind])) {
            console.log(kind + " is not a valid Entity type");
            return null;
        }
        var object = null
        try {
            object = EntityFactory.builders[kind](id,name)
        } catch (err) {
            console.log("[ERROR] Cannot created Object:", err)
        }
        return object;
    }

    //Builder Define
    EntityFactory.builders = {};

    //Monster
    EntityFactory.builders["dummymonster1"] = function (id) {
        return new Monsters.dummymonster1.classdata(id)
    }
    EntityFactory.builders["dummymonster2"] = function (id) {
        return new Monsters.dummymonster2.classdata(id)
    }

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