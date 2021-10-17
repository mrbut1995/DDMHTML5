define(["jquery"],function($){
    var prototype = function(opts){
        var defOpts = {
            parent                      : null,
            childs                      : [],
    
            uuid                        : uuid(),
            rect                        : new Rect(0,0,0,0) ,
            color                       : "#000000",
            focused                     : false,
            mouseReceived               : false,
            type                        : "view",
    
            //Parent Inheritance Value
            visible                     : true,
            enable                      : true,
            isHighlight                 : false,
    
            //Message Handle Method
            onMouseClicked              : null ,
            onMousePressed              : null ,
            onMouseReleased             : null ,
            onMousePressAndHold         : null ,
            onUpdate                    : null ,
            onPropertyChanged           : null ,
            onFoucsed                   : null ,
            onMove                      : null ,
            onCreated                   : null ,
            onDestroyed                 : null
        }
        opts = $.extend(defOpts,opts)
        $.extend(true,this,opts)
    
        this.draw    = null
        this.update  = null
    
    
        var isParentInheritanceValue = function(name){
            return name == "visible" || name == "enable" || name == "isHighlight";
        } 
    
        this.childOf   = function(parent){
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
        }
        this.sendMessage = function(opts){
            var defOpts = {
                msg:"unknwon",
            }
            opts = $.extend(defOpts,opts)
            var defParam = {
                source:this
            }
            var event = null
            console.log("Call ",opts.mgs)
            if(!this.hasOwnProperty(opts.mgs) || !isFunction(this[opts.mgs])){
                console.log("[ERROR] DOES NOT CAONTAIN SLOT METHOD");
                return;
            }
            this[opts.mgs](defParam);
        }
        this.contain      = function(coord){
            return this.rect.contain(coord)
        }
        this.property     = function(name){
            return this[name]
        }
        this.setProperty  = function(name,value){
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
        }
        
        this.highlight = function(value){
            this.setProperty("isHighlight",value);
        }
    
        this.move         = function(coord){
            var r = new Rect(coord,this.rect.w,this.rect.h)
            this.setProperty("rect",r)
            this.sendMessage({msg:"onMove"})
        }
        this.inArray    = function(a){
            for(var i= 0 ; i < a.length;i++){
                if(a[i] == this) 
                return true
            }
            return false
        }
        this.removeInArray = function(a){
            for(var i= 0 ; i < a.length;i++){
                if(a[i] == this){
                    console.log("FOUND IN ARRAY i = ",i," => REMOVED")
                    a.splice(i,1)
                }
            }
        }
        this.destroy = function(){
    
        }
        this.toString = function(){
            return this.type+"("+this.uuid+")"
        }
    }
    return prototype
})