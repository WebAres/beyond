$( function(){
    $( 'input[ type="checkbox" ]').each( function(){
        new NiceCheck( $( this ) )
    } );
} );

var NiceCheck = function( obj ){
    this.obj = obj;

    this.init();
};
    NiceCheck.prototype = {
        init: function(){
            var self = this;

            self.core = self.core();
            self.core.build();
        },
        core: function(){
            var self = this;

            return {
                build: function(){
                    self.checkChecked = self.obj.attr("checked");
                    self.checkDisabled = self.obj.attr("disabled");

                    self.parent = self.obj.parent();
                    self.label = self.parent.find( 'label' );

                    self.label.removeAttr( 'for' );

                    console.log(self.obj.attr( 'class' ))

                    self.obj.wrap( '<span class="' + self.obj.attr( 'class' ) + '"></span>' );

                    self.wraper = self.obj.parent();

                    self.obj.removeClass( 'niceCheck' );

                    if ( self.checkChecked ) {
                        self.wraper.addClass( 'niceChecked' );
                    }

                    if( self.checkDisabled ) {
                        self.wraper.addClass( 'niceCheckDisabled' );
                    }

                    self.core.controls();
                },
                change: function(){
                    if ( self.checkChecked ) {
                        self.wraper.removeClass( 'niceChecked' );
                        self.checkChecked = false;
                        self.obj[ 0 ].checked = false;
                    } else {
                        self.wraper.addClass( 'niceChecked' );
                        self.checkChecked = true;
                        self.obj[ 0 ].checked = true;
                    }
                    self.obj.trigger( 'change' );
                },
                controls: function(){
                    self.label.on( {
                        'click': function(){
                            if ( !self.checkDisabled ) {
                                self.core.change();
                            }
                        }
                    } );
                    self.wraper.on( {
                        'click': function(){
                            if ( !self.checkDisabled ) {
                                self.core.change();
                            }
                        }
                    } );
                }
            }
        }
    };
