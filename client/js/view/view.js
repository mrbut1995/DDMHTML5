
define(["jquery"],function($){
    var View = Class.extend({
        init      : function(otps){
            this.parent                      = null
            this.childs                      = []
    
            this.uuid                        = uuid()
            this.bound                        = new Rect(0,0,0,0) 
            this.focused                     = false
            this.type                        = ""
            this.view                        = ""

            //Parent Inheritance Value
            this.visible                     = true
            this.enable                      = true
            this.highlight                   = false
            
            //Source For drawing Image
            this.imgSrcNormal                = ""
            this.imgSrcHidden                = ""
            this.imgSrcSelect                = ""
            this.imgSrcDisable               = ""

            //Method
            $.extend(this,otps,false)

            if(this._onCreated)
                this._onCreated()
        },
        forEachChild: function(callback){
            for(var i in this.childs){
                var view = this.childs[i]
                if(view == null)
                    continue
                callback(view)
            }
        },
        childAt: function (coord) {
            var lst = []
            this.forEachChild(function(view){
                if(view.contain(coord)){
                    lst.unshift(view)
                }
            }.bind(this))
            return lst;
        },
        forEachChildAt(coord,callback){
            if(this.childs.length <= 0)
                return;
            var childs = this.childAt(coord)
            for(var i in childs){
                callback(childs[i])
            }
        },

        //Mouse Handle
        mouseClicked            (ev){
            if(this._onMouseClicked)
                this._onMouseClicked(ev)
                this.forEachChildAt( v => v.mouseClicked(ev))
        }, 
        mousePressed            (ev){
            if(this._onMousePressed)
                this._onMousePressed(ev)
            this.forEachChildAt( v => v.mousePressed(ev))
        }, 
        mouseReleased           (ev){
            if(this._onMouseReleased)
                this._onMouseReleased(ev)
            this.forEachChildAt( v => v.mouseReleased(ev))
        }, 
        mousePressAndHold       (ev){
            if(this._onPressAndHold)
                this._onPressAndHold(ev)
            this.forEachChildAt( v => v.mousePressAndHold(ev))
        },
        mouseDrag               (ev){
            if(this._onMouseDrag)
                this._onMouseDrag(ev)
            this.forEachChildAt( v => v.mouseDrag(ev))
        },
        mouseCancel             (ev){
            if(this._onMouseCancel)
                this._onMouseCancel(ev)
            this.forEachChildAt( v => v.mouseCancel(ev))
        },
         
        //Signal
        onUpdate (callback){
            this._onUpdate = callback
        },
        onPropertyChanged(callback){
            this._onPropertyChanged = callback
        },
        onCreated(callback){
            this._onCreated = callback
        },
        onDestroyed(callback){
            this._onDestroyed = callback
        },
        onMouseClicked(callback){
            this._onMouseClicked = callback
        },
        onMousePressed(callback){
            this._onMousePressed = callback
        },
        onMouseReleased(callback){
            this._onMouseReleased = callback
        },
        onMousePressAndHold(callback){
            this._onPressAndHold = callback
        },
        onMouseDrag(callback){
            this._onMouseDrag = callback
        },
        onMouseCancel(callback){
            this._onMouseCancel = callback
        },
        
        draw: function (context, mainView) {
            context.save()
            var style;
            if(!this.enable){
                style = this.imgSrcDisable
            }else if(!this.visible){
                style = this.imgSrcHidden
            }else if (this.highlight) {
                style = this.imgSrcSelect
            } else {
                style = this.imgSrcNormal
            }
            let drawingRect = this.bound
            context.fillStyle = style
            context.fillRect(drawingRect.x, drawingRect.y, drawingRect.w, drawingRect.h)
            context.restore()
        },
        
        //Get Set Property
        setPosition : function(point){
            this.bound.x = point.x
            this.bound.y = point.y

            if(this._onPropertyChanged)
                this._onPropertyChanged()
        },
        getPosition : function(){
            return new Coord(this.bound.x,this.bound.y)
        },
        setBounding : function(rect){
            this.bound = rect

            if(this._onPropertyChanged)
                this._onPropertyChanged()
        },
        getBounding : function(){
            return this.bound
        },
        setHighlight(value){
            this.highlight = value
            forEachChild(child => this.setHighlight(value));
        },
        isHighlight(){
            return this.highlight
        },
        setVisible(value){
            this.visible = value
            forEachChild(child => this.setVisible(value));
        },
        isVisible(){
            return this.visible
        },
        setEnable(value){
            this.enable = value
            forEachChild(child => this.setEnable(value));
        },
        isEnabled(){
            return this.enable
        },
        /////////////////////////////////////////

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

        contain      : function(coord){
            return this.bound.contain(coord)
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
            forEachChild(c => c.destroy())
            if(this.parent != null){
                this.removeInArray(this.parent.childs)
            }
            this.parent = null
        },
        toString : function(){
            return this.type+"("+this.uuid+")"
        },
        forEachChild: function(callback){
            for(var i in this.childs){
                callback(this.childs[i])
            }
        }
    })

    return View

})