define(function(){
    var DummyMonster = {

        //Predefine Stat
        name    : "DummyMonster4",
        atk     : 10,
        defend  : 20,
        level   : 4,
        crests  : ["attack", "attack", "defend", "summon", "summon"],
        avatarimg: "DummyMonster4_avatarImg.png",
        profileimg:"DummyMonster4_profileImg.png",

        
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