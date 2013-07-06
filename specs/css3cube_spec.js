describe('css3cube', function() {

    function createSuperContainer() {
        return $('<div id="supercontainer"></div>').appendTo($('body'));
    }

    var sc = createSuperContainer();

    describe("should be initialized properly", function() {

        //add the jquery plugin
        sc.css3cube( { actions : ['animatez'] } );
        var c = sc.children('.css3cube-container');

        it('should create a container', function() {
            expect( sc.length ).toBe(1);
            expect( sc.children().length).toBe(1);
            expect( c ).not.toBeNull();
            expect( c ).not.toBeUndefined();
            expect( c.length ).toBe(1);
        });
        it('should have 6 children', function() {
            expect( c.children('.css3cube-el').length).toBe(6);
        });

        it('should have a content box', function() {
            expect( c.children('.css3cube-content').length ).toBe(1);
        });
    })
});