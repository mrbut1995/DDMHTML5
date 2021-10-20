define(["jquery","view/views"],function($,Views){
    var Piece = Views.PieceView.extend({
        init:function(opts){
            this._super(opts)
        }
    })
    return Piece
})