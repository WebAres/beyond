var loader;
$( function(){
    loader = new Loader();
    var statement = new Statement();
    new Popup( statement );
    $( '.tabs' ).each( function(){
        new Tabs( $( this ) );
    } );
    $( '.tooltip' ).each( function(){
        new Tooltip( $( this ) );
    } );

    $('#countdown_dashboard').countDown({
        targetDate: {
            'day': 		10,
            'month': 	1,
            'year': 	2014,
            'hour': 	11,
            'min': 		0,
            'sec': 		0
        }
    });


} );

$( window ).load( function(){
    loader.hide();
    new Gallery();
} );

var Loader =  function(){
    this.obj = $( '<div class="loader"></div>' );

    this.init();
};
Loader.prototype = {
    init: function(){
        var self = this;

        self.core = self.core();
        self.core.startView();
    },
    core: function(){
        var self = this;

        return {
            startView: function(){
                $( 'body' ).append( self.obj );
            }
        };
    },
    hide: function(){
        var self = this;

        self.obj.fadeOut( '300', function(){
            $( this ).remove();
        } );
    }
};

var Gallery =  function(){
    this.obj = $( '.gallery' );
    this.list = this.obj.find( '.gallery__list' );
    this.filter = this.obj.find( '.gallery__filter' );
    this.btnFilter = this.obj.find( '.gallery__filter-item' );
    this.items = this.obj.find( '.gallery__item' );
    this.ie8 = ( $.browser.msie && ( $.browser.version < 9 ) );

    this.init();
};
Gallery.prototype = {
    init: function(){
        var self = this;

        self.core = self.core();
        self.core.controls();
        self.core.build();
    },
    core: function(){
        var self = this;

        return {
            build: function(){
                var scrollPos = ( self.obj.width() - self.list.width() ) / 2;

                if( scrollPos > 0 ) scrollPos = 0;

                self.core.setFilter();

                if( !self.ie8 ){
                    self.scroll = new IScroll( '#gallery' , { scrollX: true, mouseWheel: true } );
                    self.scroll.scrollTo( scrollPos, 0 , 0 );
                    self.scroll.refresh();
                }
            },
            setFilter: function(){
                self.filter.css( { 'left': $( '.header__layout' ).offset().left } );
            },
            controls: function(){
                $( window ).on( {
                    'resize': function(){
                        self.core.setFilter();
                    }
                } );
                self.btnFilter.on( {
                    'click': function(){
                        var curItem = $( this );

                        if( !curItem.hasClass( 'active' ) ){
                            self.btnFilter.removeClass( 'active' );
                            curItem.addClass( 'active' );

                            if( curItem.hasClass('gallery__stared') ){
                                self.items.css( { display: 'none' } );
                                self.items.filter( '.stared' ).css( { display: 'block' } );
                            } else if( curItem.hasClass('gallery__check') ){
                                self.items.css( { display: 'none' } );
                                self.items.filter( '.checked' ).css( { display: 'block' } );
                            } else {
                                self.items.css( { display: 'block' } );
                            }
                            if( !self.ie8 ){
                                self.scroll.refresh();
                                self.scroll.scrollTo(0,0,0);
                            }
                        }
                    }
                } );
            }
        };
    }
};

var Popup =  function( statement ){
    this.btns = $( '.menu > div' );
    this.statement = statement;
    this.popups = $( '.popup' );
    this.animationSpeed = 300;
    this.btnClose = $( '.popup__close' );
    this.aboutBtn = $( '.about__btn' );
    this.ie8 = ( $.browser.msie && ( $.browser.version < 9 ) );

    this.init();
};
Popup.prototype = {
    init: function(){
        var self = this;

        self.core = self.core();
        self.core.controls();
    },
    core: function(){
        var self = this;

        return {
            controls: function(){
                self.btnClose.on( {
                    'click': function(){
                       self.btns.filter( '.active' ).trigger( 'click' );
                    }
                } );
                self.btns.on( {
                    'click': function(){
                        self.core.checkPopup( $( this ) );
                    }
                } );
                self.aboutBtn.on( {
                    'click': function(){
                        var curItem = $( this );

                        if( curItem.hasClass( 'statement' ) ){
                            self.btns.eq( 0 ).trigger( 'click' );
                        } else {
                            self.btns.eq( 1 ).trigger( 'click' );
                        }

                        return false;
                    }
                } )
            },
            checkPopup: function( curBtn ){
                var activeBtn = self.btns.filter( '.active'),
                    activeIndex = activeBtn.index(),
                    curIndex = curBtn.index();

                if ( self.ie8 ){
                    activeIndex = ( activeIndex / 2 ) - 0.5;
                    curIndex = ( curIndex / 2 ) - 0.5;
                }

                if ( curBtn.hasClass( 'active' ) ){
                    activeBtn.removeClass( 'active' );
                    self.core.hidePopup( curIndex );
                } else if ( activeBtn.length ){
                    activeBtn.removeClass( 'active' );
                    curBtn.addClass( 'active' );
                    self.core.switchPopup( activeIndex, curIndex );
                } else {
                    curBtn.addClass( 'active' );
                    self.core.showPopup( curIndex );
                }
            },
            showPopup: function( index ){
                var curPopup = self.popups.eq( index );

                curPopup.css( {
                    opacity: 0,
                    top: 20,
                    display: 'block'
                } );
                curPopup.stop( true, false ).animate( {
                    top: 50,
                    opacity: 1
                }, self.animationSpeed );
                self.statement.scroll.refresh();
            },
            switchPopup: function( oldIndex, newIndex ){
                var oldPopup = self.popups.eq( oldIndex ),
                    newPopup = self.popups.eq( newIndex );

                newPopup.css( {
                    opacity: 1,
                    top: 50,
                    display: 'block'
                } );
                oldPopup.stop( true, false ).fadeOut( self.animationSpeed );
                newPopup.stop( true, false ).fadeIn( self.animationSpeed );
                self.statement.scroll.refresh();
            },
            hidePopup: function( index ){
                var curPopup = self.popups.eq( index );

                curPopup.stop( true, false ).animate( {
                    top: 20,
                    opacity: 0
                }, self.animationSpeed, function(){
                    curPopup.css( {
                        display: 'none'
                    } );
                } );
            }
        };
    }
};

var Tabs =  function( obj ){
    this.obj = obj;
    this.elems = {
        titles: this.obj.find( '> dt' ),
        content: this.obj.find( '> dd' )
    };

    this.init();
};
Tabs.prototype = {
    init: function(){
        var self = this;

        self.core = self.core();
        self.core.controls();
    },
    core: function(){
        var self = this,
            elems = self.elems;

        return {
            controls: function(){
                elems.titles.on( {
                    'click': function(){
                        var curItem = $( this );

                        if( !curItem.hasClass( 'active' ) ){
                            self.core.openItem( curItem );
                        }
                    }
                } );
            },
            openItem: function( item ){
                var activeIndex = elems.titles.filter( '.active' ).index() / 2;

                elems.titles.removeClass( 'active' );
                item.addClass( 'active' );

                elems.content.eq( activeIndex).stop( true, false ).fadeOut( 300 );
                elems.content.eq( item.index() / 2 ).stop( true, false ).fadeIn( 300 );

            }
        };
    }
};

var Tooltip = function( obj ){
    this.obj = obj;
    this.body = $( 'body' );
    this.content = this.obj.find( '> div');
    this.close = this.obj.find( '.tooltip__close');

    this.init();
};
Tooltip.prototype = {
    init: function(){
        var self = this;

        self.core = self.core();
        self.core.controls();
    },
    core: function(){
        var self = this;

        return {
            controls: function(){
                self.obj.on( {
                    'click': function( event ){
                        event = event || window.event;

                        if (event.stopPropagation) {
                            event.stopPropagation()
                        } else {
                            event.cancelBubble = true
                        }
                        self.core.show();
                    }
                } );
                self.content.on( {
                    'click': function( event ){
                        event = event || window.event;

                        if (event.stopPropagation) {
                            event.stopPropagation()
                        } else {
                            event.cancelBubble = true
                        }
                    }
                } );
                self.body.on( {
                    'click': function( event ){
                        self.core.hide();
                    }
                } );
                self.close.on( {
                    'click': function( event ){
                        self.core.hide();
                    }
                } );
            },
            show: function(){
                self.obj.parents( '.donate__check-all' ).css( { zIndex: 100 } ) ;
                self.obj.parents( '.label').parent().css( { zIndex: 100 } ) ;
                self.content.css( {
                    display: 'block',
                    opacity: 0
                } );
                self.content.stop( true, false ).animate( {
                    opacity: 1,
                    left: -50
                }, 500 );
            },
            hide: function(){
                self.obj.parents( '.donate__check-all' ).css( { zIndex: 0 } ) ;
                self.obj.parents( '.label').parent().css( { zIndex: 0 } ) ;
                self.content.stop( true, false ).animate( {
                    opacity: 0
                }, 300, function(){
                    $( this ).css( { display: 'none', left: 0 } );
                } );
            }
        };
    }
};

var Statement = function(){
    this.obj = $( '.statement' );
    this.parent = this.obj.parents( '.popup__statement' );
    this.prov = false;
    this.elems = {
        statementLoadPhoto: this.obj.find( '.uploadx' ),
        statementBackground: this.obj.find( '#statement__background' ),
        statementLabel: this.obj.find( '#statement__label' ),
        statementIdentify: this.obj.find( '#statement__identify' ),
        statementLabelInput: this.obj.find( '.statement__label' ),
        statementIdentifyInput: this.obj.find( '.statement__identify' ),
        statementPhotos: this.obj.find( '.statement__photo li' ),
        statementLogo: this.obj.find( '.statement__logo li' ),
        statementNameSocial: this.obj.find( '.statement__name li' ),
        createNext: this.obj.find( '.statement__next' ),
        donateNext: this.obj.find( '.donate__next' ),
        content: this.obj.find( '> dd' ),
        titles: this.obj.find( '> dt' ),
        doneteCheckBox: this.obj.find( '.tabs input[ type="checkbox" ]' ),
        doneteCheckAll: this.obj.find( '.donate__check-all input[ type="checkbox" ]' ),
        donateBack: this.obj.find( '.statement__donate-back' ),
        shareBack: this.obj.find( '.statement__share-back' ),
        over: this.obj.find( '.over' )
    };

    this.init();
};
Statement.prototype = {
    init: function(){
        var self = this;

        self.core = self.core();
        self.core.controls();

        if( !self.ie8 ){
            self.scroll = new IScroll( '#cards' , { mouseWheel: true } );
            self.scroll.refresh();
        }
    },
    core: function(){
        var self = this,
            elems = self.elems;

        return {
            controls: function(){
                elems.statementPhotos.on( {
                    'click': function(){
                        var curItem = $( this );

                        if( !curItem.hasClass( 'active' ) ) {
                            elems.statementPhotos.removeClass( 'active' );
                            elems.statementBackground.val( curItem.attr( 'data-pic' ) );
                            curItem.addClass( 'active' );
                        }
                    }
                } );
                elems.statementLogo.on( {
                    'click': function(){
                        var curItem = $( this );

                        if( !curItem.hasClass( 'active' ) ) {
                            elems.statementLogo.removeClass( 'active' );
                            elems.statementLabel.val( curItem.attr( 'data-label' ) );
                            elems.statementIdentify.val( curItem.attr( 'data-identify' ) );
                            elems.statementIdentifyInput.val( '' );
                            elems.statementLabelInput.val( '' );
                            curItem.addClass( 'active' );
                        }
                    }
                } );
                elems.statementLabelInput.on( {
                    'keyup': function(){
                        elems.statementLogo.removeClass( 'active' );
                        elems.statementLabel.val( elems.statementLabelInput.val() );
                        elems.statementIdentify.val( elems.statementIdentifyInput.val() );
                    }
                } );
                elems.statementIdentifyInput.on( {
                    'keyup': function(){
                        elems.statementLogo.removeClass( 'active' );
                        elems.statementLabel.val( elems.statementLabelInput.val() );
                        elems.statementIdentify.val( elems.statementIdentifyInput.val() );
                    }
                } );
                elems.statementNameSocial.on( {
                    'click': function(){
                        var curItem = $( this );

                        if( !curItem.hasClass( 'active' ) ) {
                            elems.statementNameSocial.removeClass( 'active' );
                            curItem.addClass( 'active' );
                        }
                    }
                } );
                elems.createNext.on( {
                    'click': function(){
                        var curBlock = elems.content.eq( 0 ),
                            newBlock = elems.content.eq( 1 );

                        self.core.slideNext( curBlock, newBlock );
                        $( '.statement__selected' ).removeClass( 'statement__selected' );
                        elems.titles.eq( 1 ).addClass( 'statement__selected' );
                    }
                } );
                elems.donateNext.on( {
                    'click': function(){
                        var curBlock = elems.content.eq( 1 ),
                            newBlock = elems.content.eq( 2 );

                        self.core.slideNext( curBlock, newBlock );
                        $( '.statement__selected' ).removeClass( 'statement__selected' );
                        elems.titles.eq( 2 ).addClass( 'statement__selected' );
                    }
                } );
                elems.donateBack.on( {
                    'click': function(){
                        var curBlock = elems.content.eq( 1 ),
                            newBlock = elems.content.eq( 0 );

                        self.core.slideBack( curBlock, newBlock );
                        $( '.statement__selected' ).removeClass( 'statement__selected' );
                        elems.titles.eq( 0 ).addClass( 'statement__selected' );
                    }
                } );
                elems.shareBack.on( {
                    'click': function(){
                        var curBlock = elems.content.eq( 2 ),
                            newBlock = elems.content.eq( 1 );

                        self.core.slideBack( curBlock, newBlock );
                        $( '.statement__selected' ).removeClass( 'statement__selected' );
                        elems.titles.eq( 1 ).addClass( 'statement__selected' );
                    }
                } );
                elems.doneteCheckBox.on( {
                    'change': function(){
                        var curItem = $( this );

                        if ( !self.prov ) {
                            if( curItem.attr( 'checked' ) == undefined ) {
                                if( elems.doneteCheckAll.attr( 'checked' ) == 'checked' ) {
                                    elems.doneteCheckAll.parent().trigger( 'click' );
                                }
                            } else {
                                var prov = true;

                                elems.doneteCheckBox.each( function(){
                                    if( $( this ).attr( 'checked' ) == undefined ) {
                                        prov = false;
                                        return false;
                                    }
                                } );

                                if ( prov ){
                                    elems.doneteCheckAll.parent().trigger( 'click' );
                                }
                            }
                        }
                    }
                } );
                elems.doneteCheckAll.on( {
                    'change': function(){
                        var curItem = $( this );

                        self.prov = true;

                        if( curItem.attr( 'checked' ) == 'checked' ) {
                            elems.doneteCheckBox.each( function(){
                                if( $( this ).attr( 'checked' ) == undefined ) {
                                    $( this ).parent().trigger( 'click' );
                                }
                            } );
                        }

                        self.prov = false;
                    }
                } );
                elems.over.on( {
                    'click': function(){
                        $( this ).parents( 'li' ).find( '.niceCheck' ).trigger( 'click' );
                    }
                } );
                self.uploader = new qq.FileUploader({
                    element: elems.statementLoadPhoto[0],
                    action: elems.statementLoadPhoto.attr( 'data-php' ),
                    params: {},
                    allowedExtensions: elems.statementLoadPhoto.attr('data-ext').split(','),
                    sizeLimit: 0,
                    minSizeLimit: 0,
                    debug: false,
                    fileNum: 0,
                    uploaded: 2,
                    maxConnections: 10,
                    onSubmit: function( id, fileName ){
                    },
                    onProgress: function( id, fileName, loaded, total ){
                    },
                    onComplete: function(id, fileName, responseJSON){
                        console.log(id, fileName, responseJSON)
                    },
                    onCancel: function(id, fileName){},
                    messages: {},
                    showMessage: function(message){ alert(message);}
                });
            },
            slideBack: function( curBlock, newBlock ){
                self.parent.css( { overflow: 'hidden' } );

                newBlock.css( {
                    left: -1011
                } );
                curBlock.animate( {
                    left: 1011
                }, 500, 'easeInOutQuint' );
                newBlock.animate( {
                    left: 10
                }, 500, 'easeInOutQuint', function(){
                    self.parent.css( { overflow: 'visible' } );
                    curBlock.css( { left: -10000 } );
                } );
            },
            slideNext: function( curBlock, newBlock ){
                self.parent.css( { overflow: 'hidden' } );

                newBlock.css( {
                    left: 1011
                } );
                curBlock.animate( {
                    left: -1011
                }, 500, 'easeInOutQuint' );
                newBlock.animate( {
                    left: 10
                }, 500, 'easeInOutQuint', function(){
                    self.parent.css( { overflow: 'visible' } );
                    curBlock.css( { left: -10000 } );
                } );
            }
        };
    }
};