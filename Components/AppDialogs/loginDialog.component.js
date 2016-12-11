jTextMinerApp.component('loginDialog',
{
    templateUrl: 'Components/AppDialogs/loginDialog.component.html',
    bindings: {
        onConfirm: '&',
        onCancel: '&'
    },
    controller: function ($scope, ExperimentService, $location, APIService, focus, AlertsService, InProgressService) {
        var ctrl = this;
        $scope.userLogin = '';
        $scope.onError = false;
        $scope.Login = function () {

            if ($scope.userLogin.length == 0) {
                AlertsService.determineAlert({ msg: 'Please insert your user name', type: 'danger' });
            }
            else {
                $scope.onError = false;
                $scope.data = {};
                $scope.data.userLogin = $scope.userLogin;
                APIService.apiRun({ crud: 'CheckUserLogin' }, $scope.data, function (response) {
                    if (response.userLogin.length != 0) {
                        $.cookie('userLogin', $scope.userLogin);
                        AlertsService.determineAlert({
                                msg: 'Login success! Hi '
                                + $scope.userLogin
                                + ', please choose one of the experiments below and click on "Next"',
                                type: 'success'
                            });
                        ExperimentService.updateUser($scope.userLogin);
                        ctrl.onConfirm();
                    }
                    else {
                        $scope.onError = true;
                        AlertsService.determineAlert({ msg: 'You are not allowed to login!', type: 'danger' });
                    }

                });

            }
        };
    }
});