requirejs.config({
  paths: {
    'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min',
    'ddm': "./tsh.ddm",
    //Module 
    'ddm-view': "./tsh.ddm.view.h5",
    'ddm-logic': "./tsh.ddm.logic",
    'ddm-loader':"./tsh.ddm.loader",
    'ddm-debug' :"./tsh.ddm.debug",
    'ddm-animator':"./tsh.ddm.animator",
    'ddm-input':"./tsh.ddm.input",

    'view': './view',
    'animation':"./animation",
    'lib': './lib',
    'util': './util',
  }
});


//Global DOM
//DOM Object
var DOMBoard
var DOMDiceOne
var DOMDiceTwo
var DOMDiceThree
var DOMCanvas

define(['lib/class','util/util','util/constant','util/struct',"jquery"], function () {
  console.log("LOAD MAIN")
  
  require(["ddm-view"])
  require(["ddm-logic"])
  require(["ddm-loader"])
  require(["ddm-input"])
  require(["ddm-animator"])
  require(["ddm-debug"])
  
  require(["ddm"])
  var A  = Class.extend({f:null})
  var B  = A.extend({f:function(){this._super();console.log("CALL FROM B")}})
  var val = new B()
  val.f()
})

