jTextMinerApp.directive('headerPage', function () {
    return {
        restrict: 'AE',
        templateUrl: 'partials/templates/HeaderTemplate.html',
        controller: ['$scope', 'ExperimentService', '$location', function ($scope, ExperimentService, $location) {
            $scope.userLogin = ExperimentService.user;
            $scope.isShow = false;

            if (ExperimentService.user == 'user')
                $location.path('Login');
        }]
    };
});