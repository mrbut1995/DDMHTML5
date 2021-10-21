define(["entity/monster","view/views"],function(Entity){
    var Monster = Entity.extend({
        init(){
            this._super()

            this.attack = 0
            this.defend = 0
            this.movement = 0
            this.movetype = "walk"
            this.status   = "alive"
            this.targets   = []
        },
        select(){

        },
        attack(target){

        },
        killed(source){

        },
        summon(){

        },
        move(point){

        },
        changestat(stat,value){

        },
        useeffect(effect){

        },
        trigger(){

        },
        ignight(){

        },
    })
    return Monster;
})