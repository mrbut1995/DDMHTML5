define(function(){
    var DummyMonster = {

        //Predefine Stat
        name    : "DummyMonster",
        atk     : 10,
        defend  : 20,
        lvl     : 4,
        hp      : 20,
        movement: "normal",

        dice : {
            faces: ["summon", "summon", "summon", "summon", "summon","summon"],
        },
        pieceimg: "MBB_014003.png",
        portraitimg:"MBB_014003.png",
        
        beforeSummon(){

        },
        afterSummon(){

        },
        beforeAttack(){

        },
        attackDeclare(){

        },
        damageCalculate(){

        },
        afterAttack(){

        },
        active(){

        },
        beforeDestroy(){

        },
        afterDestroy(){

        },
        standbyPhase(){

        },
        mainPhase(){

        },
        endPhase(){

        },
        hurted(){

        },
        walk(){

        },
        stepOn(){

        },
        fly(){

        },
        teleport(){

        },
        changeStat(name,value){
            
        },
    };
    return DummyMonster;    
})