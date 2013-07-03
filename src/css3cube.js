/*
 * css3cube
 * https://github.com/jepetko/css3cube
 *
 * Copyright (c) 2013 katarina
 * Licensed under the MIT license.
 */

/* array last() polyfill */
if( typeof Array.prototype.last !== 'function' ) {
    Array.prototype.last = function() {
        if( this.length === 0 ) {
            return null;
        }
        return this[this.length-1];
    };
}

/* CSS utilities */
function CssUtils() {}
CssUtils.addRule = function(rule) {
    if( document.styleSheets && document.styleSheets.length ) {
        document.styleSheets[0].insertRule( rule, 0 );
    } else {
        var s = document.createElement( 'style' );
        s.innerHTML = rule;
        document.getElementsByTagName( 'head' )[ 0 ].appendChild( s );
    }
};
CssUtils.getPrefix = function(str) {
    var result = /.*\-/g.exec(str);
    if( result && result.length>0 ) {
        return result[0];
    }
    return '';
};
CssUtils.fromCamelToCss = function(str) {
    return str.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); });
};

/* Cube */
(function ( $ ) {
    $.fn.css3cube = function( options ) {

        //////////////////////////////////////////
        /////// configuration

        $.css3cube = function(options) {
            options = $.extend({}, { actions : ['animatex'] }, options);
            return options;
        };

        $.css3cube.actionBehavior = {
            animatex : function(that) {
                var animClass = '.css3cube-animatex {'
                    + CssUtils.fromCamelToCss( Modernizr.prefixed('transform') )
                    + ': translateZ( -100px ) rotateY( 90deg ); }';
                CssUtils.addRule( animClass );

                that.addClass('css3cube-animatex');
            }
        };

        $.css3cube.cssParts = {
            front : function() {
                return { transform : 'translateZ(200px)' };
            },
            back : function() {
                return { transform : 'rotateX( -180deg ) translateZ( 200px )' };
            },
            left : function() {
                return { transform : 'rotateY(  -90deg ) translateZ( 200px )' };
            },
            right : function() {
                return { transform : 'rotateY(   90deg ) translateZ( 200px )' };
            },
            top: function() {
                return { transform : 'rotateX(   90deg ) translateZ( 200px )' };
            },
            bottom: function(stgs) {
                return { transform : 'rotateX(  -90deg ) translateZ( 200px )' };
            }
        }

        //////////////////////////////////////////
        /////// supercontainer tweak

        //-- vendor bullshit
        var perspectiveCssProperty = CssUtils.fromCamelToCss( Modernizr.prefixed('perspective') );
        var perspectiveCssValue = $(this).css(perspectiveCssProperty);
        if( perspectiveCssValue === 'none' ) {
            $(this).css(perspectiveCssProperty, '1000px');
        }

        //////////////////////////////////////////
        /////// container

        $.css3cube.addContainer = function(that) {
            var animClass = '.css3cube-container { \
                width: 100%; \
                height: 100%; \
                position: absolute;';
             animClass += CssUtils.fromCamelToCss( Modernizr.prefixed('transform') ) + '-style : preserve-3d }';
            CssUtils.addRule( animClass );
            return $('<div class="css3cube-container"></div>').appendTo(that);
        }

        $.css3cube.getDefaultAnimationBehaviorClass = function() {
            var className = 'css3cube-container-anim';
            var animClass = '.' + className + ' {'
                + CssUtils.fromCamelToCss( Modernizr.prefixed('transition') )
                + ': 5s; }';
            CssUtils.addRule( animClass );
            return className;
        }

        $.css3cube.addParts = function(that) {
            $.each( $.css3cube.cssParts, function(key, val) {
                var cssOpts = val(settings);
                var cssName = 'css3cube-' + key;
                var cssStr = '.' + cssName + '{';
                for( var prop in cssOpts ) {
                    var cssNameVendorSpec = CssUtils.fromCamelToCss( Modernizr.prefixed(prop) );
                    cssStr +=  cssNameVendorSpec + ':' + cssOpts[prop] + ";";
                }
                cssStr += '}';
                CssUtils.addRule(cssStr);
                that.append( '<div class="css3cube-el '+ cssName + '"></div>' );
            });
        }

        //adding container and the parts
        var container = $.css3cube.addContainer(this).addClass( $.css3cube.getDefaultAnimationBehaviorClass() );
        $.css3cube.addParts(container);

        //execute some animations (consider the settings)
        var settings = $.css3cube(options);
        container.delay(800).queue(function () {
            $.map(settings['actions'],
                function (action) {
                    $.css3cube.actionBehavior[action](container);
                }
            )
        });
        return this;
    };
}( jQuery ));