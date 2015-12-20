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
})();
