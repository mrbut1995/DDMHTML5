define(["ddm","jquery"],function(Tsh,$){
    Tsh = Tsh || {}
    Tsh.Ddm = Tsh.Ddm || {}
    
    Tsh.Ddm.Camera = {
        init(app){
            // position of camera (left-top coordinate)
            this.xView = xView || 0;
            this.yView = yView || 0;
        
            // distance from followed object to border before camera starts move
            this.xDeadZone = 0; // min distance to horizontal borders
            this.yDeadZone = 0; // min distance to vertical borders
        
            // viewport dimensions
            this.wView = viewportWidth;
            this.hView = viewportHeight;
        
            // allow camera to move in vertical and horizontal axis
            this.axis = AXIS.BOTH;
        
            // object that should be followed
            this.followed = null;

            this.viewportRect = new Rect(new Coord(this.xView, this.yView), this.wView, this.hView);
            this.worldRect    = new Rect(Coord.zero(),this.wView,this.hView)
            
            this.app = app
            if(this._onInitialized){
                this._onInitialized()
            }
        },
        updateWordRect(wWorld,hWorld){
            this.worldRect.w = wWorld
            this.worldRect.h = hWorld
        },

        // gameObject needs to have "x" and "y" properties (as world(or room) position)
        follow(view,xDeadzone,yDeadzone){
            this.followed = view;
            this.xDeadZone = xDeadzone;
            this.yDeadZone = yDeadzone;
        },
        onInitialized(callback) { this._onInitialized = callback }
    }
})
