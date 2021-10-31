
var View;
require(["view/view"],function(view){
  View = view
})
function isFunction(f) {
    return typeof f === 'function'
  }
  function isString(s) {
    return typeof s === 'string'
  }
  function isInteger(n) {
    return typeof n === 'number' && Math.floor(n) === n && isFinite(n)
  }
  function isNumber(n){
    return typeof n === 'number'
  }
  function isPoint(n){
    return n.col != undefined && n.row != undefined
  }
  function isCoord(n){
    return n.x != undefined && n.y != undefined
  }
  function isSize(n){
    return n.w != undefined && n.h != undefined
  }
  function isViewKind(n){
    return isNumber(n)
  }
  function isViewPrototype(n){
    return isFunction(n) 
  }
  var Types = {
      Views : {
          VIEW            : 0,
          LANDVIEW        : 1,
          MONSTERVIEW     : 3,
          MONSTERLORDVIEW : 4,
      } 
  }