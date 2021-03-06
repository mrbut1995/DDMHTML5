
//Util
function extend(a, b) {
    for (var key in b) {
      if (b.hasOwnProperty(key))
        a[key] = b[key]
    }
    return a
  }
  function deepCopy(thing) {
    if(typeof thing === 'object' ){
      return  Object.assign(Object.create(Object.getPrototypeOf(thing)), thing)
    }else{
      return thing
    }
  }

  function deepCopyTo(to,from){
    if(typeof from === 'object' ){
      Object.assign(to,Object.assign(Object.create(Object.getPrototypeOf(from)), from))
      console.log("after copy ",to)
    }else{
      Object.assign(to,from)
    }

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

  /**
   * Transforming relative point from From point into absolute point
   * @param {Point} point 
   * @param {Point} relative 
   * @return {Point}
   */
  function relativeToAbsolutePoint(from,relative){
    return new Point(from.col + relative.col,from.row + relative.row)
  }

  function forEach(list,callback){
      for(var i in list){
        callback(list[i])
      }
  }

  var mId = 0;
  var mViewId = 0;
  function entityId(){
    return ++mId;
  }

  function viewid(){
    return ++mViewId;
  }
  