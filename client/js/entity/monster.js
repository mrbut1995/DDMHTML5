define(["entity/piece","view/views","animation/animations"],function(Piece,Views,Animations){
    var Monster = Piece.extend({
        init(){
            this._super()

            this.view = new Views.MonsterView()
            
            this.attack = 0
            this.defend = 0
            this.move   = 3
            this.movetype = "walk"

            //Status
            this.status   = "alive"
            this.attackmode = false
            this.movemode   = false
            this.effectmode = false

            //Pathing
            this.movement = new Animations.PositionAnimation()
            this.path = null
            this.newDestination = null; //Coord
            this.destination = null;    //Point
            this.adjacentTiles = {}
            this.step = 0

            //Attack
            this.targets   = []
            this.attacker  = {}
            this.unconfirmedTarget = null

            //Trigger Effect
            this.triggerTargets = {}
            this.triggerCondition = null
            this.isTriggered = {}
            this.triggerEffect = null
            this.triggeredBy =  {}

            //Continuous Effect
            this.continuousTargets = {}

            //Animating
            this.atkSpeed = 50
            this.moveSpeed = 120
            this.walkSpeed = 100
            this.summonSpeed = 150
            this.effectSpeed = 120
            this.idleSpeed = 450
        },
        select(){

        },
        attack(target){
            this.animate("attack",{
                speed : this.atkSpeed,
                count : 1
            })
        },
        hurted(source){
            this.animate("hurted",{
                speed : this.atkSpeed,
            })
        },
        killed(source){
            this.animate("killed",{
                speed : this.summonSpeed,
            })
        },
        summon(){
            this.animate("summoned",{
                speed : this.summonSpeed,
            })
        },
        changestat(stat,value){

        },
        useeffect(effect){

        },

        //Step
        onBeforeStep(callback){
            this._onBeforeStep =callback
        },
        onStep(callback){
            this._onStep = callback
        },
        nextStep(){

        },

        //Path Movement
        //Callback
        onRequestPath(callback){
            this._onRequestPath = callback
        },
        onStartPath(callback){
            this._onStartPath = callback
        },
        onStopPath(callback){
            this._onStopPath = callback
        },
        requestPathfindingTo(point){
            if(this._onRequestPath){
                return this._onRequestPath(point)
            }else{
                console.log(this.id + " couldn't request pathfinding to "+point.x+","+point.y)
                return []
            }
        },
        followPath(path){
            if(path.length > 1){
                this.path = path;
                this.step = 0;

                if(this._onStartPath){
                    this._onStartPath(path)
                }
            }
        },

        walk(point){

        },
        canMove(){

        },
        isMoving(){

        },
        _continueTo(coord){
            this.newDestination = coord
        },
        _moveTo(point){
            this.destination = point
            this.adjacentTiles = {}
            if(this.isMoving()){
                this._continueTo(point)
            }else{
                var path = this.requestPathfindingTo(point)
                this.followPath(path)
            }
        },
        

        //Attacking Handle
        isAttackedBy(piece){

        },
        addAttacker(piece){

        },
        removeAttacker(piece){
            
        },
        forEachAttacker(callback){

        },
        setTarget: function(character){

        },
        removeTarget: function(){

        },
        hasTarget: function(){

        },
        waitToAttack(piece){

        },
        isWaitingToAttack(character){

        },
        canAttack(time){

        },
        canReachTarget(){

        },
    })
    return Monster;
})