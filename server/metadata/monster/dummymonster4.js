define(function(){
    var DummyMonster = {

        //Predefine Stat
        name    : "DummyMonster4",
        atk     : 10,
        defend  : 20,
        level   : 4,
        crests  : ["attack", "attack", "defend", "summon", "summon"],
        pieceimg: "MBB_014010.png",
        portraitimg:"MBB_014010.png",
        
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