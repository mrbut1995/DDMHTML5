
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
                coord                       : Coord.zero(),
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
                animations                   : {}
            })
            
            if(View._onCreated)
                View._onCreated(this)
        },
        /**
         * @deconstrutor
         */
        destroy : function(){
            this.forEachChild(c => c.destroy())
            if(this.parent != null){
                this.removeInArray(this.parent.childs)
            }
            this.parent = null
            this.coord  = null
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
        forEachAnimation(callback){
            var keys = Object.keys(this.animations)
            for(var i  in keys){
                callback(this.animations[keys[i]])
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
         
        draw: function (context, mainView) {},
        
        //Get Set Property
        setPosition : function(coord){
            this.coord = coord
            this.dirty()
        },
        getPosition : function(){
            return deepCopy(this.coord)
        },
        setSize(size){
            this.size = size
            this.dirty()
        },
        getSize(){
            return deepCopy(this.size)
        },
        setScale(s){
            this.scale =s;
            this.dirty()
        },
        getScale(){
            return deepCopy(this.scale)
        },
        setBound : function(rect){
            this.coord.x = rect.x
            this.coord.y = rect.y
            this.size.w  = rect.w
            this.size.h  = rect.h
            this.dirty()
        },
        getBound : function(){
            return new Rect(this.coord,this.size.w,this.size.h)
        },
        setHighlight(value){
            this.highlight = value
            this.forEachChild(child => this.setHighlight(value));
            this.dirty()
            if(this._onHighlight)
                this._onHighlight()
        },
        toggleHighlight(){
            if(this.highlight){
                this.setHighlight(false)
            }else{
                this.setHighlight(true)
            }
        },
        isHighlight(){
            return this.highlight
        },
        setVisible(value){
            this.visible = value
            this.forEachChild(child => this.setVisible(value));
            this.dirty()
            if(this._onVisible)
                this._onVisible()
        },
        isVisible(){
            return this.visible
        },
        toggleVisble(){
            if(this.visible){
                this.setVisible(false)
            }else{
                this.setVisible(true)
            }
        },
        setEnable(value){
            this.enable = value
            this.forEachChild(child => this.setEnable(value));
            this.dirty()
            if(this._onEnable)
                this._onEnable()
        },
        isEnabled(){
            return this.enable
        },
        toggleEnable(){
            if(this.enable){
                this.setEnable(false)
            }else{
                this.setEnable(true)
            }
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
        onVisible(callback){
            this._onVisible = callback
        },
        onEnable(callback){
            this._onEnable = callback
        },
        onHighlight(callback){
            this._onHighlight = callback
        }
    })
    View.onCreated = function(callback){this._onCreated = callback}.bind(View)

    return View

})