define(["entity/entity","view/views"],function(Entity,Views){
    var Land = Entity.extend({
        init(){
            this._super()
            this.views = new Views.LandView()
        },
        destroy(){

        },
        placed(){

        },
        hidden(){

        },
    })
    return Land;
})