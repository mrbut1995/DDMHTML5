
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
