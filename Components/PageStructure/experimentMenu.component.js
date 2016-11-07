jTextMinerApp.component('experimentMenu', {
        templateUrl: 'Components/PageStructure/experimentMenu.component.html',
        controller: ['$scope', 'ExperimentService', 'ngDialog', function ($scope, ExperimentService, ngDialog) {
            $scope.StartNewExperiment = function () {
                window.location.reload();
                $scope.ExperimentMode = 'NewExperiment';
                ExperimentService.NewExperiment();
            }
            $scope.isShow = false;

            $scope.SaveExperiment = function () {
                ngDialog.openConfirm({
                    template: '<save-as-dialog onConfirm="confirm()" onCancel="closeThisDialog(\'button\')"></save-as-dialog>',
                    plain: true,
                    className: 'ngdialog-theme-default',
                    scope: $scope
                }).then(function (value) {
                    console.log('Modal promise resolved. Value: ', value);
                }, function (reason) {
                    console.log('Modal promise rejected. Reason: ', reason);
                });
            }
        }]
});