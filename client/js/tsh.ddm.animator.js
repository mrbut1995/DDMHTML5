define(["ddm"],function(Tsh){
    Tsh.Ddm = Tsh.Ddm || {}
    Tsh.Ddm.Animator = {
        init(app){
            this.app = app
            if(this._onInitialized){
                this._onInitialized()
            }
        },
        update(delta){

        },
        onInitialized(callback){this._onInitialized = callback}
    }
})