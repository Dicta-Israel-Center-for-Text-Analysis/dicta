jTextMinerApp.component('headerPage',
    {
        templateUrl: 'Components/PageStructure/header.component.html',
        controller: ['$scope', 'ExperimentService', '$location', function ($scope, ExperimentService, $location) {
            $scope.userLogin = ExperimentService.user;
            $scope.isShow = false;

            if (ExperimentService.user == 'user')
                $location.path('Login');
        }]
    }
);