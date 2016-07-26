
// create the controller and inject Angular's $scope
jTextMinerApp.controller('JTextMinerController', function ($scope, ExperimentService) {

    // test directives
    $scope.template = {
        name: 'Naomi',
        address: '1600 Amphitheatre'
    };
    $scope.naomi = { name: 'Naomi', address: '1600 Amphitheatre' };
    $scope.igor = { name: 'Igor', address: '123 Somewhere' };
});


