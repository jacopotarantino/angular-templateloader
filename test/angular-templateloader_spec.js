describe('angular-templateloader', function() {
  it('should expose a module via angular', function() {
    var module = angular.module('angular-templateloader');

    expect(module).toBe(jasmine.objectContaining({
      name: 'angular-templateloader'
    }));
  });


  describe('#templateLoader', function() {
    it('should not interfere with normal template loading', function() {
      /** @todo complete me */
    });


    it('should accept a string or an array as an input', function() {
      describe('when the files option is an array', function() {
        it('should load multiple files', function() {
          /** @todo complete me */
        });
      });

      describe('when the files option is a string', function() {
        it('should just load one file', function() {
          /** @todo complete me */
        });
      });
    });


    it('should try to load a file again if loading fails', function() {
      /** @todo complete me */
    });


    it('should load a group of files synchronously or asynchronously', function() {
      describe('when the "async" option is true', function() {
        it('should try to load more than one file at once', function() {
          /** @todo complete me */
        });
      });

      describe('when the "async" option is false', function() {
        it('should wait to load a second file until after the first has finished', function() {
          /** @todo complete me */
        });
      });
    });


    it('should accept a hash for naming templates', function() {
      describe('when a hash is passed', function() {
        it('should cache a file with a custom name', function() {
          /** @todo complete me */
        });
      });
    });
  });
});
