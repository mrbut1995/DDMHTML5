define(["entity/land"],function(Land){
    var Lands = {
        NormalLand      : Land.extend({}),
        PoisonLand      : Land.extend({}),
        DestroyedLand   : Land.extend({}),
        GrassLand       : Land.extend({}),
        PortalLand      : Land.extend({}),
    };
    return Lands
})