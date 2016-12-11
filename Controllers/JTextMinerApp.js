// JTextMinerApp.js

//https://github.com/cornflourblue/angu-fixed-header-table
//https://www.pointblankdevelopment.com.au/blog/angularjs-fixed-header-scrollable-table-directive


var jTextMinerApp = angular.module('JTextMinerApp', ['ui.router', 'ngResource', 'anguFixedHeaderTable', 'ui.bootstrap', 'ngDialog', 'ui.bootstrap.tabs', 'ui.indeterminate']);//, 'angularCharts']);
// set default values for all dialogs
jTextMinerApp.config(['ngDialogProvider', function (ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-default',
        plain: false,
        showClose: false,
        closeByDocument: true,
        closeByEscape: false,
        appendTo: false,
        preCloseCallback: function () {
            console.log('default pre-close callback');
        }
    });
}]);

jTextMinerApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/Login');

    $stateProvider
    .state('Bible', {
        url: '/Bible',
        controller: 'BibleController',
        templateUrl: 'partials/Pages/partial-Bible.html'
    })
    .state('Login', {
        url: '/Login',
        template: '<login-page></login-page>'
    })
    .state('AfterLogin', {
        url: '/AfterLogin',
        template: '<after-login-page></after-login-page>'
    })
    .state('TestSet', {
        url: '/TestSet',
        controller: 'TestSetController',
        templateUrl: 'partials/Pages/partial-TestSet.html'
    })
    .state('Unmasking', {
        url: '/Unmasking',
        controller: 'UnmaskingController',
        templateUrl: 'partials/Pages/partial-Unmasking.html'
    })
    .state('ResultsSegmentation', {
        url: '/ResultsSegmentation',
        controller: 'ResultsSegmentationController',
        templateUrl: 'partials/Pages/partial-ResultsSegmentation.html'
    })
    .state('ResultsClassificationCrossValidation', {
        url: '/ResultsClassificationCrossValidation',
        controller: 'ResultsClassificationCrossValidationController',
        templateUrl: 'partials/Pages/partial-ResultsClassificationCrossValidation.html'
    })
    .state('ResultsClassificationTestSet', {
        url: '/ResultsClassificationTestSet',
        controller: 'ResultsClassificationTestSetController',
        templateUrl: 'partials/Pages/partial-ResultsClassificationTestSet.html'
    })
    .state('Tabs', {
        url: '/Tabs',
        template: '<tabs></tabs>'
    })
    
});