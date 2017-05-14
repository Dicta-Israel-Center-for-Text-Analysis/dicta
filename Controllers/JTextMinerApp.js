//https://github.com/cornflourblue/angu-fixed-header-table
//https://www.pointblankdevelopment.com.au/blog/angularjs-fixed-header-scrollable-table-directive
var jTextMinerApp = angular.module('JTextMinerApp', ['ui.router', 'ngResource', 'anguFixedHeaderTable', 'ui.bootstrap', 'ngDialog', 'ui.bootstrap.tabs', 'ui.indeterminate', 'ngSanitize', 'angucomplete-alt', 'ui.bootstrap.contextMenu']);
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
    .state('bibleInterface', {
        url: '/BibleInterface',
        template: '<bible-main-page></bible-main-page>'
    })
    // these states aren't in use yet, because switching states would lose the state of the controls that aren't shown
    // the sticky-states plugin to ui-router can resolve this, although it's not clear whether it is stable yet
    // .state('bibleInterface.search', {
    //     url: '/BibleInterface/Search/*query',
    //     template: '<bible-main-page></bible-main-page>'
    // })
    // .state('bibleInterface.select', {
    //     url: '/BibleInterface/Select',
    //     template: '<bible-main-page></bible-main-page>'
    // })
    // .state('bibleInterface.classify', {
    //         url: '/BibleInterface/Classify',
    //         template: '<bible-main-page></bible-main-page>'
    // })
    // .state('bibleInterface.segment', {
    //     url: '/BibleInterface/Segment',
    //     template: '<bible-main-page></bible-main-page>'
    // })
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