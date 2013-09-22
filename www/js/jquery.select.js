$(function(){
    $( 'select' ).each( function(){
        new NiceSelect( $( this ) );
    } );


} );

var NiceSelect = function(obj){
    this.obj = obj;
    this.span = $( '<span class="nice-select__item"></span>' );
    this.wrap = $( '<div class="nice-select"></div>' );

    this.init();
};
NiceSelect.prototype = {
    init: function(){
        var self = this,
            obj = self.obj,
            wrap = self.wrap,
            span = self.span;

        obj.css( {
            opacity: 0
        } );

        obj.wrap( wrap );
        obj.before( span );
        span.text( obj.val() );

        self.controls();
    },
    controls: function() {
        var self = this;

        self.obj.on( 'change', function() {
            self.span.text( $( this ).find('option:selected').text() );
        } );
    }
};