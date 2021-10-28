define(["view/views","view/view"],function(Views,View){
    var ViewsFactory = {}

    ViewsFactory.builders = {};

    ViewsFactory.createView = function(kind,opts,parent){
        if(!kind){
            console.log("kind is undefined",true)
        }
        if(!isFunction(ViewsFactory.builders[kind])){
            console.log(kind + " is not a valid Entity type");
            return null;
        }
        return ViewsFactory.builders[kind](opts,parent);
    }

    ViewsFactory.builders[Types.Views.LANDVIEW] = function(opts,parent){
        var view = new Views.LandView(opts)
        if(parent instanceof View){
            view.childOf(parent)
        }
        return view
    }

    ViewsFactory.builders[Types.Views.MONSTERVIEW] = function(opts,parent){
        var view = new Views.MonsterView(opts)
        if(parent instanceof View){
            view.childOf(parent)
        }
        return view
    }

    ViewsFactory.builders[Types.Views.MONSTERLORDVIEW] = function(opts,parent){
        var view = new Views.MonsterLordView(opts)
        if(parent instanceof View){
            view.childOf(parent)
        }
        return view
    }

    return ViewsFactory
})