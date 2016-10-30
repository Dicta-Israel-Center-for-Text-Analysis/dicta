jTextMinerApp.component('inProgress',
{
        templateUrl: 'Components/Shared/inProgress.component.html',
        controller: ['$scope', 'InProgressService', function ($scope, InProgressService) {
            $scope.showInProcess = InProgressService.isReady != 1;
            $scope.showInProcessError = InProgressService.errorData;
            $scope.$on('isReady_Updated', function () {
                $scope.showInProcess = InProgressService.isReady != 1;
            });
        }]
});