//Game Constant
function p(col, row) { return {col:col,row:row} }

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
    TYPE_1: ["(0, -1)", "(-1, -1)","(-2, -1)","(0, 1)",  "(0, 2)"],
    TYPE_2: ["(0, 1)",  "(-1, 1)", "(-2, 1)", "(0, 1)",  "(0, 2)"],
    TYPE_3: ["(1, 0)",  "(1, -1)", "(-1, 0)", "(-2, 0)", "(-2, 1)"],
    TYPE_4: ["(-1, 0)", "(-1, -1)","(1, 0)",  "(2, 0)",  "(2, 1)"],
    TYPE_5: ["(-1, 0)", "(0, 1)",  "(0, -1)", "(1, -1)", "(1, -2)"],
    TYPE_6: ["(-1, 0)", "(0, 1)",  "(0, -1)", "(1, 1)",  "(1, 2)"],
    TYPE_7: ["(0, 1)",  "(-1, 1)", "(1, 0)",  "(1, -1)", "(2, -1)"],
    TYPE_8: ["(0, -1)", "(-1, -1)","(1, 0)",  "(1, 1)",  "(2, 1)"],
    TYPE_9: ["(-1, 0)", "(0, 1)",  "(1, 0)",  "(1, -1)", "(2, -1)"],
    TYPE_10:["(-1, 0)", "(0, -1)", "(1, 0)",  "(1, 1)",  "(2, 1)"],
    ALL_TYPE: ["TYPE_1", "TYPE_2", "TYPE_3", "TYPE_4", "TYPE_5",
      "TYPE_6", "TYPE_7", "TYPE_8", "TYPE_9", "TYPE_10"]
  }
}

function pointsFromPattern(point, pattern, rot) {
  var lst = [point]
  rot = rot || 0
  if (!Constants.RELATIVE_PATTERN.hasOwnProperty(pattern)) {
    console.log("DOES NOT CONTAIN PATTERN ", pattern)
    return lst
  }
  var pRelativePattern = Point.fromString(Constants.RELATIVE_PATTERN[pattern])
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