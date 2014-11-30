(function(angular) {
  'use strict';

  angular.module('angular-templateloader', [])

  .factory('templateLoader', function templateLoaderFactory() {
    function TemplateLoader() {}

    TemplateLoader.prototype.load = function load(options) {
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


    };

    return new TemplateLoader();
  });

})(angular);
