(function(angular) {
  'use strict';

  angular.module('angular-templateloader', [])

  .factory('templateLoader', function templateLoaderFactory($http, $templateCache, $q, $log) {
    function TemplateLoader() {}


    function _checkOptionsHasCorrectType(options) {
      // Throw if not passed a config object, array or a string
      if(!options) {
        throw new Error('templateLoader expects a string, array or options hash as an input.');
      }
      // Throw if the options object does not have a files property
      if(options.constructor === Object && !options.files) {
        throw new Error('templateLoader expects an options hash to contain a list of files.');
      }
      // Throw if a passed array has no length
      if(options.constructor === Array && options.length === 0) {
        throw new Error('templateLoader expects arrays to contain strings referring to files.');
      }
    }


    function _mergeOptionsIntoDefaults(options) {
      var defaults = {
        files: [],
        async: true
      };

      if(typeof options === 'string') { defaults.files.push(options); }
      if(options.constructor === Array) { defaults.files = options; }
      if(options.constructor === Object) { angular.extend(defaults, options); }

      return defaults;
    }


    function _getSingleTemplate(templateURL) {
      return $http.get(templateURL)
        .success(function(data) {
          $templateCache.put(templateURL, data);
        })
        .error(function(data, status) {
          $log.error('A template failed to load with status: ' + status);
        });
    }


    function _loadSyncTemplates(files, deferred) {
      if(files.length === 0) {
        return deferred.resolve();
      }

      _getSingleTemplate(files.pop())
        .success(function() {
          _loadSyncTemplates(files, deferred);
        });
    }


    TemplateLoader.prototype.load = function load(options) {
      var deferred = $q.defer(),
          loadedTemplates = 0;

      _checkOptionsHasCorrectType(options);

      var options = _mergeOptionsIntoDefaults(options);

      if(options.async) {
        angular.forEach(options.files, function(url) {
          _getSingleTemplate(url)
            .success(function() {
              loadedTemplates++;

              if(loadedTemplates === options.files.length) {
                deferred.resolve();
              }
            })
            .error(function() {
              deferred.reject();
            });
        });

      } else {
        _loadSyncTemplates(options.files.reverse(), deferred);
      }

      return deferred.promise;
    };

    return new TemplateLoader();
  });

})(angular);
