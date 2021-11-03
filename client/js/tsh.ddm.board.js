define(["ddm","view/boardview"],function(Tsh,BoardView){
    Tsh.Ddm = Tsh.Ddm||{}
    Tsh.Ddm.Board = {
        init(app){
            this.data   = []
            this.isLoaded = false;

            this.view  = null

            this.app = app
            if(this._onInitialized){
                this._onInitialized()
            }
        },
        connectBoardView(view){
            if(view instanceof BoardView){
                console.log("Connect to",view)
                this.view = view
            }
        },
        onInitialized(callback){this._onInitialized = callback}
    }
    console.log("LOAD DDM BOARD")
})