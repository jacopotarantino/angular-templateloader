'use strict';

describe('angular-templateloader', function() {
  it('should expose a module via angular', function() {
    var module = angular.module('angular-templateloader');

    expect(module).toBeDefined();
    expect(module.name).toBe('angular-templateloader');
  });


  describe('factory: templateLoader', function() {
    var templateLoader,
        $httpBackend;

    beforeEach(module('angular-templateloader'));

    beforeEach(inject(function(_templateLoader_, $injector) {
      $httpBackend = $injector.get('$httpBackend');
      templateLoader = _templateLoader_;
    }));


    it('should expose the templateLoader method', function() {
      expect(templateLoader).toBeDefined();
      expect(templateLoader.load).toBeDefined();
    });


    describe('when invoked with bad arguments', function() {
      it('should throw an error', function() {
        expect(function() {
          templateLoader.load()
        }).toThrow(new Error('templateLoader expects a string, array or options hash as an input.'));

        expect(function() {
          templateLoader.load('')
        }).toThrow(new Error('templateLoader expects a string, array or options hash as an input.'));

        expect(function() {
          templateLoader.load({foo: 'bar'})
        }).toThrow(new Error('templateLoader expects an options hash to contain a list of files.'));

        expect(function() {
          templateLoader.load([])
        }).toThrow(new Error('templateLoader expects arrays to contain strings referring to files.'));

        expect(function() {
          templateLoader.load('/templates/main.html')
        }).not.toThrow();

      });
    });


    describe('when invoked with a string', function() {
      var $templateCache,
          templateURL = 'http://mywebsite.com/templates/main.html',
          templateContents = '<p>hello world.</p>';

      beforeEach(inject(function($injector) {
        $httpBackend.when('GET', templateURL).respond(templateContents);

        $templateCache = $injector.get('$templateCache');
      }));

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });


      it('should request a file from the specified URL', function() {
        $httpBackend.expectGET(templateURL);

        templateLoader.load(templateURL);

        $httpBackend.flush();
      });

      it('should push that file onto $templateCache', function() {
        $httpBackend.expectGET(templateURL);

        templateLoader.load(templateURL);

        $httpBackend.flush();

        expect($templateCache.get(templateURL)).toBe(templateContents);
      });
    });


    describe('when invoked with an array', function() {
      var $templateCache,
          templateContents = '<p>hello world.</p>',
          templates = [
            '/templates/main.html',
            '/templates/sidebar.html',
            '/templates/partials/favorite-button.html'
          ];

      beforeEach(inject(function($injector) {
        $httpBackend.when('GET', '/templates/main.html').respond(templateContents);
        $httpBackend.when('GET', '/templates/sidebar.html').respond(templateContents);
        $httpBackend.when('GET', '/templates/partials/favorite-button.html').respond(templateContents);

        $templateCache = $injector.get('$templateCache');
      }));

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should return a promise that resolves when all templates have loaded', function() {
        var loadingPromise = templateLoader.load(templates);

        expect($templateCache.get('/templates/main.html')).not.toBeDefined();
        expect($templateCache.get('/templates/sidebar.html')).not.toBeDefined();
        expect($templateCache.get('/templates/partials/favorite-button.html')).not.toBeDefined();

        $httpBackend.flush();

        expect($templateCache.get('/templates/main.html')).toBeDefined();
        expect($templateCache.get('/templates/sidebar.html')).toBeDefined();
        expect($templateCache.get('/templates/partials/favorite-button.html')).toBeDefined();

        expect(loadingPromise.$$state.status).toBe(1);
      });
    });


    describe('when invoked with a full config object', function() {
      var $templateCache,
          templateContents = '<p>hello world.</p>',
          templates = [
            '/templates/main.html',
            '/templates/sidebar.html',
            '/templates/partials/favorite-button.html'
          ],
          options = {
            foo: 'bar',
            files: templates
          };

      beforeEach(inject(function($injector) {
        $httpBackend.when('GET', '/templates/main.html').respond(templateContents);
        $httpBackend.when('GET', '/templates/sidebar.html').respond(templateContents);
        $httpBackend.when('GET', '/templates/partials/favorite-button.html').respond(templateContents);

        $templateCache = $injector.get('$templateCache');
      }));

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should merge the options with the defaults and load templates', function() {
        templateLoader.load(options);

        expect($templateCache.get('/templates/main.html')).not.toBeDefined();

        $httpBackend.flush();

        expect($templateCache.get('/templates/main.html')).toBeDefined();
      });
    });


    describe('when loading a template fails due to a 400 status', function() {
      var $templateCache,
          $log;

      beforeEach(inject(function($injector) {
        $httpBackend.when('GET', '/templates/main.html').respond(404);

        $log = $injector.get('$log');
        $templateCache = $injector.get('$templateCache');

        spyOn($log, 'error');
      }));

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should log the error', function() {
        var promise = templateLoader.load('/templates/main.html');

        $httpBackend.flush();

        expect($log.error).toHaveBeenCalledWith('A template failed to load with status: 404');
        expect($templateCache.get('/templates/main.html')).not.toBeDefined();
      });

      it('should reject the promise', function() {
        var promise = templateLoader.load('/templates/main.html');

        $httpBackend.flush();

        expect(promise.$$state.status).toBe(2);
      });
    });


    describe('when loading a template fails due to a 500 status', function() {
      var $templateCache,
          $log;

      beforeEach(inject(function($injector) {
        $httpBackend.when('GET', '/templates/main.html').respond(500);

        $log = $injector.get('$log');
        $templateCache = $injector.get('$templateCache');

        spyOn($log, 'error');
      }));

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should log the error', function() {
        var promise = templateLoader.load('/templates/main.html');

        $httpBackend.flush();

        expect($log.error).toHaveBeenCalledWith('A template failed to load with status: 500');
        expect($templateCache.get('/templates/main.html')).not.toBeDefined();
      });

      it('should reject the promise', function() {
        var promise = templateLoader.load('/templates/main.html');

        $httpBackend.flush();

        expect(promise.$$state.status).toBe(2);
      });
    });


    describe('the async option', function() {
      describe('when the "async" option is true', function() {
        var $templateCache,
          templateContents = '<p>hello world.</p>',
          templates = [
            '/templates/main.html',
            '/templates/sidebar.html',
            '/templates/partials/favorite-button.html'
          ],
          options = {
            async: true,
            files: templates
          };

        beforeEach(inject(function($injector) {
          $httpBackend.when('GET', '/templates/main.html').respond(templateContents);
          $httpBackend.when('GET', '/templates/sidebar.html').respond(templateContents);
          $httpBackend.when('GET', '/templates/partials/favorite-button.html').respond(templateContents);

          $templateCache = $injector.get('$templateCache');
        }));

        afterEach(function() {
          $httpBackend.verifyNoOutstandingExpectation();
          $httpBackend.verifyNoOutstandingRequest();
        });

        it('should try to load more than one file at once', function() {
          templateLoader.load(options);

          expect($templateCache.get('/templates/main.html')).not.toBeDefined();
          expect($templateCache.get('/templates/sidebar.html')).not.toBeDefined();
          expect($templateCache.get('/templates/partials/favorite-button.html')).not.toBeDefined();

          $httpBackend.flush(3);

          expect($templateCache.get('/templates/main.html')).toBeDefined();
          expect($templateCache.get('/templates/sidebar.html')).toBeDefined();
          expect($templateCache.get('/templates/partials/favorite-button.html')).toBeDefined();
        });
      });


      describe('when the "async" option is false', function() {
        var $templateCache,
            templateContents = '<p>hello world.</p>',
            templates = [
              '/templates/main.html',
              '/templates/sidebar.html',
              '/templates/partials/favorite-button.html'
            ],
            options = {
              async: false,
              files: templates
            };

        beforeEach(inject(function($injector) {
          $httpBackend.when('GET', '/templates/main.html').respond(templateContents);
          $httpBackend.when('GET', '/templates/sidebar.html').respond(templateContents);
          $httpBackend.when('GET', '/templates/partials/favorite-button.html').respond(templateContents);

          $templateCache = $injector.get('$templateCache');
        }));

        afterEach(function() {
          $httpBackend.verifyNoOutstandingExpectation();
          $httpBackend.verifyNoOutstandingRequest();
        });

        it('should wait to load a second file until after the first has finished', function() {
          templateLoader.load(options);

          expect($templateCache.get('/templates/main.html')).not.toBeDefined();
          expect($templateCache.get('/templates/sidebar.html')).not.toBeDefined();
          expect($templateCache.get('/templates/partials/favorite-button.html')).not.toBeDefined();

          $httpBackend.flush(1);

          expect($templateCache.get('/templates/main.html')).toBeDefined();
          expect($templateCache.get('/templates/sidebar.html')).not.toBeDefined();
          expect($templateCache.get('/templates/partials/favorite-button.html')).not.toBeDefined();

          $httpBackend.flush(1);

          expect($templateCache.get('/templates/main.html')).toBeDefined();
          expect($templateCache.get('/templates/sidebar.html')).toBeDefined();
          expect($templateCache.get('/templates/partials/favorite-button.html')).not.toBeDefined();

          $httpBackend.flush(1);

          expect($templateCache.get('/templates/main.html')).toBeDefined();
          expect($templateCache.get('/templates/sidebar.html')).toBeDefined();
          expect($templateCache.get('/templates/partials/favorite-button.html')).toBeDefined();
        });
      });
    });


    // it('should accept a hash for naming templates', function() {
    //   describe('when a hash is passed', function() {
    //     it('should cache a file with a custom name', function() {
    //       /** @todo complete me */
    //     });
    //   });
    // });
  });
});
