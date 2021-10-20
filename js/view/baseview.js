var isParentInheritanceValue = function(name){
    return name == "visible" || name == "enable" || name == "isHighlight";
} 

define(["jquery"],function($){
    console.log("CLASS = ",Class.extend)
    var BaseView = Class.extend({
        init      : function(otps){
            this.parent                      = null
            this.childs                      = []
    
            this.uuid                        = uuid()
            this.rect                        = new Rect(0,0,0,0) 
            this.color                       = "#000000"
            this.focused                     = false
            this.mouseReceived               = false
            this.type                        = "view"
    
            //Parent Inheritance Value
            this.visible                     = true
            this.enable                      = true
            this.isHighlight                 = false
    
    
            //Method
            $.extend(this,otps)
        },

        //Message Handle Method
        onMouseClicked              : null, 
        onMousePressed              : null, 
        onMouseReleased             : null, 
        onMousePressAndHold         : null, 
        onUpdate                    : null, 
        onPropertyChanged           : null, 
        onFoucsed                   : null, 
        onMove                      : null, 
        onCreated                   : null, 
        onDestroyed                 : null,
        onDraw                      : null,

        draw : null,
       
        childOf   : function(parent){
            if(this.parent != null){
                //Remove item from the current parent's child list
                this.removeInArray(this.parent.childs)
            }
            this.parent = parent
    
            if(parent == null){
                console.log("Set parent = null => Doint nothing")
            }else{
                console.log("Set parent = ",parent.toString()," => add into parent's child")
                this.parent.childs.push(this)
            }
        },
        sendMessage : function(evt){
            var defOpts = {
                msg:"unknwon",
            }
            evt = $.extend(defOpts,evt)
            var defParam = {
                source:this
            }
            var event = null
            console.log("Call ",evt.mgs)
            if(!this.hasOwnProperty(evt.mgs) || !isFunction(this[evt.mgs])){
                console.log("[ERROR] DOES NOT CAONTAIN SLOT METHOD");
                return;
            }
            this[evt.mgs](defParam);
        },
        contain      : function(coord){
            return this.rect.contain(coord)
        },
        property     : function(name){
            return this[name]
        },
        setProperty  : function(name,value){
            if (!this.hasOwnProperty(name)) 
                return false
            console.log("property[",name,"]=(",this[name],"=>",value,")")
            this[name] = value
            if(isParentInheritanceValue(name)){
                //Set Child's property to the same value as parent
                for(var i in this.childs){
                    this.childs[i].setProperty(name,value)
                }
            }
            this.sendMessage({msg:"onPropertyChanged"})
        },
        
        highlight : function(value){
            this.setProperty("isHighlight",value);
        },
    
        move         : function(coord){
            var r = new Rect(coord,this.rect.w,this.rect.h)
            this.setProperty("rect",r)
            this.sendMessage({msg:"onMove"})
        },
        inArray    : function(a){
            for(var i= 0 ; i < a.length;i++){
                if(a[i] == this) 
                return true
            }
            return false
        },
        removeInArray : function(a){
            for(var i= 0 ; i < a.length;i++){
                if(a[i] == this){
                    console.log("FOUND IN ARRAY i = ",i," => REMOVED")
                    a.splice(i,1)
                }
            }
        },
        destroy : function(){
        },
        toString : function(){
            return this.type+"("+this.uuid+")"
        },
    })

    return BaseView

})