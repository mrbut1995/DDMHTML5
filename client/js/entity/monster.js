define(["entity/piece","view/views"],function(Piece){
    var Monster = Piece.extend({
        init(){
            this._super()

            this.view = new Views.MonsterView()
            
            this.attack = 0
            this.defend = 0
            this.movement = 0
            this.movetype = "walk"
            this.targets   = []
            this.attacker  = {}

            //Status
            this.status   = "alive"
            this.attackmode = false
            this.movemode   = false
            this.effectmode = false
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