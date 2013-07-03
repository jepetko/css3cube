/*
 * css3cube
 * https://github.com/jepetko/css3cube
 *
 * Copyright (c) 2013 katarina
 * Licensed under the MIT license.
 */

(function($) {

  // Collection method.
  $.fn.awesome = function() {
    return this.each(function(i) {
      // Do something awesome to each selected element.
      $(this).html('awesome' + i);
    });
  };

  // Static method.
  $.awesome = function(options) {
    // Override default options with passed-in options.
    options = $.extend({}, $.awesome.options, options);
    // Return something awesome.
    return 'awesome' + options.punctuation;
  };

  // Static method default options.
  $.awesome.options = {
    punctuation: '.'
  };

  // Custom selector.
  $.expr[':'].awesome = function(elem) {
    // Is this element awesome?
    return $(elem).text().indexOf('awesome') !== -1;
  };

}(jQuery));


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

CssUtils.crossBrowserEvtNames = {
    //transition
    'WebkitTransition' : 'webkitTransitionEnd',
    'MozTransition'    : 'transitionend',
    'OTransition'      : 'oTransitionEnd',
    'msTransition'     : 'MSTransitionEnd',
    'transition'       : 'transitionend',
    //animation
    'WebkitAnimation' : 'webkitAnimationEnd',
    'MozAnimation'    : 'animationend',
    'OAnimation'      : 'oAnimationEnd',
    'msAnimation'     : 'MSAnimationEnd',
    'animation'       : 'animationend'
};

/* Cube */
(function ( $ ) {
    $.fn.css3cube = function( options ) {

        $.css3cube = function(options) {
            options = $.extend({}, $.css3cube.options, options);
            return options;
        };
        $.css3cube.options = {
            size: 100,
            left: 200,
            top: 200,
            actions : ['animatex']
        };
        $.css3cube.half = function(val) {
            return Math.round(val/2);
        };

        var settings = $.css3cube(options);
        settings['_hs'] = $.css3cube.half(settings.size);

        var cssCalc = {
            _every : function(stgs) {
                var opts = {};
                var names = ['size', 'top', 'left'];
                $.each( stgs, function(key, val) {
                    if($.inArray(key, names) !== -1) {
                        if( key == 'size') {
                            opts['width'] = opts['height'] = val + 'px';
                        } else {
                            opts[key] = val + 'px';
                        }
                    }
                });
                opts['position'] = 'absolute';
                return opts;
            },
            front : function(stgs) {
                var opts = cssCalc._every(stgs);
                opts['zIndex'] = '100';
                return opts;
            },
            back : function(stgs) {
                var opts = cssCalc._every(stgs);
                opts['transform'] = 'translate(' + stgs._hs + 'px, -' + stgs._hs + 'px)';
                opts['zIndex'] = '-1';
                return opts;
            },
            left : function(stgs) {
                var opts = cssCalc._every(stgs);
                var top = Math.round( stgs.top - stgs.size *.25 );
                opts['top'] = top + 'px';
                opts['width'] = stgs._hs + 'px';
                opts['transform'] = 'skew(0deg,-45deg)';
                return opts;
            },
            right : function(stgs) {
                var opts = cssCalc.left(stgs);
                var left = Math.round( stgs.left + stgs.size );
                opts['left'] = left + 'px';
                return opts;
            },
            top: function(stgs) {
                var opts = cssCalc._every(stgs);
                var left = Math.round( stgs.left + stgs.size * .25 );
                var top = Math.round( stgs.top - stgs.size * .5 );
                opts['top'] = top + 'px';
                opts['left'] = left + 'px';
                opts['height'] = stgs._hs + 'px';
                opts['transform']= 'skew(-45deg,0deg)';
                return opts;
            },
            bottom: function(stgs) {
                var opts = cssCalc.top(stgs);
                var top = Math.round( stgs.top + stgs.size * .5 );
                opts['top'] = top + 'px';
                return opts;
            }
        };

        var actions = {
            animatex : $.proxy( function() {

                var animClass = '.cube-animatex {'
                    + CssUtils.fromCamelToCss( Modernizr.prefixed('animation') )
                    + ': cube-animatex-frame 5s linear 2s infinite; }';
                CssUtils.addRule( animClass );

                var transform = Modernizr.prefixed('transform');
                var transformCss = CssUtils.fromCamelToCss(transform);
                var keyFrame = '@' + CssUtils.getPrefix(transformCss) + 'keyframes';  //issue modernizr

                var anim = keyFrame + ' cube-animatex-frame {' +
                    ' from {' + transformCss + ': rotateY( 0deg ); }' +
                    ' to {' + transformCss + ':rotateY( 360deg ); }' +
                    '}';
                CssUtils.addRule( anim );

                this.addClass('cube-animatex');

            }, this)
        };

        $.each( cssCalc, $.proxy( function(key, val) {
            if( key == '_every' ) return;

            var cssOpts = val(settings);
            var cssName = 'css3cube-' + key;
            var cssStr = '.' + cssName + '{';
            for( var prop in cssOpts ) {
                var cssNameVendorSpec = CssUtils.fromCamelToCss( Modernizr.prefixed(prop) );
                cssStr +=  cssNameVendorSpec + ':' + cssOpts[prop] + ";";
            }
            cssStr += '}';
            CssUtils.addRule(cssStr);
            $(this).append( '<div class="css3cube-el '+ cssName + '"></div>' );
        }, this) );

        $.map(  settings['actions'],
            function(action) {
                actions[action]();
            }
        );

        return this;
    };
}( jQuery ));