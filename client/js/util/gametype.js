
function isFunction(f) {
  return typeof f === 'function'
}
function isString(s) {
  return typeof s === 'string'
}
function isInteger(n) {
  return typeof n === 'number' && Math.floor(n) === n && isFinite(n)
}
function isNumber(n) {
  return typeof n === 'number'
}
function isPoint(n) {
  return n.col != undefined && n.row != undefined
}
function isCoord(n) {
  return n.x != undefined && n.y != undefined
}
function isSize(n) {
  return n.w != undefined && n.h != undefined
}
function isViewKind(n) {
  return isNumber(n)
}
function isViewPrototype(n) {
  return isFunction(n)
}
function isAnimationPrototype(n) {
  return isFunction(n)
}
function isMonsterView(n) {
  return n.type == "monster"
}
function isLandView(n) {
  return n.type == "land"
}
function isMonsterLordView(n) {
  return n.type == "monsterlord"
}
function isItemView(n) {
  return n.type == "item"
}


var Types = {
  Views: {
    VIEW: 0,
    LANDVIEW: 1,
    MONSTERVIEW: 3,
    MONSTERLORDVIEW: 4,
  }
}

function isMonsterKind(kind){
  return ["DummyMonster1","DummyMonster2"].includes(kind)
} 
function isMonsterLordKind(kind){
  return ["MonsterLord"].includes(kind)
}
function isLandKind(kind){
  return ["NormalLand","PoisonLand","DestroyedLand","GrassLand","PortalLand"].includes(kind)
}
function isItemKind(kind){
  return [].includes(kind)
}