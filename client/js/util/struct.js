
//Define Struct
var Coord = function (x, y) {
    this.x = x;
    this.y = y;

    this.add = function (point) {
        return new Point(point.x + this.x, this.y + point.y)
    }
    this.toString = function(){
        return "("+this.x+","+this.y+")"
    }
};
Coord.fromString = function(str){
    var x = parseFloat(str.match(/[+-]?\d+(\.\d+)?/g)[0]);
    var y = parseFloat(str.match(/[+-]?\d+(\.\d+)?/g)[1]);
    return new Coord(x,y)
}

var Size = function(w,h){
    this.w      = w
    this.h      = h
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
Point.fromString = function(str){
    var col = parseFloat(str.match(/[+-]?\d+(\.\d+)?/g)[0]);
    var row = parseFloat(str.match(/[+-]?\d+(\.\d+)?/g)[1]);
    return new Point(col,row)
}
