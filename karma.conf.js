//jshint strict: false
module.exports = function(config) {
  config.set({

    files: [
	  'js/Common/jquery.min.js',
      'js/Common/jquery.cookie.js',
	  'node_modules/angular/angular.min.js',
	  'node_modules/angular-resource/angular-resource.min.js',
	  'node_modules/angular-ui-router/release/angular-ui-router.min.js',
	  'node_modules/angular-mocks/angular-mocks.js',
	  'Controllers/*.js',
      'Controllers/**/*.js',
      'Components/**/*.js',
	  'Services/**/*.js',
	  'js/**/!(jquery)*.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
    ]

  });
};