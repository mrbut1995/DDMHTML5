define(["entity/piece", "view/views", "animation/animations"], function (Piece, Views, Animations) {
    var Monster = Piece.extend({
        init() {
            this._super()

            this.view = new Views.MonsterView()

            this.attack = 0
            this.defend = 0
            this.move = 3
            this.movetype = "walk"
            
            //Action
            this.canAction = true

            //Status
            this.status = "alive"
            this.attackmode = false
            this.movemode = false
            this.effectmode = false

            //Pathing
            this.movement = new Animations.PositionAnimation()
            this.path = null
            this.newDestination = null; //Coord
            this.destination = null;    //Point
            this.adjacentTiles = {}
            this.step = 0
            this.nextGridCol = -1
            this.nextGridRow = -1

            //Attack
            this.target  = null
            this.attackers = {}
            this.unconfirmedTarget = null

            //Trigger Effect
            this.triggerTargets = {}
            this.triggerCondition = null
            this.isTriggered = {}
            this.triggerEffect = null
            this.triggeredBy = {}

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
        select() {

        },
        engage(monster){
            this.attackmode = true;
            this.setTarget(monster);
        },
        disengage(monster){
            this.attackmode = false;
            this.removeTarget()
        },
        attack(target) {
            this.animate("attack", {
                speed: this.atkSpeed,
                count: 1
            })
            if(this._onAttack)
                this._onAttack()
        },
        idle(){
            this.animate("idle", {
                speed: this.atkSpeed,
            })
        },
        hurted(source) {
            this.animate("hurted", {
                speed: this.atkSpeed,
            })
            if(this._onAttacked)
                this._onAttacked()
        },
        killed(source) {
            this.animate("killed", {
                speed: this.summonSpeed,
            })
        },
        summon() {
            this.animate("summoned", {
                speed: this.summonSpeed,
            })
        },
        walk(point) {
            this.animate("walk", {
                speed: this.walkSpeed,
            })
        },
        fly(point) {
            this.animate("fly", {
                speed: this.walkSpeed,
            })
        },
        teleport(point) {
            this.animate("teleport", {
                speed: this.walkSpeed,
            })
        },

        changestat(stat, value) {

        },
        useeffect(effect) {

        },

        

        //Path Movement
        //Callback

        requestPathfindingTo(point) {
            if (this._onRequestPath) {
                return this._onRequestPath(point)
            } else {
                console.log(this.id + " couldn't request pathfinding to " + point.x + "," + point.y)
                return []
            }
        },
        followPath(path) {
            if (path.length > 1) {
                this.path = path;
                this.step = 0;

                if (this._onStartPath) {
                    this._onStartPath(path)
                }
            }
        },
        go(point) {
            this._moveTo(point)
        },
        stop() {
            if (this.isMoving()) {
                this.interrupted = true
            }
        },
        isMoving() {
            return !(this.path === null)
        },
        hasNextStep: function () {
            return !(this.path.length - 1 > this.step)
        },
        updatePositionOnGrid() {
            var col = this.path[this.step].col
            var row = this.path[this.step].row
            this.setGridPosition(col, row)
        },
        hasChangedItsPath() {
            return !(this.newDestination === null);
        },
        _continueTo(coord) {
            this.newDestination = coord
        },
        _moveTo(point) {
            this.destination = point
            this.adjacentTiles = {}
            if (this.isMoving()) {
                this._continueTo(point)
            } else {
                var path = this.requestPathfindingTo(point)
                this.followPath(path)
            }
        },
        nextStep() {
            var stop = false
            var x, y, Path
            if (this.isMoving()) {
                if (this.this._onBeforeStep) {
                    this._onBeforeStep()
                }
                this.updatePositionOnGrid()
                if (this.interrupted) {
                    stop = true;
                    this.interrupted = false
                } else {
                    if (this.hasNextStep()) {//Following Path Finding
                        this.nextGridCol = this.path[this.step + 1].col
                        this.nextGridRow = this.path[this.step + 1].row

                        if (this._onStep)
                            this._onStep()

                        if (this.hasChangedItsPath()) {
                            this.view.setPosition(this.newDestination)
                            path = this.requestPathfindingTo(this.newDestination)
                            this.newDestination = null
                            if(path.length < 2){
                                stop = true
                            }else{
                                this.followPath(path)
                            }
                        } else if(this.hasNextStep()){
                            this.step += 1;
                            this.updateMovement()
                        } else{
                            stop = true
                        }
                    }
                }
                if(stop){
                    this.path = null;
                    this.idle();
                    if(this._onStopPath){
                        this._onStopPath(this.point)
                    }
                }
            }
        },
        isNear(piece,distance){
            var dx, dy, near = false;
        
            dx = Math.abs(this.point.col - character.point.col);
            dy = Math.abs(this.point.row - character.point.row);
        
            if(dx <= distance && dy <= distance) {
                near = true;
            }
            return near;

        },
        //Attacking Handle
        isAttacking(){
            return this.attackmode
        },
        isAttackedBy(piece) {
            return (piece.id in this.attackers)
        },
        addAttacker(piece) {
            if(!this.isAttackedBy(piece)){
                this.attackers[piece.id] = piece
            }else{
                log.error(this.id + " is already attacked by " + piece.id);
            }
        },
        removeAttacker(piece) {
            if(this.isAttackedBy(piece)) {
                delete this.attackers[piece.id];
            } else {
                log.error(this.id + " is not attacked by " + piece.id);
            }
        },
        forEachAttacker(callback) {
            let keys = Object.keys(this.attackers)
            for(var i in keys){
                callback(this.attackers[i])
            }
        },
        setTarget: function (monster) {
            if(this.target !== monster){
                if(this.hasTarget()){
                    this.removeTarget()
                }
                this.unconfirmedTarget = null;
                this.target = monster;
            }
            else{
                console.log("Already targetting "+monster.id)
            }
        },
        removeTarget: function () {
            if(this.target){
                this.target.removeAttacker(this)
                this.target = null
            }
        },
        hasTarget: function () {
            return !(this.target === null)
        },
        waitToAttack(monster) {
            this.unconfirmedTarget = monster
        },
        isWaitingToAttack(monster) {
            return (this.unconfirmedTarget === monster)
        },
        canAttack(time) {
            if(this.canReachTarget()){
                return true;
            }
            return false;
        },
        canReachTarget() {
            if(this.hasTarget() && this.isAdjacentNonDiagonal(this.target)){
                return true;
            }
            return false;
        },

        //Signal Slot
        onAttack(callback) {
            this._onAttack = callback
        },
        onAttacked(callback) {
            this._onAttacked = callback
        },
        onCheckAttack(callback){
            this._onCheckAttack = callback
        },
        onDeath(callback) {
            this._onDeath = callback
        },
        onHasMoved(callback) {
            this._onHasMoved = callback
        },
        onStartPath(callback) {
            this._onStartPath = callback
        },
        onStopPath(callback) {
            this._onStopPath = callback
        },
        onBeforeStep(callback) {
            this._onBeforeStep = callback
        },
        onStep(callback) {
            this._onStep = callback
        },
        onRequestPath(callback) {
            this._onRequestPath = callback
        },
    })
    return Monster;
})