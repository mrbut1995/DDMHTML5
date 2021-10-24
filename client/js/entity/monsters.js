define(["entity/monster"],function(Monster){
    var Monsters = {
        DummyMonster1 : Monster.extend({}),
        DummyMonster2 : Monster.extend({}),
    };
    return Monsters
})