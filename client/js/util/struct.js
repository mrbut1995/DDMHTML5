
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
Coord.zero = function(){
    return new Coord(0,0)
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

    this.point = function(){
        return {
            left: this.x,
            top : this.y,
            right: this.x + this.width,
            bottom: this.y + this.height
        }
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

function Region(list){
    this.array =  _.uniq(_.filter(list, p => isPoint(p)))
  
    this.toArray = function(){
        return this.array
    }
    this.nearby = function(distance){
        var self = this
        var list = []
        _.each(this.array,function(p){
            if(isPoint(p)){
                var startRow = p.row - distance
                var endRow = p.row + distance
                for(var i = startRow ; i <= endRow;i++){
                    var startCol = p.col - distance
                    var endCol = p.col + distance
                    for(var j = startCol ; j <= endCol; j++){
                        list.push(new Point(j,i))
                    }
                }
            }
        })
        list = _.uniq(list, p => p.col +","+ p.row)
        list = _.filter(list,function(item1){
            return _.find(self.array,function(item2){
                return (item1.col == item2.col && item1.row == item2.row)
            }) == undefined
        },)
        return list
    }
    this.forEachNearby = function(distance,callback){
        var lst = this.nearby(distance)
        _.each(lst,callback)        
    }
    this.forEachPoint  = function(callback){
        _.each(this.array,callback)
    }
    this.toString         = function(){
    }
}
Region.fromStringArray = function(array){

}
Region.fromString = function(array){
    
}