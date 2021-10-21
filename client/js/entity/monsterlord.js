define(["entity/monster","view/views"],function(Entity){
    var Monster = Entity.extend({
        init(){
            this._super()
        
            this.lifepoint = 0
        },
    })
    return Monster;
})