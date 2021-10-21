define(function(){
    var Entity = Class.extend({
        init(id,kind){
            this.id = id
            this.kind = kind

            this.view = null
            this.animations = []

            this.col = 0
            this.row = 0

            this.isLoaded = false
        },
        setGridPosition: function(col,row){
            this.col = col
            this.row = row
        },
        setName : function(name){
            this.name = name;
        },
        setAnimation: function(){

        },
        getDistanceToEntity: function(entity){

        },
        isCloseTo: function(entity){

        },
        isAdjacent: function(entity){

        },
        isAdjacentNonDiagonal:function(entity){

        },
        //Set Callback
        ready : function(f){
            this.read_callback = f
        },
    })
    return Entity
})