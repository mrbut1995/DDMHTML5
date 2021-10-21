define(["jquery", "view/view"], function ($, View) {
    var BoardItemView = View.extend({
        init:function(opts){
            console.log("INIT BoardItemView")
            this._super(opts)
        },
        
    })
    return BoardItemView;
})