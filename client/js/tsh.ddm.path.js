define(["jquery","ddm","lib/astar"],function($,Tsh,Astar){
    Tsh.Ddm = Tsh.Ddm || {}
    Tsh.Ddm.Path = {
        init(app){
            this.pathingGrid = []

            this.walkingGrid = []
            this.flyingGrid  = []

            this.grid = null
            
            this.blankGrid = []
            this.ignore    = []
            
            this.app = app
            if(this._onInitialized){
                this._onInitialized()
            }
        },
        constant:{
            MOVEABLE_CELL    : 1,
            NONMOVEABLE_CELL : 0,
        },

        //Findind
        findMovingPath(type,entity,col,row,findIncomplete){
            if(type == "walk"){
                return this.findPath(this.walkingGrid,entity,col,row,findIncomplete)
            }else if(type == "fly"){
                return this.findPath(this.flyingGrid ,entity,col,row,findIncomplete)
            }else{
                return this.findPath(this.pathingGrid,entity,col,row,findIncomplete)
            }
        },
        findPath(grid,entity,col,row,findIncomplete){
            var start = [entity.point.col,entity.point.row],
                end   = [col,row],
                path,points = [];
            this.grid = grid;
            
            path = Astar(grid,start,end)
            console.log("start = ",start,"end = ",end,"path = ",path)

            if(path.length === 0 && findIncomplete === true){
                path = this._findIncompletePath(start,end)
            }
            for(var i in path){
                points.push(new Point(path[i][0],path[i][1]))
            }
            return points;
        },
        ////////////////PATHING GRID
        /**
         * 
         * @param {*} map 
         */
        initPathingGrid(map){
            this.pathingGrid = [];
            for(var i = 0 ; i < map.height; i++){
                this.pathingGrid[i] = [];
                this.blankGrid  [i] = [];
                this.walkingGrid[i] = [];
                this.flyingGrid [i] = [];
                for(var j = 0;j < map.width; j++){
                    this.pathingGrid[i][j] = this.constant.NONMOVEABLE_CELL
                    this.blankGrid  [i][j] = this.constant.MOVEABLE_CELL
                    this.walkingGrid[i][j] = this.constant.NONMOVEABLE_CELL
                    this.flyingGrid [i][j] = this.constant.MOVEABLE_CELL
                }
            }

            
        },
        _findIncompletePath(start,end){

        },
        /**
         * 
         * @param {number[][]} grid Grid map to search path 
         * @param {number[2]} start Starting point of path that need to search
         * @param {number[2]} end End point of path that need to search
         */

        /**
         * Remove Value in Pathing grid
         * @param {Entity} entity Entity Target removed from pathing Grid
         * @param {int} col Colum Index of value need to remove from Pathing Grid
         * @param {int} row Row Index of value need to remove from Pathing Grid 
         */
        removeFromPathingGrid(entity,col,row){
            if(isLandView(entity)){
                this.pathingGrid[row][col] = this.constant.NONMOVEABLE_CELL
                this.walkingGrid[row][col] = this.constant.NONMOVEABLE_CELL
            }else if(isMonsterView(entity) || isMonsterLordView(entity)){
                this.pathingGrid[row][col] = this.constant.MOVEABLE_CELL
                this.walkingGrid[row][col] = this.constant.MOVEABLE_CELL
            }
        },
        registerToPathingGrid(entity,col,row){
            if(isLandView(entity)){
                this.pathingGrid[row][col] = this.constant.MOVEABLE_CELL
                this.walkingGrid[row][col] = this.constant.MOVEABLE_CELL
            }else if(isMonsterView(entity) || isMonsterLordView(entity)){
                this.pathingGrid[row][col] = this.constant.NONMOVEABLE_CELL
                this.walkingGrid[row][col] = this.constant.NONMOVEABLE_CELL
            }
        },

        //Slot
        onInitialized(callback){this._onInitialized = callback;},
    }
})