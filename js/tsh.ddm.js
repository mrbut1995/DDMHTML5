define(function(){
    console.log("LOAD TSH.DDM")
// var Tsh = Tsh || {}
Tsh.Ddm = Tsh.Ddm || {}


let start, previousTimeStamp;

window.onload = function(){
    Tsh.Ddm.Game.init()
    Tsh.Ddm.Game.run()
}

//Loader
Tsh.Ddm.Loader = {
    loaded:         true,
    loadedCount:    0, // Assets that have been loaded so far
    totalCount:    0, // Total number of asstes that need loading
    soundFileExtn: ".ogg",

    init: function(){
        var mp3support,oggsupport;
        var audio = document.createElement("ddm-audio")

        if(audio.canPlayType){
            mp3support = "" !== audio.canPlayType("audio/mpeg");
            oggsupport = "" !== audio.canPlayType("audio/ogg; codecs=\"vorbis\"");
        }else{
            mp3support = false
            oggsupport = false
        }
        // Check for ogg, then mp3, and finally set soundFileExtn to undefined
        loader.soundFileExtn = oggsupport ? ".ogg" : mp3support ? ".mp3" : undefined;
    },
    loadImage: function(url){
        this.loaded = false;
        this.totalCount++;
        var image = new Image();
        image.addEventListener("load", loader.itemLoaded, false);
        image.src = url;
        return image;
    },
    loadSound: function(url){
        this.loaded = false;
        this.totalCount++;
        var audio = new Audio();
        audio.addEventListener("canplaythrough", loader.itemLoaded, false);
        audio.src = url + loader.soundFileExtn;
        return audio;
    },
    itemLoaded: function(ev){
        // Stop listening for event type (load or canplaythrough) for this item now that it has been loaded
        ev.target.removeEventListener(ev.type, loader.itemLoaded, false);
        loader.loadedCount++;
        if (loader.loadedCount === loader.totalCount) {
        // Loader has loaded completely..
        // Reset and clear the loader
        loader.loaded = true;
        loader.loadedCount = 0;
        loader.totalCount = 0;
        // Hide the loading screen
        // and call the loader.onload method if it exists
        if (loader.onload) {
                loader.onload();
                loader.onload = undefined;
            }
        }
    },
    load: function(url){
        this.totalCount++;
        this.load = false;
        var image = new Image();
        image.src = url;
        image.onload = function(){
            imageLoader.loadedImages ++;
            if(imageLoader.loadedImages === imageLoader.totalImages){
                imageLoader.loaded = true
            }
            image.onload = undefined
        }
        return image;
    }
}

Tsh.Ddm.Match = {
    data :{
        pieces  :[],
        lands   :[],
    },
    init: function(){
    },
    load:function(){
    }
}

Tsh.Ddm.Game = {
    init: function(){
        getDOMObject()

        Tsh.Ddm.Match.init()
        Tsh.Ddm.View.init()
        Tsh.Ddm.Debug.init()

        Tsh.Ddm.Match.load()
    },
    run: function(){
        window.requestAnimationFrame(Tsh.Ddm.Game.step);    
    },
    step: function(timestamp) {
        if (start === undefined)
          start = timestamp;
        const elapsed = timestamp - start;
      
        var delta =  timestamp - previousTimeStamp;
    
        if (previousTimeStamp !== timestamp) {
          Tsh.Ddm.View.update({delta:delta})
        }
      
        previousTimeStamp = timestamp
        window.requestAnimationFrame(step);
    },
    hideScreen: function(id){
    },
    showScreen: function(){
    },
    hideScreens: function(){
    }
}


let Config = {
    boardCol : 13,
    boardRow : 19
}

function step(timestamp) {
    if (start === undefined)
      start = timestamp;
    const elapsed = timestamp - start;
  
    var delta =  timestamp - previousTimeStamp;

    if (previousTimeStamp !== timestamp) {
      Tsh.Ddm.View.update({delta:delta})
    }
  
    previousTimeStamp = timestamp
    window.requestAnimationFrame(step);
}


function getDOMObject(){
    DOMBoard        =  document.getElementById("board")
    DOMDiceOne      = document.getElementById("dice1")
    DOMDiceTwo      = document.getElementById("dice2")
    DOMDiceThree    = document.getElementById("dice3")
}



function MoveResult(player,newPoint){
    
}

function PlayerAction(source,action,evt){

}



function Land(id,point,owner){
    this.id    = id    || -1
    this.point = point || new Point(0,0)
    this.owner = owner || -1

    this.getInArray = function (array){
        for(var i = 0 ; i < array.length;i++){
            if(this.id === array[i])
                return i
        }
        return -1
    }
    
    this.isInArray = function(array){
        return this.getInArray(array) != -1
    }

    this.isAt = function(point){
        return this.point.equals(point)
    }
}

function Piece(id,point,owner){
    this.point = point || new Point(0,0)
    this.owner = owner || -1

    this.getInArray = function (array){
        for(var i = 0 ; i < array.length;i++){
            if(this.id === array[i])
                return i
        }
        return -1
    }
    
    this.isInArray = function(array){
        return this.getInArray(array) != -1
    }

    this.isAt = function(point){
        return this.point.equals(point)
    }

}


// Define Common attributes for Game of DDM
function GameState(){

}
//Dice Rolling
function rollTo(DOMObject,result){
    console.log("result = ",result)
    for (var i = 1; i <= 6; i++) {
        DOMObject.classList.remove('show-' + i);
        if (result === i) {
            console.log("roll to ",'show-' + i)
            DOMObject.classList.add('show-' + i);
        }
      }    
}


function roll(){
    console.log("roll ")

    var dices = document.getElementById("dicesId");
    dices.classList.toggle("show")
    rollTo(DOMDiceOne,Math.floor(Math.random() * 6))
    rollTo(DOMDiceTwo,Math.floor(Math.random() * 6))
    rollTo(DOMDiceThree,Math.floor(Math.random() * 6))

    //Hiding Dice When Done
    setTimeout(()=>{dices.classList.toggle("show")},1300)
}

function prototypeName(obj){
    return obj.constructor.name
}

})