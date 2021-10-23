define(["jquery","ddm"],function($,Tsh){
    var Entity = Class.extend({
        //Property
        
        init(id,kind){
            this.id = id
            this.kind = kind
            this.animations = []

            this.isLoaded = false
        },
        setName : function(name){
            this.name = name;
        },
        setAnimation: function(animations){
            var self = this
        },
        animate:function(name,opts,onEndCallback){
            let defOpts = {
                speed : 0,
                count : 0,
            }
            opts = $.extend(defOpts,opts)
        },
        //Set Callback
        ready : function(f){
            this.read_callback = f
        },
    })
    return Entity
})