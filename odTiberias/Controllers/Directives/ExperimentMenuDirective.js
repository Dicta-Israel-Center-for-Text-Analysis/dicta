jTextMinerApp.directive('experimentMenu', function () {
    return {
        restrict: 'AE',
        templateUrl: 'partials/templates/ExperimentMenuTemplate.html',
        controller: ['$scope', 'ExperimentService', 'ngDialog', function ($scope, ExperimentService, ngDialog) {
            $scope.StartNewExperiment = function () {
                $scope.ExperimentMode = 'NewExperiment';
                ExperimentService.NewExperiment();
            }
            $scope.isShow = false;

            $scope.SaveExperiment = function () {
                ngDialog.openConfirm({
                    template: 'partials/Dialogs/partial-SaveAs.html',
                    controller: 'SaveAsController',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                }).then(function (value) {
                    console.log('Modal promise resolved. Value: ', value);
                }, function (reason) {
                    console.log('Modal promise rejected. Reason: ', reason);
                });
            }
        }]
    };
});