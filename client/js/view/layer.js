define(["view/view"],function(View){
    var Layer = Class.extend({
        init(name,maincanvas){
            this.name        = name
            this.views        = {}
            this.canvas      = document.createElement("canvas")
            this.context     = this.canvas.getContext("2d");

            if(maincanvas !== null && maincanvas !== undefined){
                this.maincontext = maincanvas.getContext("2d");
                this.maincanvas  = maincanvas
                this.canvas.width = maincanvas.width
                this.canvas.height = maincanvas.height    
            }
        },
        registerView(view){
            if(view === null || view === undefined || !(view instanceof View)){
                console.log("CANNOT REGISTER view = ",view)
                return
            }
            if(this.views[view.id] === undefined){
                this.views[view.id] = view
                view.layer = this.name
                view.onDirty(function(){
                    this.dirtyItemInLayer()
                }.bind(this))
                
            }else{
                console.log("This view already exist")
            }
        },
        unregisterView(view){
            if(view.id in this.views){
                this.views[view.id].onDirty(null)
                delete this.views[view.id]
            }
        },
        forEachView(callback){
            _.each(this.views,callback)
        },
        draw(maincanvas){
            this.maincanvas  = maincanvas
            this.maincontext = maincanvas.getContext("2d");
            this.canvas.width = maincanvas.width
            this.canvas.height = maincanvas.height

            this.forEachView(function(view){
                if(view !== null || view !== undefined){
                    view.draw(this.context)
                }
            }.bind(this))
            maincanvas.getContext("2d").drawImage(this.canvas,0,0)
        },
        getLayerContext(){
            return this.context
        },
        getLayerCanvas(){
            return this.canvas
        },
        getViews(){
            return this.views
        },
        getView(index){
            return this.views[index]
        },
        dirtyItemInLayer(){
            if(this._onDirty){
                this._onDirty()
            }
        },

        onDirty(callback){
            this._onDirty = callback
        }
    })
    return Layer
})