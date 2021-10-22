define(["entity/entity","entity/land","entity/piece"],function(Entity,Land,Piece){
    var Entities = {
        //================ LAND
        NormalLand      : Land.extend({}),
        PoisonLand      : Land.extend({}),
        DestroyedLand   : Land.extend({}),
        GrassLand       : Land.extend({})
    }
    return Entities
})