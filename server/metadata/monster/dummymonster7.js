define(function(){
    var DummyMonster = {

        //Predefine Stat
        name    : "DummyMonster6",
        atk     : 10,
        defend  : 20,
        lvl     : 4,
        hp      : 20,
        movement: "normal",

        dice : {
            faces: ["attack", "attack", "defend", "summon", "summon","movement"],
        },
        pieceimg: "MBB_014013.png",
        portraitimg:"MBB_014013.png",

        
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