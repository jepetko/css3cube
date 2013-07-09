/*! Css3cube - v0.1.0 - 2013-07-09
* https://github.com/jepetko/css3cube
* Copyright (c) 2013 katarina; Licensed MIT */
/*global $:false */
/*global Modernizr:false */


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
CssUtils.getRule = function(name, propName) {
    var classes = document.styleSheets[0].rules || document.styleSheets[0].cssRules;

    var propValue = null;
    $.each( classes, function(idx, el) {
        if( el.selectorText !== name ) {
            return;
        }
        propValue = el.style[propName];
    });
    return propValue;
};

CssUtils.getPrefix = function(str) {
    var result = /.*\-/g.exec(str);
    if( result && result.length>0 ) {
        return result[0];
    }
    return '';
};
CssUtils.fromCamelToCss = function(str) {
    if( str.indexOf('-') !== -1 ) {
        return str;
    }
    return str.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); });
};

/* Cube */
(function ( $ ) {
    $.fn.css3cube = function( options ) {

        'use strict';

        //////////////////////////////////////////
        /////// configuration

        /**
         * supported actions are:
         * animatex
         * animatey
         * animatez
         * shake
         * open
         * @param options
         * @returns {*}
         */
        $.css3cube = function(options) {
            if(typeof this.options === 'undefined') {
                this.options = {};
            }
            if(arguments.length === 0) {
                return this.options;
            }
            $.extend(this.options, options);
            if( !options['actions'] && !this.options['actions']) {
                $.extend(this.options, { actions : ['animatez'] });
            }
            return this.options;
        };

        $.css3cube.animDuration = 5000;
        $.css3cube.cssPrefix = 'css3cube';
        $.css3cube.buildClass = function(str,inclDot) {
            var name = $.css3cube.cssPrefix + '-' + str;
            if( inclDot ) {
                name = '.' + name;
            }
            return name;
        };

        $.css3cube.actionBehavior = {
            _removeAll : function(that) {
                var classes = jQuery.map($.css3cube.actionBehavior, function(val, key){
                    if(key.indexOf('_') === 0) {
                        return null;
                    }
                    return $.css3cube.buildClass(key);
                });
                that.removeClass(classes.join(' '));
            },
            _add : function(that, name, cssProps) {
                //to avoid collisions remove all the rules added previously
                $.css3cube.actionBehavior._removeAll(that);

                //add rule
                var animClass = $.css3cube.buildClass(name,true) + ' {';
                var cssItems = '';
                for( var prop in cssProps ) {
                    var cssNameVendorSpec = CssUtils.fromCamelToCss( Modernizr.prefixed(prop) );
                    cssItems +=  cssNameVendorSpec + ':' + cssProps[prop] + ";";
                }
                animClass += cssItems;
                animClass += '}';

                CssUtils.addRule( animClass );
                //add the brand new rule to the cube
                that.addClass($.css3cube.buildClass(name));
            },
            init : function(that) {
                var borderWidth;
                $.each( $.css3cube.cssPartDefTransformations, function(key, val) {
                    var part = $('<div class="' + $.css3cube.buildClass('el') + '"></div>').appendTo(that);
                    if( typeof borderWidth === 'undefined' ) {
                        borderWidth = parseInt(part.css('border-left-width'),10);
                        $.css3cube( {borderWidth : borderWidth});
                    }
                    $.css3cube.actionBehavior._add( part, key, val( $.css3cube() ) );
                });
            },
            animatex : function(that) {
                that.addClass( $.css3cube.buildClass('container-anim') );
                $.css3cube.actionBehavior._add(that, 'animatex', { transform : 'rotateX(180deg)' } );
            },
            animatey : function(that) {
                that.addClass( $.css3cube.buildClass('container-anim') );
                $.css3cube.actionBehavior._add(that, 'animatey', { transform : 'rotateY(180deg)' } );
            },
            animatez : function(that) {
                that.addClass( $.css3cube.buildClass('container-anim') );
                $.css3cube.actionBehavior._add(that, 'animatez', { transform : 'rotateZ(90deg)' } );
            },
            shake : function(that) {
                that.removeClass( $.css3cube.buildClass('container-anim') );

                var transform = Modernizr.prefixed('transform');
                var transformCss = CssUtils.fromCamelToCss(transform);
                var keyFrame = '@' + CssUtils.getPrefix(transformCss) + 'keyframes';  //issue modernizr

                var frameRule = keyFrame;
                frameRule += ' animshake { '+
                     '0%   {' + transformCss + ': rotateY(10deg) rotateX(-10deg)} ' +
                     '5%  {' + transformCss + ':   rotateY(-10deg) rotateX(10deg)} ' +
                     '10%  {' + transformCss + ':  rotateY(9deg) rotateX(-9deg)} ' +
                     '15%  {' + transformCss + ':  rotateY(-9deg) rotateX(9deg)} ' +
                     '20% {' + transformCss + ': rotateY(8deg) rotateX(-8deg)} ' +
                     '25%   {' + transformCss + ':  rotateY(-8deg) rotateX(8deg)} ' +
                     '30%  {' + transformCss + ': rotateY(7deg) rotateX(-7deg)} ' +
                     '35%  {' + transformCss + ':  rotateY(-7deg) rotateX(7deg)} ' +
                     '40%  {' + transformCss + ':  rotateY(6deg) rotateX(-6deg)} ' +
                     '45% {' + transformCss + ':  rotateY(-6deg) rotateX(6deg)} ' +
                     '50%   {' + transformCss + ':  rotateY(5deg) rotateX(-5deg)} ' +
                     '55%  {' + transformCss + ':  rotateY(-5deg) rotateX(5deg)} ' +
                     '60%  {' + transformCss + ':  rotateY(4deg) rotateX(-4deg)} ' +
                     '65%  {' + transformCss + ':  rotateY(-4deg) rotateX(4deg)} ' +
                     '70% {' + transformCss + ':  rotateY(3deg) rotateX(-3deg)} ' +
                     '75%   {' + transformCss + ':  rotateY(-3deg) rotateX(3deg)} ' +
                     '80%  {' + transformCss + ':  rotateY(2deg) rotateX(-2deg)} ' +
                     '85%  {' + transformCss + ':  rotateY(-2deg) rotateX(2deg)} ' +
                     '90%  {' + transformCss + ':  rotateY(1deg) rotateX(-1deg)} ' +
                     '95% {' + transformCss + ':  rotateY(-1deg) rotateX(1deg)} ' +
                     '100% {' + transformCss + ':  rotateY(0deg) rotateX(0deg)} ' +
                     '}';

                CssUtils.addRule(frameRule);
                $.css3cube.actionBehavior._add( that, 'shake',
                                                { animation : 'animshake ' + $.css3cube.animDuration + 'ms'} );
            },
            open : function(that) {
                that.addClass( $.css3cube.buildClass('container-anim') );
                $.each( $.css3cube.cssPartsOpenTransformations, function(key, val) {

                    var ch = that.children( $.css3cube.buildClass(key,true) ).first();

                    var openVal = val($.css3cube());
                    if( !openVal ) {
                        return;
                    }
                    $.css3cube.actionBehavior._add( ch, key + '-open', openVal );
                    ch.removeClass( $.css3cube.buildClass(key) );
                    ch.addClass( $.css3cube.buildClass('container-anim') );
                });
            }
        };

        $.css3cube.cssPartDefTransformations = {
            front : function(opts) {
                return { transform : 'translateZ(' + opts.sizeHalf + 'px)' };
            },
            back : function(opts) {
                return { transform : 'rotateX( -180deg ) translateZ( ' + opts.sizeHalf + 'px )' };
            },
            left : function(opts) {
                return { transform : 'rotateY(  -90deg ) translateZ( ' + opts.sizeHalf + 'px )' };
            },
            right : function(opts) {
                return { transform : 'rotateY(   90deg ) translateZ( ' + opts.sizeHalf + 'px )' };
            },
            top: function(opts) {
                return { transform : 'rotateX(   90deg ) translateZ( ' + opts.sizeHalf + 'px )' };
            },
            bottom: function(opts) {
                return { transform : 'rotateX(  -90deg ) translateZ( ' + opts.sizeHalf + 'px )' };
            }
        };

        /* add open values */
        $.css3cube.cssPartsOpenTransformations = {
            front : function(opts) {
                return { transform : 'rotateX(270deg)  translateY(-' + opts.sizeHalf + 'px)', transformOrigin : 'bottom' };
            },
            back : function(opts) {
                return { transform : 'rotateX(-90deg)  translateY(' + (opts.size * 1.5 + 2*opts.borderWidth) + 'px)', transformOrigin : 'bottom' };
            },
            left : function(opts) {
                return { transform : 'rotateY(-90deg)  rotateX(-90deg) translateY(-' + opts.sizeHalf + 'px)', transformOrigin : 'bottom' };
            },
            right : function(opts) {
                return { transform : 'rotateY(90deg)  rotateX(-90deg) translateY(-' + opts.sizeHalf + 'px)', transformOrigin : '50% 100%' };
            },
            top: function(opts) {
                return { transform : 'rotateY(0deg) rotateX(90deg) translateX(' + (opts.size+opts.borderWidth) + 'px) translateY(' + opts.sizeHalf + 'px)', transformOrigin : '100% 100%' };
            },
            bottom: function(opts) {
                return { transform : 'rotateX(  -90deg ) translateZ( ' + (opts.sizeHalf+opts.borderWidth) + 'px )' };
            }
        };

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
            var animClass = $.css3cube.buildClass('container',true);
            animClass += '{ width: 100%; height: 100%; position: absolute;';
            animClass += CssUtils.fromCamelToCss( Modernizr.prefixed('transformStyle') ) + ': preserve-3d;';
            animClass += CssUtils.fromCamelToCss( Modernizr.prefixed('backfaceVisibility') ) + ': hidden;';
            animClass += '}';
            CssUtils.addRule( animClass );
            var container = $('<div class="' + $.css3cube.buildClass('container') + '"></div>').appendTo(that);

            var handlers = $.css3cube()['handlers'];
            $.map( handlers, function(handler,idx) {
                if($.isFunction(handler) ) {
                    container.on(idx, handler);
                }
            });

            return container;
        };

        $.css3cube.addContent = function(that) {
            var contentClass = $.css3cube.buildClass('content');
            return $('<div class="' + contentClass + '"></div>').appendTo(that);
        };

        $.css3cube.startAnimations = function(that) {
            //execute some animations (consider the settings)
            that.delay(1000);

            var delay = 0;
            $.map(settings['actions'],
                $.proxy( function (action) {
                    setTimeout( $.proxy(function() {
                        this.queue($.proxy(function() {
                            if(!$.isArray(action) ) {
                                action =[action];
                            }
                            for(var i=0; i<action.length; i++) {
                                var a = action[i];
                                if( typeof a !== 'string' ) {
                                    that.addClass( $.css3cube.buildClass('container-anim') );
                                    $.css3cube.actionBehavior._add(this, 'custom-anim-' + new Date().getTime(), a);
                                } else {
                                    $.css3cube.actionBehavior[a](this);
                                }
                            }
                        }, this));
                        this.dequeue();
                    }, this), delay);
                    delay += $.css3cube.animDuration;
                }, that )
            );
        };

        $.css3cube.getDefaultAnimationBehaviorClass = function() {
            var className = $.css3cube.buildClass('container-anim');
            var animClass = '.' + className + ' {' +
                CssUtils.fromCamelToCss( Modernizr.prefixed('transition') ) +
                ': ' + $.css3cube.animDuration + 'ms; }';
            CssUtils.addRule( animClass );
            return className;
        };

        var settings = $.css3cube(options);
        var width = parseInt( CssUtils.getRule( $.css3cube.buildClass('el',true), 'width'), 10 );
        $.css3cube( { size : width, sizeHalf : Math.round(width/2) });

        //adding container and the parts
        var container = $.css3cube.addContainer(this).addClass( $.css3cube.getDefaultAnimationBehaviorClass() );
        $.css3cube.actionBehavior.init(container);
        $.css3cube.addContent(container);
        $.css3cube.startAnimations(container);

        return this;
    };
}( jQuery ));