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
    'ddm-entity':"./tsh.ddm.entity",
    'ddm-player':"./tsh.ddm.player",
    'ddm-client':"./tsh.ddm.client",

    'view': './view',
    'animation':"./animation",
    'lib': './lib',
    'util': './util',
    'entity': "./entity",
  },
  shim:{
    'ddm':[],
    'ddm-view':['ddm'],
    'ddm-logic':['ddm'],
    'ddm-loader':['ddm'],
    'ddm-debug':['ddm'],
    'ddm-animator':['ddm'],
    'ddm-input':['ddm'],
    'ddm-entity':['ddm'],
  },
});



window.onload = function(){
  console.log("window.onLoad")
  var tsh_module = ["ddm-view","ddm-logic","ddm-loader","ddm-input","ddm-animator","ddm-debug","ddm-entity","ddm-player","ddm-client"]
  var required_lib = ['lib/class','util/util','util/constant','util/struct','util/gametype',"jquery"]
  var ddm = ["ddm"]
  ddm.push(...required_lib)
  ddm.push(...tsh_module)
  require(ddm,function(Tsh){
    console.log("onLoaded All Module")
    Tsh.Ddm.Game.init()
    Tsh.Ddm.Game.run()

  })
  // require(["tsh"])
}
