//Game Constant
function p(col, row) { return {col:col,row:row} }

var viewconfig = {
    board:{
        col : 13,
        row : 19,
        margin:{
            horizontal:8,
            vertical  :8
        },
        size: {
          width:633,
          height:923,
        },
        cell:{
            margin:{
              horizontal:0,
              vertical  :0
            },
            size:{
              width :42,
              height:42 
            },
            padding:{
              horizontal:6,
              vertical  : 6
            }
        },
    }
}

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