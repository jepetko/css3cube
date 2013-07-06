require.config({
    baseUrl : 'src',
    paths: {
        jquery: 'build/jquery.js',
        modernizr: 'build/modernizr-custom.js'
    }
});

// Start the main app logic.
requirejs(['jquery', 'modernizr'],
    function   ($,m) {
        //jQuery, canvas and the app/sub module are all
        //loaded and can be used here now.
        console.log('requirejs works!');
    });