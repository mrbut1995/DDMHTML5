requirejs.config({
  paths: {
    'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min',
    'ddm': "./tsh.ddm",
    'ddm-view': "./tsh.ddm.view.h5",
    'ddm-logic': "./tsh.ddm.logic",
    'ddm-loader':"./tsh.ddm.loader",
    'ddm-debug' :"./tsh.ddm.debug",
    'view': './view'
  }
});

//Define Struct
var Coord = function (x, y) {
  this.x = x;
  this.y = y;
};
var Rect = function (coord, width, height) {
  this.w = width
  this.h = height
  this.x = coord.x
  this.y = coord.y

  this.contain = function (coord) {
    return this.x <= coord.x && coord.x <= this.x + this.w
      && this.y <= coord.y && coord.y <= this.y + this.h
  }
}
function Point(col, row) {
  this.col = col
  this.row = row

  this.equals = function (other) {
    return other.col === this.col
      && other.row === this.row
  }

  this.fromString = function (str) {

  }
  this.toString = function () {
    return "(" + this.col + "," + this.row + ")";
  }

  this.isInArray = function (array) {
    for (var i = 0; i < array.length; i++) {
      if (this.equals(array[i])) {
        return true;
      }
    }
    return false;
  }
  this.add = function (point) {
    return new Point(point.col + this.col, this.row + point.row)
  }
}

//Game Constant
var Constants = new function () {
  this.GameStatus = {
    ACTIVE: "active",
    IDLE: "idle",
    WAITING: "waiting",
    ENDED: "ended"
  }
  this.GameState = {
    INITIALIZED: "initialized"
  }
  this.direction = {
    NORTH: "north",
    EAST: "east",
    SOUTH: "south",
    WEST: "west",
    ALL: ["north", "east", "south", "west"]
  }

  this.action = {
    MOVE: "move",
    ATTACK: "attack",
    SUMMON: "summon",
    SKILL: "skill",
  }

  this.SkillType = {
    UNKNOWN: "unknown",
    CONTINUOUS: "continuous",
    TRIGGER: "trigger",
    IGNITION: "ignition",
  }

  this.MoveType = {
    UNKNOWN: "unknown",
    NORMAL: "normal",
    FLYING: "flying",
    TELEPORT: "teleport"
  }

  this.PHASE = {
    UNKNWON: "unknown",
    STANDBY_PHASE: "standby_phase",
    MAIN_PHASE: "main_phase",
    SUMMON_PHASE: "summon_phase",
    ACTION_PHASE: "action_phase",
    END_PHASE: "end_phase"
  }

  this.RELATIVE_PATTERN = {
    TYPE_1: [p(0, -1), p(-1, -1), p(-2, -1), p(0, 1), p(0, 2)],
    TYPE_2: [p(0, 1), p(-1, 1), p(-2, 1), p(0, 1), p(0, 2)],
    TYPE_3: [p(1, 0), p(1, -1), p(-1, 0), p(-2, 0), p(-2, 1)],
    TYPE_4: [p(-1, 0), p(-1, -1), p(1, 0), p(2, 0), p(2, 1)],
    TYPE_5: [p(-1, 0), p(0, 1), p(0, -1), p(1, -1), p(1, -2)],
    TYPE_6: [p(-1, 0), p(0, 1), p(0, -1), p(1, 1), p(1, 2)],
    TYPE_7: [p(0, 1), p(-1, 1), p(1, 0), p(1, -1), p(2, -1)],
    TYPE_8: [p(0, -1), p(-1, -1), p(1, 0), p(1, 1), p(2, 1)],
    TYPE_9: [p(-1, 0), p(0, 1), p(1, 0), p(1, -1), p(2, -1)],
    TYPE_10: [p(-1, 0), p(0, -1), p(1, 0), p(1, 1), p(2, 1)],
    ALL_TYPE: ["TYPE_1", "TYPE_2", "TYPE_3", "TYPE_4", "TYPE_5",
      "TYPE_6", "TYPE_7", "TYPE_8", "TYPE_9", "TYPE_10"]
  }
}

//Util
function extend(a, b) {
  for (var key in b) {
    if (b.hasOwnProperty(key))
      a[key] = b[key]
  }
  return a
}
function isFunction(f) {
  return typeof f === 'function'
}
function isString(s) {
  return typeof s === 'string'
}
function isInteger(n) {
  return typeof n === 'number' && Math.floor(n) === n && isFinite(n)
}
function deepCopy(thing) {
  return JSON.parse(JSON.stringify(thing))
}
function throttle(f, interval, scope) {
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
function interpolateTemplate(str, obj) {
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

function uuid() {
  return 'xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx'.replace(/x/g, function (c) {
    var r = (Math.random() * 16) | 0
    return r.toString(16)
  })
}

function p(col, row) { return new Point(col, row) }

//Global DOM
//DOM Object
var DOMBoard = document.getElementById("board")
var DOMDiceOne
var DOMDiceTwo
var DOMDiceThree

function rotating(list, clockwise) {
  var val = []
  if (clockwise) {
    for (var i = 0; i < list.length; i++) {
      val[i] = new Point(0, 0)
      val[i].col = -list[i].row
      val[i].row = list[i].col
    }
  }
  else {
    for (var i = 0; i < list.length; i++) {
      val[i] = new Point(0, 0)
      val[i].col = list[i].row
      val[i].row = -list[i].col
    }
  }
  return val
}

function pointsFromPattern(point, pattern, rot) {
  var lst = [point]
  rot = rot || 0
  if (!Constants.RELATIVE_PATTERN.hasOwnProperty(pattern)) {
    console.log("DOES NOT CONTAIN PATTERN ", pattern)
    return lst
  }
  var pRelativePattern = Constants.RELATIVE_PATTERN[pattern]
  for (var i = 0; i < Math.abs(rot); i++) {
    pRelativePattern = rotating(pRelativePattern, Math.sign(rot) == -1);
  }
  for (var i in pRelativePattern) {
    var pRelative = pRelativePattern[i]
    var p = point.add(pRelative)
    lst.push(p)
  }
  return lst
}
define(["jquery"], function () {
  console.log("LOAD MAIN")
  require(["ddm-view"])
  require(["ddm-logic"])
  require(["ddm-loader"])
  require(["ddm"])
})

