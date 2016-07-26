// create the controller and inject Angular's $scope
jTextMinerApp.controller('DlgLoginController', function ($scope, ExperimentService, $location, APIService, focus, AlertsService, InProgressService) {
    $scope.userLogin = '';
    $scope.Login = function () {

        if ($scope.userLogin.length == 0) {
            AlertsService.determineAlert({ msg: 'Please insert your user name', type: 'danger' });
            focus('focusMe');
        }
        else {
            $scope.data = {};
            $scope.data.userLogin = $scope.userLogin;
            APIService.apiRun({ crud: 'CheckUserLogin' }, $scope.data, function (response) {
                if (response.userLogin.length != 0) {

                    AlertsService.determineAlert({ msg: 'Login success! Hi ' + $scope.userLogin + ', please choose one of the experiments below and click on "Next"', type: 'success' });
                    ExperimentService.updateUser($scope.userLogin);
                    $scope.confirm();
                    //$location.path('Experiment');
                }
                else {
                    AlertsService.determineAlert({ msg: 'You are not allowed to login!', type: 'danger' });
                    //$scope.data2 = response;
                }

            });

        }
    };

    focus('focusMe');
});