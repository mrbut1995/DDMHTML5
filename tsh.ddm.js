
//DOM Object
var DOMBoard = document.getElementById("board")
var DOMDiceOne
var DOMDiceTwo
var DOMDiceThree

let start, previousTimeStamp;

window.onload = function(){
    getDOMObject()

    Tsh.Ddm.View.init()
    Tsh.Ddm.Debug.init()

    
    // gameLoop()
    window.requestAnimationFrame(step);
}

function run(){

}
function step(timestamp) {
    if (start === undefined)
      start = timestamp;
    const elapsed = timestamp - start;
  
    var delta =  timestamp - previousTimeStamp;

    if (previousTimeStamp !== timestamp) {
      Tsh.Ddm.View.update({delta:delta})
    }
  
    previousTimeStamp = timestamp
    window.requestAnimationFrame(step);
}


function getDOMObject(){
    DOMBoard        =  document.getElementById("board")
    DOMDiceOne      = document.getElementById("dice1")
    DOMDiceTwo      = document.getElementById("dice2")
    DOMDiceThree    = document.getElementById("dice3")
}
var gGameState;


//Game Constant
var Constants = new function(){
    this.GameStatus = {
        ACTIVE: "active",
        IDLE : "idle",
        ENDED : "ended"
    }

    this.direction = {
        NORTH :"north",
        EAST:"east",
        SOUTH:"south",
        WEST:"west",
        ALL:["north","east","south","west"]
    }

    this.action = {
        MOVE:"move",
        ATTACK:"attack",
        SUMMON:"summon",
        SKILL:"skill",
    }

    this.SkillType = {
        UNKNOWN : "unknown",
        CONTINUOUS:"continuous",
        TRIGGER:"trigger",
        IGNITION:"ignition",
    }

    this.MoveType = {
        UNKNOWN : "unknown",
        NORMAL:"normal",
        FLYING:"flying",
        TELEPORT: "teleport"
    }

    this.PHASE = {
        UNKNWON : "unknown",
        STANDBY_PHASE : "standby_phase",
        MAIN_PHASE:"main_phase",
        SUMMON_PHASE:"summon_phase",
        ACTION_PHASE:"action_phase",
        END_PHASE:"end_phase"
    }
}


function MoveResult(player,newPoint){
    
}

function PlayerAction(source,action,evt){

}

function Point(col,row){
    this.col = col
    this.row = row

    this.equals = function(other){
        return other.col === this.col 
            && other.row === this.row
    }

    this.toString = function(){ 
        return "(" + this.col + "," + this.row + ")";
    }

    this.isInArray = function (array) {
		for (var i=0; i<array.length; i++) {
			if (this.equals(array[i])) {
				return true;
			}
		}
		return false;
    }
}

function Land(id,point,owner){
    this.id    = id    || -1
    this.point = point || new Point(0,0)
    this.owner = owner || -1

    this.getInArray = function (array){
        for(var i = 0 ; i < array.length;i++){
            if(this.id === array[i])
                return i
        }
        return -1
    }
    
    this.isInArray = function(array){
        return this.getInArray(array) != -1
    }
}

function Piece(id,point,owner){
    this.point = point || new Point(0,0)
    this.owner = owner || -1

    this.getInArray = function (array){
        for(var i = 0 ; i < array.length;i++){
            if(this.id === array[i])
                return i
        }
        return -1
    }
    
    this.isInArray = function(array){
        return this.getInArray(array) != -1
    }

}
function Player(){
    
}


// Define Common attributes for Game of DDM
function GameState(){

}

//Util
function extend(a,b){
    for(var key in b){
        if(b.hasOwnProperty(key))
            a[key] = b[key]
    }
    return a
}
function isFunction(f){
    return typeof f === 'function'
}
function isString(s){
    return typeof s === 'string'
}
function isInteger(n){
    return typeof n === 'number' && Math.floor(n) === n && isFinite(n)
}
function deepCopy(thing){
    return JSON.parse(JSON.stringify(thing))
}
function throttle (f, interval, scope) {
    var timeout = 0
    var shouldFire = false
    var args = []

    var handleTimeout = function () {
      timeout = 0
      if (shouldFire) {
        shouldFire = false
        fire()
      }
    }

    var fire = function () {
      timeout = window.setTimeout(handleTimeout, interval)
      f.apply(scope, args)
    }

    return function (_args) {
      args = arguments
      if (!timeout) {
        fire()
      } else {
        shouldFire = true
      }
    }
  }
  function interpolateTemplate (str, obj) {
    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) continue
      var keyTemplateStr = '{' + key + '}'
      var value = obj[key]
      while (str.indexOf(keyTemplateStr) !== -1) {
        str = str.replace(keyTemplateStr, value)
      }
    }
    return str
  }
  
  function uuid () {
    return 'xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/x/g, function (c) {
      var r = (Math.random() * 16) | 0
      return r.toString(16)
    })
  }

//Dice Rolling
function rollTo(DOMObject,result){
    console.log("result = ",result)
    for (var i = 1; i <= 6; i++) {
        DOMObject.classList.remove('show-' + i);
        if (result === i) {
            console.log("roll to ",'show-' + i)
            DOMObject.classList.add('show-' + i);
        }
      }    
}

function roll(){
    console.log("roll ")
    rollTo(DOMDiceOne,Math.floor(Math.random() * 6))
    rollTo(DOMDiceTwo,Math.floor(Math.random() * 6))
    rollTo(DOMDiceThree,Math.floor(Math.random() * 6))
}