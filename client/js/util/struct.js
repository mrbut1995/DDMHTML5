class Coord {
    constructor(){
        var self = this
        var vardiac
        if(Array.isArray(arguments[0])){
            vardiac = [...arguments[0]]
         }else{
            vardiac = [...arguments]
         } 
        self[0] = vardiac[0]
        self[1] = vardiac[1]  
    }
    set x(value) {this[0] = value}
    set y(value) {this[1] = value}

    get x() {return this[0]}
    get y() {return this[1]}

    add(point){
        return new Point(point.x + this.x,point.y + this.y)
    }
    toString(){
        return "("+this.x+","+this.y+")"
    }

    static zero(){
        return new Coord(0,0)
    }
    static fromString(str){
        var x = parseFloat(str.match(/[+-]?\d+(\.\d+)?/g)[0]);
        var y = parseFloat(str.match(/[+-]?\d+(\.\d+)?/g)[1]);
        return new Coord(x,y)
    }
}
class Size{
    constructor(w,h){
        this[0] = w
        this[1] = h
    }
    set w(value) {this[0] = value}
    set h(value) {this[1] = value}
    
    get w()     {return this[0]}
    get h()     {return this[1]}

}
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



class Region{
    constructor(array){
        var self = this
        var lst = _.uniq(_.filter(array, p => isPoint(p)), p => p.col +","+ p.row)
        _.each(lst,function(item,i){
            if(isPoint(item)){
                self[i] = item
            }
        })
    }
    nearby(distance){
        var self = this
        var list = []
        _.each(this,function(p){
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
            return _.find(self,function(item2){
                return (item1.col == item2.col && item1.row == item2.row)
            }) == undefined
        },)
        return list
    }
    forEachNearby(distance,callback){
        var lst = this.nearby(distance)
        _.each(lst,callback)        
    }
    forEachPoint(callback){
        _.each(this,callback)
    }
}

function phase(p){
    return {
        startphase: p,
        phase : p,
        onTransitioning: function(callback){
            this._onTransitioning = callback;
            return this
        },
        onCompleted: function(callback){
            this._onCompleted = callback;
            return this
        },
        to: async function(_to){
            if(this._onTransitioning){
                await this._onTransitioning(this.phase,to)
            }
            if(this._onCompleted){
                this._onCompleted(_to)
            }
            return this
        }
    }
}
