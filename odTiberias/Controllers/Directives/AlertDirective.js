jTextMinerApp.directive('alerts', function () {
    return {
        restrict: 'AE',
        scope: {
            showAddButton: '=showAddButton'
        },
        templateUrl: 'partials/templates/AlertTemplate.html',
        controller: ['$scope', 'AlertsService', function ($scope, AlertsService) {
            $scope.alerts = AlertsService.alerts;
            $scope.$watch('alerts', function () {
                AlertsService.updateAlerts($scope.alerts);
            });

            $scope.addAlert = function () {
                AlertsService.pushAlerts({ msg: 'Another alert!' });
                AlertsService.pushAlerts({ msg: 'Danger!', type: 'danger' });
                AlertsService.determineAlert({ msg: 'Success!', type: 'success' });
            };

            $scope.closeAlert = function (index) {
                AlertsService.deleteAlert(index);
            };

            $scope.$on('alertsUpdated', function () {
                $scope.alerts = AlertsService.alerts;
            });

        }]
    };
});