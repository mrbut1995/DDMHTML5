var isParentInheritanceValue = function(name){
    return name == "visible" || name == "enable" || name == "isHighlight";
} 

define(["jquery"],function($){
    console.log("CLASS = ",Class.extend)
    var View = Class.extend({
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
    
            //Source For drawing Image
            this.imgSrcNormal                = ""
            this.imgSrcHidden                = ""
            this.imgSrcSelect                = ""
            this.imgSrcDisable               = ""

            //Method
            $.extend(this,otps,false)
        },
        //Message Handle Method
        onMouseClicked              : null, 
        onMousePressed              : null, 
        onMouseReleased             : null, 
        onMousePressAndHold         : null,
        onMouseDrag                 : null,
        onMouseCancel               : null,
         
        onUpdate                    : null, 
        onPropertyChanged           : null, 
        onFocused                   : null, 
        onCreated                   : null, 
        onDestroyed                 : null,

        draw: function (context, mainView) {
            context.save()
            if(!this.enable){
                context.fillStyle = this.imgSrcDisable
            }else if(!this.visible){
                context.fillStyle = this.imgSrcHidden
            }else if (this.isHighlight) {
                context.fillStyle = this.imgSrcSelect
            } else {
                context.fillStyle = this.imgSrcNormal
            }
            let drawingRect = this.rect
            context.fillRect(drawingRect.x, drawingRect.y, drawingRect.w, drawingRect.h)
            context.restore()
        },
        
        childOf   : function(parent){
            if(this.parent != null){
                //Remove item from the current parent's child list
                this.removeInArray(this.parent.childs)
            }
            this.parent = parent
    
            if(parent == null){
            }else{
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
                callChild(child => child.setProperty(name,value));
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
        callChild: function(callback){
            for(var i in this.childs){
                callback(this.childs[i])
            }
        }
    })

    return View

})