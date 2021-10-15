
//DOM Object
var DOMBoard = document.getElementById("board")
var DOMDiceOne
var DOMDiceTwo
var DOMDiceThree

//
var imageLoader = {
    loaded:         true,
    loadedImages:   0,
    totalImages:    0,
    load: function(url){
        this.totalImages++;
        this.load = false;
        var image = new Image();
        image.src = url;
        image.onload = function(){
            imageLoader.loadedImages ++;
            if(imageLoader.loadedImages === imageLoader.totalImages){
                imageLoader.loaded = true
            }
            image.onload = undefined
        }
        return image;
    }
}


let start, previousTimeStamp;


let Config = {
    boardCol : 13,
    boardRow : 19
}

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


function p(col,row){return new Point(col,row)}

//Game Constant
var Constants = new function(){
    this.GameStatus = {
        ACTIVE: "active",
        IDLE : "idle",
        WAITING: "waiting",
        ENDED : "ended"
    }
    this.GameState = {
        INITIALIZED : "initialized"
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

    this.RELATIVE_PATTERN = {
        TYPE_1: [p(0,-1),p(-1,-1),p(-2,-1),p(0,1),p(0,2)],
        TYPE_2: [p(0,1),p(-1,1),p(-2,1),p(0,1),p(0,2)   ],
        TYPE_3: [p(1,0),p(1,-1),p(-1,0),p(-2,0),p(-2,1) ],
        TYPE_4: [p(-1,0),p(-1,-1),p(1,0),p(2,0),p(2,1)  ],
        TYPE_5: [p(-1,0),p(0,1),p(0,-1),p(1,-1),p(1,-2) ],
        TYPE_6: [p(-1,0),p(0,1),p(0,-1),p(1,1),p(1,2)   ],
        TYPE_7: [p(0,1),p(-1,1),p(1,0),p(1,-1),p(2,-1)  ],
        TYPE_8: [p(0,-1),p(-1,-1),p(1,0),p(1,1),p(2,1)  ],
        TYPE_9: [p(-1,0),p(0,1),p(1,0),p(1,-1),p(2,-1)  ],
        TYPE_10:[p(-1,0),p(0,-1),p(1,0),p(1,1),p(2,1)   ],
        ALL_TYPE : ["TYPE_1","TYPE_2","TYPE_3","TYPE_4","TYPE_5",
                    "TYPE_6","TYPE_7","TYPE_8","TYPE_9","TYPE_10"]
    }
}

function rotating(list,clockwise){
    var val = []
    if(clockwise){
        for(var i = 0 ; i < list.length;i++){
            val[i] = new Point(0,0)
            val[i].col = -list[i].row
            val[i].row = list[i].col
        }
    }
    else{
        for(var i = 0 ; i < list.length;i++){
            val[i] = new Point(0,0)
            val[i].col = list[i].row
            val[i].row = -list[i].col
        }
    }
    return val
}

function pointsFromPattern(point,pattern,rot){
    var lst = [point]
    rot = rot || 0
    if(!Constants.RELATIVE_PATTERN.hasOwnProperty(pattern)){
        console.log("DOES NOT CONTAIN PATTERN ",pattern)
        return lst
    }
    var pRelativePattern = Constants.RELATIVE_PATTERN[pattern]
    for(var i = 0 ; i <Math.abs(rot);i++){
        pRelativePattern = rotating(pRelativePattern,Math.sign(rot) == -1);
    }
    for(var i in pRelativePattern){
        var pRelative = pRelativePattern[i]
        var p = point.add(pRelative)
        lst.push(p)
    }
    return lst
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

    this.fromString = function(str){

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
    this.add = function(point){
        return new Point(point.col + this.col,this.row + point.row)
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

    this.isAt = function(point){
        return this.point.equals(point)
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

    this.isAt = function(point){
        return this.point.equals(point)
    }

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

    var dices = document.getElementById("dicesId");
    dices.classList.toggle("show")
    rollTo(DOMDiceOne,Math.floor(Math.random() * 6))
    rollTo(DOMDiceTwo,Math.floor(Math.random() * 6))
    rollTo(DOMDiceThree,Math.floor(Math.random() * 6))

    //Hiding Dice When Done
    setTimeout(()=>{dices.classList.toggle("show")},1300)
}

function prototypeName(obj){
    return obj.constructor.name
}

