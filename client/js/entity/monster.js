define(["entity/piece", "view/views", "animation/animations"], function (Piece, Views, Animations) {
    var Monster = Piece.extend({
        init(id, kind) {

            var self = this

            this.stat = {
                attack: 0,
                defend: 0,
                move: 3
            }
            this.movetype = "walk"

            //View
            this.view = Views.MonsterView

            //Action
            this.canAction = true

            //Status
            this.status = "alive"
            this.attackmode = false
            this.movemode = false
            this.effectmode = false

            //Pathing
            this.path = null
            this.newDestination = null; //Coord
            this.destination = null;    //Point
            this.adjacentTiles = {}
            this.step = 0
            this.nextGridCol = -1
            this.nextGridRow = -1
            this.nextX = 0
            this.nextY = 0

            //Attack
            this.target = null
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

            //Animation
            this.animations = {
                move: Animations.PointMoveAnimation.extend({
                    init() {
                        this._super(self.getView())
                        this.interval = 5000
                        this.onAnimationStart(function () {
                            console.log("Animation is Start")
                            self.hasMoved()
                        }.bind(this))
                        this.onAnimationCompleted(function () {
                            console.log("Animation is completed")
                            self.hasMoved()
                            self.nextStep()
                        }.bind(this))
                        this.onRunningAnimation(function () {

                        }.bind(this))
                    }
                }),
                attack: Animations.SpriteAnimation,
                idle: Animations.SpriteAnimation,
                walk: Animations.SpriteAnimation,
            }

            this._super(id, kind)

        },
        select() {

        },
        setMoveNext(coord) {

        },
        engage(monster) {
            this.attackmode = true;
            this.setTarget(monster);
        },
        disengage(monster) {
            this.attackmode = false;
            this.removeTarget()
        },
        attack(target) {
            this.animate("attack", {
                speed: this.atkSpeed,
                count: 1
            })
            if (this._onAttack)
                this._onAttack()
        },
        idle() {
            this.animate("idle", {
                speed: this.atkSpeed,
            })
        },
        hurted(source) {
            this.animate("hurted", {
                speed: this.atkSpeed,
            })
            if (this._onAttacked)
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
        hasMoved() {

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
                this.nextStep()
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
            console.log("this.path.length = ",this.path.length," this.step = ",this.step)
            return (this.path.length - 1 > this.step)
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
            console.log("nextStep")
            var stop = false
            var x, y, path
            if (this.isMoving()) {
                if (this._onBeforeStep) {
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
                        console.log("prepareMoveTo ",this.nextGridCol," ",this.nextGridRow)
                    }
                    if (this._onStep)
                        this._onStep()

                    if (this.hasChangedItsPath()) {
                        console.log("change it path")
                        this.getView().setPosition(this.newDestination)
                        path = this.requestPathfindingTo(this.newDestination)
                        this.newDestination = null
                        if (path.length < 2) {
                            stop = true
                        } else {
                            this.followPath(path)
                        }
                    } else if (this.hasNextStep()) {
                        console.log("prepareToMoveToOtherStep")
                        this.step += 1;
                    } else {
                        stop = true
                    }

                }
                if (stop) {
                    this.path = null;
                    this.idle();
                    if (this._onStopPath) {
                        this._onStopPath(this.point)
                    }
                }
            }
        },
        nextPoint() {
            return new Point(this.nextGridCol, this.nextGridRow)
        },
        isNear(piece, distance) {
            var dx, dy, near = false;

            dx = Math.abs(this.point.col - character.point.col);
            dy = Math.abs(this.point.row - character.point.row);

            if (dx <= distance && dy <= distance) {
                near = true;
            }
            return near;

        },
        //Attacking Handle
        isAttacking() {
            return this.attackmode
        },
        isAttackedBy(piece) {
            return (piece.id in this.attackers)
        },
        addAttacker(piece) {
            if (!this.isAttackedBy(piece)) {
                this.attackers[piece.id] = piece
            } else {
                log.error(this.id + " is already attacked by " + piece.id);
            }
        },
        removeAttacker(piece) {
            if (this.isAttackedBy(piece)) {
                delete this.attackers[piece.id];
            } else {
                log.error(this.id + " is not attacked by " + piece.id);
            }
        },
        forEachAttacker(callback) {
            let keys = Object.keys(this.attackers)
            for (var i in keys) {
                callback(this.attackers[i])
            }
        },
        setTarget: function (monster) {
            if (this.target !== monster) {
                if (this.hasTarget()) {
                    this.removeTarget()
                }
                this.unconfirmedTarget = null;
                this.target = monster;
            }
            else {
                console.log("Already targetting " + monster.id)
            }
        },
        removeTarget: function () {
            if (this.target) {
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
            if (this.canReachTarget()) {
                return true;
            }
            return false;
        },
        canReachTarget() {
            if (this.hasTarget() && this.isAdjacentNonDiagonal(this.target)) {
                return true;
            }
            return false;
        },
        //Update
        update(delta) {
            this._super(delta)
            //Update Monster
            this.updateMovingPath();
        },
        updateMovingPath() {
            if (this.isMoving() && !this.getAnimations().move.running()) {
                this.getAnimations().move.target = this.getView()
                this.getAnimations().move.start(this.point, this.nextPoint())
            }
        },
        //Signal Slot
        onAttack(callback) {
            this._onAttack = callback
        },
        onAttacked(callback) {
            this._onAttacked = callback
        },
        onCheckAttack(callback) {
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
        onDamageTarget(callback) {
            this._onDamageTarget = callback
        },
        onDamageMultiTarget(callback) {
            this._onDamageMultiTarget = callback
        },
        onKillTarget(callback) {
            this._onKillTarget = callback
        },
        onChangeStat(callback) {
            this._onChangeStat = callback
        },
        onChangeHealth(callback) {
            this._onChangeHealth = callback
        },
        onKilled(callback) {
            this._onKilled = callback
        },

    })
    return Monster;
})