// JTextMinerApp.js

//https://github.com/cornflourblue/angu-fixed-header-table
//https://www.pointblankdevelopment.com.au/blog/angularjs-fixed-header-scrollable-table-directive


var jTextMinerApp = angular.module('JTextMinerApp', ['ui.router', 'ngResource', 'anguFixedHeaderTable', 'ui.bootstrap', 'ngDialog', 'ui.tree', 'integralui', 'ivh.treeview', 'treeModule', 'ui.bootstrap.tabs']);//, 'angularCharts']);
// Example of how to set default values for all dialogs
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
jTextMinerApp.config(function (ivhTreeviewOptionsProvider) {
    ivhTreeviewOptionsProvider.set({
        defaultSelectedState: false,
        validate: true
    });
});
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
        controller: 'LoginController',
        templateUrl: 'partials/Pages/partial-Login.html'
    })
    .state('AfterLogin', {
        url: '/AfterLogin',
        controller: 'AfterLoginController',
        templateUrl: 'partials/Pages/partial-AfterLogin.html'
    })
    .state('Experiment', {
        url: '/Experiment',
        controller: 'ExperimentController',
        templateUrl: 'partials/Pages/partial-Experiment.html'
    })
    .state('FirstTab', {
        url: '/FirstTab',
        controller: 'FirstTabController',
        templateUrl: 'partials/Pages/partial-FirstTab.html'
    })
    .state('SecondTab', {
        url: '/SecondTab',
        controller: 'SecondTabController',
        templateUrl: 'partials/Pages/partial-SecondTab.html'
    })
    .state('ThirdTab', {
        url: '/ThirdTab',
        controller: 'ThirdTabController',
        templateUrl: 'partials/Pages/partial-ThirdTab.html'
    })
    .state('TestSet', {
        url: '/TestSet',
        controller: 'TestSetController',
        templateUrl: 'partials/Pages/partial-TestSet.html'
    })
    .state('Segmentation', {
        url: '/Segmentation',
        controller: 'SegmentationController',
        templateUrl: 'partials/Pages/partial-Segmentation.html'
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
        controller: 'TabsController',
        templateUrl: 'partials/Pages/partial-Tabs.html'
    })
    
});
