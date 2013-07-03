/*! Css3cube - v0.1.0 - 2013-07-03
* https://github.com/jepetko/css3cube
* Copyright (c) 2013 katarina; Licensed MIT */
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

        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            color: "#556b2f",
            backgroundColor: "white"
        }, options );

        // Greenify the collection based on the settings variable.
        return this.css({
            color: settings.color,
            backgroundColor: settings.backgroundColor
        });

    };
}( jQuery ));

/*
 $(function() {
 (new function() {
 var startDelay = 1000,
 animstartDelay = 1000,
 flappingDegrees = [100,80,70,60,50,40,30,20,10,5,0],
 flappingDelays = [startDelay], //Note: flappingDelays will be filled later
 mainFrom = '180deg', trans = '10px', mainTo = flappingDegrees[0]*(-1);

 this.getPlate = function() {
 return $('.plate');
 }
 this.initVars = function() {
 var transform = Modernizr.prefixed('transform');
 var transformCss = CssUtils.fromCamelToCss(transform);
 var keyFrame = '@' + CssUtils.getPrefix(transformCss) + 'keyframes';  //issue modernizr

 var mainRule = keyFrame + ' animstart {' +
 ' from {' + transformCss + ':rotateX( ' + mainFrom + 'deg ) translate(0px,' + trans + ')}'+
 ' to {' + transformCss + ':rotateX( ' + mainTo + 'deg ) translate(0px,' + trans + ') }'+
 '}';
 CssUtils.addRule(mainRule);

 for(var i=0;i<flappingDegrees.length-1;i++) {
 var f = (i%2===0)?-1:1;
 var from = flappingDegrees[i] * f;
 var to = flappingDegrees[i+1] * f * (-1);
 var rule = keyFrame + ' plate' + i + ' { '+
 ' from {' + transformCss + ':rotateX( ' + from + 'deg ) translate(0px,' + trans + ')}'+
 ' to {' + transformCss + ':rotateX( ' + to + 'deg ) translate(0px,' + trans + ') }'+
 '}';
 CssUtils.addRule(rule);
 flappingDelays.push( Math.round(flappingDelays.last() * .75) );
 }
 }

 this.init = function() {
 this.initVars();
 var evtName = crossBrowserEvtNames[ Modernizr.prefixed('animation') ];
 this.getPlate().bind(evtName, $.proxy( function(evt) {
 var plate = this.getPlate();
 var orig = evt.originalEvent;
 if( orig ) {
 var name = orig.animationName;
 switch(name) {
 case 'animstart':
 plate.css("transform", "rotateX(" + mainTo + ") translate(0px," + trans + ")");
 break;
 default:
 var postfix = parseInt(/\d+$/.exec(name)[0]);
 var f = (postfix%2==0) ? 1 : -1;
 var endValue = flappingDegrees[postfix+1] * f;
 plate.css("transform", "rotateX(" + endValue + "deg) translate(0px," + trans + ")");
 }
 }
 },this));
 }
 this.doRotate = function() {
 var anim = '', animDelay = '';
 var tmpAnim = animstartDelay;
 $.each(flappingDelays, function(idx,val) {
 if( anim!='' ) {
 anim += ', ';
 animDelay += ', ';
 }
 anim += 'plate' + idx + ' ' + val + 'ms';
 animDelay += tmpAnim;
 animDelay += 'ms';
 tmpAnim += val;
 });
 var plate = this.getPlate();
 anim = 'animstart ' + animstartDelay + 'ms,' + anim;
 animDelay = '0ms,' + animDelay;
 var animKeyword = Modernizr.prefixed('animation');
 plate.css( animKeyword, anim);
 plate.css( animKeyword + '-delay', animDelay);
 plate.css( animKeyword + '-timing-function', 'ease-start');
 }
 this.start = function() {
 this.doRotate();
 }
 this.init();
 }).start();
 });*/