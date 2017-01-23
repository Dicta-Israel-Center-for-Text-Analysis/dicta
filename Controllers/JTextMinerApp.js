//https://github.com/cornflourblue/angu-fixed-header-table
//https://www.pointblankdevelopment.com.au/blog/angularjs-fixed-header-scrollable-table-directive
var jTextMinerApp = angular.module('JTextMinerApp', ['ui.router', 'ngResource', 'anguFixedHeaderTable', 'ui.bootstrap', 'ngDialog', 'ui.bootstrap.tabs', 'ui.indeterminate', 'ngSanitize']);
// set default values for all dialogs
jTextMinerApp.config(['ngDialogProvider', function (ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-default',
        plain: false,
        showClose: false,
        closeByDocument: true,
        closeByEscape: true,
        appendTo: false
    });
}]);

jTextMinerApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/Login');

    $stateProvider
    .state('Login', {
        url: '/Login',
        template: '<login-page></login-page>'
    })
    .state('AfterLogin', {
        url: '/AfterLogin',
        template: '<after-login-page></after-login-page>'
    })
    .state('Unmasking', {
        url: '/Unmasking',
        controller: 'UnmaskingController',
        templateUrl: 'partials/Pages/partial-Unmasking.html'
    })
    .state('Tabs', {
        url: '/Tabs',
        template: '<tabs></tabs>'
    })
    
});