# Angular Templateloader

Angular Templateloader is an Angular.js module for preloading and cacheing templates before they're needed by the application.

[![Code Climate](https://codeclimate.com/github/jacopotarantino/angular-templateloader/badges/gpa.svg)](https://codeclimate.com/github/jacopotarantino/angular-templateloader)

[![Test Coverage](https://codeclimate.com/github/jacopotarantino/angular-templateloader/badges/coverage.svg)](https://codeclimate.com/github/jacopotarantino/angular-templateloader)

## Description

One of the slowest parts of the UI when navigating an Angular app is waiting for the browser to download the template for the next view before it can be rendered. This module allows you to download and cache a list of templates in the browser before they're needed so transitions between views/states are completely seamless.


## Configuration

### `files`:

The module is very flexible in how it lets you configure which templates to load. Below is an example usage just triggering the templateloader in a run block which includes the default `async` option as well as an array of templates to load:

```javascript
angular
.module('myApp', 'angular-templateloader')
.run(['templateLoader', function(templateLoader) {
  templateLoader.load({
    async: true,
    files: [
      '/partials/header.html',
      '/partials/page2.html',
      'http://othersite.com/freetemplates/foo.html'
    ]
  });
}]);
```

You may also pass in a hash of named templates if you wish to retrieve them by name later:

```javscript
templateLoader.load({
  files: {
    header: '/partials/header.html',
    page2: '/partials/page2.html',
    externalResource: 'http://othersite.com/freetemplates/foo.html'
  }
});
```

And as a shortcut method, you can pass a string with a single template or an array of multiple templates straight to the `#load` method:

```javscript
templateLoader.load('/partials/page2.html');
```

```javscript
templateLoader.load([
  '/partials/header.html',
  '/partials/page2.html',
  'http://othersite.com/freetemplates/foo.html'
]);
```

### `async`:

The `async` option is true by default and tells the loader whether to load the templates all at once or load them one at a time to keep the network load low.


## Development

You'll need the following for development:

* node
* npm
* bower
* grunt
* PhantomJS

Add your tests to test/angular-templateloader_spec.js, make your changes and run `grunt` to make sure all the tests pass. Then commit your changes and make a pull request. Make certain that the tests pass properly and that you update any relevant documentation.


## Testing

Simply run `grunt` from the command line. The default actions run jshint and karma in addition to generating the minified version of the script.


## License

This project is released under a Creative Commons Attribution-ShareAlike license. This requires that you both credit the original author and open source your own project. Long live open source software!


## TODO

* Add jsdoc docs to code
