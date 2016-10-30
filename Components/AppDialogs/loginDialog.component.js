jTextMinerApp.component('loginDialog',
{
    templateUrl: 'Components/AppDialogs/loginDialog.component.html',
    bindings: { onConfirm: '&' },
    controller: function ($scope, ExperimentService, $location, APIService, focus, AlertsService, InProgressService) {
        var ctrl = this;
        $scope.userLogin = '';
        $scope.Login = function () {

            if ($scope.userLogin.length == 0) {
                AlertsService.determineAlert({ msg: 'Please insert your user name', type: 'danger' });
                //focus('focusMe');
            }
            else {
                $scope.data = {};
                $scope.data.userLogin = $scope.userLogin;
                APIService.apiRun({ crud: 'CheckUserLogin' }, $scope.data, function (response) {
                    if (response.userLogin.length != 0) {
                        $.cookie('userLogin', $scope.userLogin);
                        AlertsService.determineAlert({ msg: 'Login success! Hi ' + $scope.userLogin + ', please choose one of the experiments below and click on "Next"', type: 'success' });
                        ExperimentService.updateUser($scope.userLogin);
                        ctrl.onConfirm();
                        //$location.path('Experiment');
                    }
                    else {
                        AlertsService.determineAlert({ msg: 'You are not allowed to login!', type: 'danger' });
                        //$scope.data2 = response;
                    }

                });

            }
        };
    }
});