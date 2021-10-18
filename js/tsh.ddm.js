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

function getDOMObject() {
    DOMBoard = document.getElementById("board")
    DOMDiceOne = document.getElementById("dice1")
    DOMDiceTwo = document.getElementById("dice2")
    DOMDiceThree = document.getElementById("dice3")
}


//Define Modul
define(function () {

    var Tsh = Tsh || {}
    Tsh.Ddm = Tsh.Ddm || {}



    window.onload = function () {
        console.log("TSH.Ddm.Game",Tsh.Ddm.Game)
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
        step:function(){
        },
        
    }

    Tsh.Ddm.Game = {
        init: function () {
            getDOMObject()

            Tsh.Ddm.Match.init()
            Tsh.Ddm.View.init()
            // Tsh.Ddm.Debug.init()
            Tsh.Ddm.Loader.init()

            Tsh.Ddm.Match.load()
        },
        run: function () {
            var cb = Tsh.Ddm.Game.step.bind(this)
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
            var cb = Tsh.Ddm.Game.step.bind(this)
            window.requestAnimationFrame(cb);
        },
        hideScreen: function (id) {
        },
        showScreen: function () {
        },
        hideScreens: function () {
        },
        roll: function () {
            console.log("roll ")

            var dices = document.getElementById("dicesId");
            dices.classList.toggle("show")
            rollTo(DOMDiceOne, Math.floor(Math.random() * 6))
            rollTo(DOMDiceTwo, Math.floor(Math.random() * 6))
            rollTo(DOMDiceThree, Math.floor(Math.random() * 6))

            //Hiding Dice When Done
            setTimeout(() => { dices.classList.toggle("show") }, 1300)
        },
        //Dice Rolling
        rollTo: function (DOMObject, result) {
            console.log("result = ", result)
            for (var i = 1; i <= 6; i++) {
                DOMObject.classList.remove('show-' + i);
                if (result === i) {
                    console.log("roll to ", 'show-' + i)
                    DOMObject.classList.add('show-' + i);
                }
            }
        }
    }

    return Tsh
})