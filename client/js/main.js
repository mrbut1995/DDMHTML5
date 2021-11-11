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
    'ddm-input':"./tsh.ddm.input",
    'ddm-entity':"./tsh.ddm.entity",
    'ddm-player':"./tsh.ddm.player",
    'ddm-client':"./tsh.ddm.client",
    'ddm-match':"./tsh.ddm.match",
    'ddm-animator':"./tsh.ddm.animator",
    'ddm-path':"./tsh.ddm.path",
    'ddm-board':"./tsh.ddm.board",
    'ddm-blueprint':"./tsh.ddm.blueprint",

    //Server
    "server-meta-data" : "../../server/metadata",

    'view': './view',
    'animation':"./animation",
    'lib': './lib',
    'util': './util',
    'entity': "./entity",
    "message":"./message"
  },
  shim:{
    'ddm':[],
    'ddm-view':['ddm'],
    'ddm-logic':['ddm'],
    'ddm-loader':['ddm'],
    'ddm-debug':['ddm'],
    'ddm-input':['ddm'],
    'ddm-entity':['ddm'],
    'ddm-board':['ddm'],
    'ddm-blueprint':['ddm']
  },
});


window.onload = function(){
  console.log("window.onLoad")
  var tsh_module = ["ddm-view","ddm-logic","ddm-loader","ddm-input","ddm-debug","ddm-entity","ddm-player","ddm-client","ddm-match","ddm-animator","ddm-path","ddm-board","ddm-blueprint"]
  var required_lib = ['lib/class','util/util','util/constant','util/struct','util/gametype',"message","jquery"]
  var ddm = ["ddm","server-meta-data/monster/dummymonster1"]
  ddm.push(...required_lib)
  ddm.push(...tsh_module)
  require(ddm,function(Tsh){
    console.log("onLoaded All Module")
    Tsh.Ddm.Game.init()
    Tsh.Ddm.Game.run()
})
}
