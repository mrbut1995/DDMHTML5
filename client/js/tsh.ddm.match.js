define(["ddm"],function(Tsh){
    Tsh.Ddm.Match = {
        init(app){
            this.matchid = 0
            this.data = [];
            this.board = null

            this.app = app
            if(this._onInitialized){
                this._onInitialized()
            }
        },
        onInitialized   (callback){this._onInitialized = callback},
    }
})