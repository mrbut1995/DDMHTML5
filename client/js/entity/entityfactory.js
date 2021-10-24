define(["entity/lands","entity/monsters"],function(Lands,Monster){
    var EntityFactory = {};
    EntityFactory.createEntity = function(kind,id,name){
        if(!kind){
            console.log("kind is undefined",true)
        }
        if(!isFunction(EntityFactory.builders[kind])){
            console.log(kind + " is not a valid Entity type");
            return null;
        }
        return EntityFactory.builder[kind](id,name);
    }

    //Builder Define
    EntityFactory.builders = {};

    //Monster
    EntityFactory.builders["DummyMonster1"] = function(id,name){
        return new Monsters.DummyMonster1(id)
    }
    EntityFactory.builders["DummyMonster2"] = function(id,name){
        return new Monsters.DummyMonster2(id)
    }

    //Land
    EntityFactory.builders["NormalLand"] = function(id,name){
        return new Lands.NormalLand(id)
    }
    EntityFactory.builders["PoisonLand"] = function(id,name){
        return new Lands.PoisonLand(id)
    }
    EntityFactory.builders["DestroyedLand"] = function(id,name){
        return new Lands.DestroyedLand(id)
    }
    EntityFactory.builders["GrassLand"] = function(id,name){
        return new Lands.GrassLand(id)
    }
    EntityFactory.builders["PortalLand"] = function(id,name){
        return new Lands.PortalLand(id)
    }

    return EntityFactory;
})