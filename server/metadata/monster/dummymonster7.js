define(function(){
    var DummyMonster = {

        //Predefine Stat
        name    : "DummyMonster6",
        atk     : 10,
        defend  : 20,
        level   : 4,
        crests  : ["attack", "attack", "defend", "summon", "summon"],
        pieceimg: "MBB_014013.png",
        portraitimg:"MBB_014013.png",

        
        init(id) {
            this.hp = 10
            this._super(id)
        },

        
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