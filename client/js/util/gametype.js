

function isFunction(f) {
    return typeof f === 'function'
  }
  function isString(s) {
    return typeof s === 'string'
  }
  function isInteger(n) {
    return typeof n === 'number' && Math.floor(n) === n && isFinite(n)
  }

  var Types = {
      Views : {
          VIEW            : 0,
          LANDVIEW        : 1,
          MONSTERVIEW     : 3,
          MONSTERLORDVIEW : 4,
      } 
  }