var loader;
$( function(){
    loader = new Loader();
    new Popup();
    $( '.tabs' ).each( function(){
        new Tabs( $( this ) );
    } );
    new Statement();
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

var Popup =  function(){
    this.btns = $( '.menu > div' );
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

var Statement = function(){
    this.obj = $( '.statement' );
    this.elems = {
        statementPhotos: this.obj.find( '.statement__photo li' ),
        statementLogo: this.obj.find( '.statement__logo li' ),
        statementNameSocial: this.obj.find( '.statement__name li' ),
        createNext: this.obj.find( '.statement__next' ),
        content: this.obj.find( '> dd' ),
        titles: this.obj.find( '> dt' ),
        donateBack: this.obj.find( '.statement__donate-back' )
    };

    this.init();
};
Statement.prototype = {
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
                elems.statementPhotos.on( {
                    'click': function(){
                        var curItem = $( this );

                        if( !curItem.hasClass( 'active' ) ) {
                            elems.statementPhotos.removeClass( 'active' );
                            curItem.addClass( 'active' );
                        }
                    }
                } );
                elems.statementLogo.on( {
                    'click': function(){
                        var curItem = $( this );

                        if( !curItem.hasClass( 'active' ) ) {
                            elems.statementLogo.removeClass( 'active' );
                            curItem.addClass( 'active' );
                        }
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
                elems.donateBack.on( {
                    'click': function(){
                        var curBlock = elems.content.eq( 1 ),
                            newBlock = elems.content.eq( 0 );

                        self.core.slideBack( curBlock, newBlock );
                        $( '.statement__selected' ).removeClass( 'statement__selected' );
                        elems.titles.eq( 0 ).addClass( 'statement__selected' );
                    }
                } );
            },
            slideBack: function( curBlock, newBlock ){
                newBlock.css( {
                    left: -1011
                } );
                curBlock.animate( {
                    left: 1011
                }, 500, 'easeInOutQuint' );
                newBlock.animate( {
                    left: 10
                }, 500, 'easeInOutQuint' );
            },
            slideNext: function( curBlock, newBlock ){
                newBlock.css( {
                    left: 1011
                } );
                curBlock.animate( {
                    left: -1011
                }, 500, 'easeInOutQuint' );
                newBlock.animate( {
                    left: 10
                }, 500, 'easeInOutQuint' );
            }
        };
    }
};