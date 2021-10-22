define(["entity/monster","view/views"],function(Monster){
    var MonsterLord = Monster.extend({
        init(){
            this._super()
        
            this.lifepoint = 0
        },
    })
    return MonsterLord;
})