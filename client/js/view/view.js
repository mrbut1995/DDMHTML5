
define(["jquery","ddm-view"],function($,Tsh){
    var View = Class.extend({
        /**
         * @constructor
         * @param {number} id 
         * @param {any} config 
         * @param {string} layer 
         * @param {View} parent 
         */
        init      : function(id,config,layer,parent){
            $.extend(true,this,{
                parent                      : parent,
                childs                      : [],
                view                        : null,

                id                          : id,
                point                       : new Point(0,0),
                size                        : new Size(0,0),
                focused                     : false,
                type                        : "",
                layer                       : layer,
                
                visible                     : true,
                enable                      : true,
                highlight                   : false,
            
                imgSrcNormal                : "",
                imgSrcHidden                : "",
                imgSrcSelect                : "",
                imgSrcDisable               : "",
    
                isDirty                     : false,
            
                scale                       : 1,
                config                      : config,
            })
            
            if(View._onCreated)
                View._onCreated(this)
        },
        /**
         * @deconstrutor
         */
        destroy : function(){
            forEachChild(c => c.destroy())
            if(this.parent != null){
                this.removeInArray(this.parent.childs)
            }
            this.parent = null
            this.point  = null
            this.size   = null
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
        dirty(){
            this.isDirty = this.isDirty || true
            if(this._onDirty)
                this._onDirty()
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
        onDirty(callback){
            this._onDirty = callback;
        },
        draw: function (context, mainView) {},
        
        //Get Set Property
        setPosition : function(point){
            this.point = point
            this.dirty()
        },
        getPosition : function(){
            return this.point
        },
        setSize(size){
            this.size = size
            this.dirty()
        },
        getSize(size){
            return this.size
        },
        setScale(s){
            this.scale =s;
            this.dirty()
        },
        getScale(s){
            return this.scale
        },
        setBound : function(rect){
            this.point.x = rect.x
            this.point.y = rect.y
            this.size.w  = rect.w
            this.size.h  = rect.h
            this.dirty()
        },
        getBound : function(){
            return new Rect(this.point,this.size.w,this.size.h)
        },
        setHighlight(value){
            this.highlight = value
            forEachChild(child => this.setHighlight(value));
            this.dirty()
        },
        isHighlight(){
            return this.highlight
        },
        setVisible(value){
            this.visible = value
            forEachChild(child => this.setVisible(value));
            this.dirty()
        },
        isVisible(){
            return this.visible
        },
        setEnable(value){
            this.enable = value
            forEachChild(child => this.setEnable(value));
            this.dirty()
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
            return this.getBound().contain(coord)
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
        toString : function(){
            return this.type+"("+this.id+")"
        },
        forEachChild: function(callback){
            for(var i in this.childs){
                callback(this.childs[i])
            }
        }
    })
    View.onCreated = function(callback){this._onCreated = callback}.bind(View)

    return View

})