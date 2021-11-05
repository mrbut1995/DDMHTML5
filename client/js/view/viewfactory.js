define(["view/views","view/view","view/landview","view/monsterview"],function(Views,View,LandView,MonsterView){
    var ViewsFactory = {}

    ViewsFactory.builders = {};

    ViewsFactory.createView = function(kind,id,config,layer,parent){
        if(!kind){
            console.log("kind is undefined",true)
        }
        if(!isFunction(ViewsFactory.builders[kind])){
            console.log(kind + " is not a valid Entity type");
            return null;
        }
        return ViewsFactory.builders[kind](id,config,layer,parent);
    }

    ViewsFactory.builders[Types.Views.LANDVIEW] = function(id,config,layer,parent){
        var view = new LandView(id,config,parent)
        if(parent instanceof View){
            view.childOf(parent)
        }
        return view
    }

    ViewsFactory.builders[Types.Views.MONSTERVIEW] = function(id,config,layer,parent){
        var view = new MonsterView(id,config,parent)
        if(parent instanceof View){
            view.childOf(parent)
        }
        return view
    }

    ViewsFactory.builders[Types.Views.MONSTERLORDVIEW] = function(id,config,layer,parent){
        var view = new Views.MonsterLordView(id,config,parent)
        if(parent instanceof View){
            view.childOf(parent)
        }
        return view
    }

    return ViewsFactory
})