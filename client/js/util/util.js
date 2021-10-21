
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
  