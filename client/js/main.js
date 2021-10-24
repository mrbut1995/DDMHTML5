requirejs.config({
  paths: {
    'message':'./message',
    'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min',
    'ddm': "./tsh.ddm",
    
    //Module 
    'ddm-view': "./tsh.ddm.view.h5",
    'ddm-logic': "./tsh.ddm.logic",
    'ddm-loader':"./tsh.ddm.loader",
    'ddm-debug' :"./tsh.ddm.debug",
    'ddm-animator':"./tsh.ddm.animator",
    'ddm-input':"./tsh.ddm.input",
    'ddm-input':"./tsh.ddm.entity",

    'view': './view',
    'animation':"./animation",
    'lib': './lib',
    'util': './util',
    'entity': "./entity",
  }
});


//Global DOM
//DOM Object
// var DOMBoard
// var DOMDiceOne
// var DOMDiceTwo
// var DOMDiceThree
// var DOMCanvas

define(['lib/class','util/util','util/constant','util/struct','util/gametype',"jquery"], function () {
  console.log("LOAD MAIN")
  
  require(["ddm-view"])
  require(["ddm-logic"])
  require(["ddm-loader"])
  require(["ddm-input"])
  require(["ddm-animator"])
  require(["ddm-debug"])
  require(["ddm-entity"])

  require(["ddm"])

  var items = {
    a:"a0",
    b:"b1",
    x:2,
    y:3,
    e:4
  }
  items["f"] = 9
  var keys = Object.keys(items)
  for(var i in keys){
    console.log(keys[i])
  }
})


