let start, previousTimeStamp;

function Land(id, point, owner) {
    this.id = id || -1
    this.point = point || new Point(0, 0)
    this.owner = owner || -1

    this.getInArray = function (array) {
        for (var i = 0; i < array.length; i++) {
            if (this.id === array[i])
                return i
        }
        return -1
    }

    this.isInArray = function (array) {
        return this.getInArray(array) != -1
    }

    this.isAt = function (point) {
        return this.point.equals(point)
    }
}

function Piece(id, point, owner) {
    this.point = point || new Point(0, 0)
    this.owner = owner || -1

    this.getInArray = function (array) {
        for (var i = 0; i < array.length; i++) {
            if (this.id === array[i])
                return i
        }
        return -1
    }

    this.isInArray = function (array) {
        return this.getInArray(array) != -1
    }

    this.isAt = function (point) {
        return this.point.equals(point)
    }

}



//Define Modul
define(function () {

    var Tsh = Tsh || {}
    Tsh.Ddm = Tsh.Ddm || {}



    window.onload = function () {
        console.log("window.onload")
        Tsh.Ddm.Game.init()
        Tsh.Ddm.Game.run()
    }

    //Loader

    Tsh.Ddm.Match = {
        data: {
            pieces: [],
            lands: [],
            dices:[],
            player:[],
            phase:"standby-phase",
            turn: 0,
            playerindex:0
        },
        init: function () {
        },
        load: function () {
        },        
    }

    Tsh.Ddm.Game = {
        init: function () {

            Tsh.Ddm.Match.init()
            Tsh.Ddm.View.init()
            Tsh.Ddm.Debug.init()
            Tsh.Ddm.Loader.init()
            Tsh.Ddm.Animator.init()
            Tsh.Ddm.Input.init()

            Tsh.Ddm.Match.load()
        },
        run: function () {
            var cb = this.step.bind(this)
            window.requestAnimationFrame(cb);
        },
        step: function (timestamp) {
            if (start === undefined)
                start = timestamp;
            const elapsed = timestamp - start;

            var delta = timestamp - previousTimeStamp;

            if (previousTimeStamp !== timestamp) {
                Tsh.Ddm.View.update({ delta: delta })
            }

            previousTimeStamp = timestamp
            var cb = this.step.bind(this)
            window.requestAnimationFrame(cb);
        },
        hideScreen: function (id) {
        },
        showScreen: function () {
        },
        hideScreens: function () {
        },
        roll: function () {
            console.log("roll")
            Tsh.Ddm.View.DisplayDice(1300)
            Tsh.Ddm.View.Roll(0, Math.floor(Math.random() * 6))
            Tsh.Ddm.View.Roll(1, Math.floor(Math.random() * 6))
            Tsh.Ddm.View.Roll(2, Math.floor(Math.random() * 6))
        },
    }

    return Tsh
})