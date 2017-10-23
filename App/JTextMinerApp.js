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
        component: 'loginPage'
    })
    .state('continueLogin', {
        url: '/ContinueLogin',
        component: 'continueLogin'
    })
    .state('AfterLogin', {
        url: '/AfterLogin',
        component: 'afterLoginPage'
    })
    .state('bibleFrontpage', {
        url: '/BibleFrontpage',
        component: 'bibleFrontPage'
    })
    .state('search', {
        url: '/search',
        component: 'search'
    })
    .state('search.terms', {
        url: '/{terms}/{page}?tanachOrder&allResults',
        component: 'search',
        params: {
            tanachOrder: {
                dynamic: true,
                type: 'bool',
                value: true,
                squash: true
            },
            allResults: {
                dynamic: true,
                type: 'bool',
                value: false,
                squash: true
            },
            page: {
                dynamic: true,
                value: '1'
            }
        }
    })
    .state('searchStart', {
        url: '/searchStart',
        component: 'searchFrontPage'
    })
    .state('bibleInterface', {
        url: '/BibleInterface',
        component: 'bibleMainPage'
    })
    .state('bibleInterface.view', {
        url: '/View',
        views: {
            main: { component: 'viewSelectedText' }
        }
    })
    .state('bibleInterface.information', {
        url: '/Information',
        views: {
            // selectControls: { component: 'bibleViewSelectedText' },
            main: { component: 'bibleViewSelectedText' }

        }
    })
    .state('bibleInterface.classify', {
            url: '/Classify',
            views: {
                classifyControls: { component: 'classificationControls' },
                main: {component: 'classification'}
            }
    })
    .state('bibleInterface.segment', {
        url: '/Segment',
        views: {
            segmentControls: { component: 'segmentationControls' },
            main: {component: 'segmentation'}
        }
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