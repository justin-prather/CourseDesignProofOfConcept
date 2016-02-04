/* global describe, it */

(function () {
  'use strict';

  describe('Test Math functions in calculations.js', function () {
    describe('Hypoteneus( 1, 1 )', function () {
      it('should return sqrt( 2 )', function () {
      	expect(hypoteneus(1,1)).to.equal( Math.sqrt(2) );
      });
    });

    describe('Hypoteneus( 0, 1 )', function () {
      it('should return sqrt( 1 )', function () {
      	expect(hypoteneus(0,1)).to.equal( Math.sqrt(1) );
      });
    });

    describe('Hypoteneus( 1, 0 )', function () {
      it('should return sqrt( 1 )', function () {
      	expect(hypoteneus(1,0)).to.equal( Math.sqrt(1) );
      });
    });

    describe('Hypoteneus( -2, 1 )', function () {
      it('should return sqrt( 5 )', function () {
      	expect(hypoteneus(-2,1)).to.equal( Math.sqrt(5) );
      });
    });

    describe('Hypoteneus( 1, -2 )', function () {
      it('should return sqrt( 5 )', function () {
      	expect(hypoteneus(1,-2)).to.equal( Math.sqrt(5) );
      });
    });

  });

  describe('Test the custom stack implementation in stack.js', function() {
    describe( 'Test adding to the stack', function() {
      it('should return undefined', function(){
        var stack = new Stack();
        expect(stack.pop()).to.equal(undefined);
      })

      it('should have length 1 and return 7', function(){
        var stack = new Stack();
        stack.push(7);
        expect(stack.length()).to.equal(1);
        expect(stack.pop()).to.equal(7);
      })

      it('should have length 2', function(){
        var stack = new Stack();
        stack.push(7);
        stack.push(8);
        expect(stack.length()).to.equal(2);
        stack.push(8);
        expect(stack.length()).to.equal(2);
      })

    });

    describe('Test replace first, empty', function(){
      it('should return 12', function(){
        var stack = new Stack();
        stack.push(7);
        stack.replaceFirst(12);
        expect(stack.pop()).to.equal(12);
        expect(stack.length()).to.equal(0);
      })
    })
  });
})();
