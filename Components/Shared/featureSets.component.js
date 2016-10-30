jTextMinerApp.component('featureSets', {
        bindings: {
            showDeleteButton: '=',
            featureCollection: '='
        },
        templateUrl: 'Components/Shared/featureSets.component.html',
        controller: ['$scope', 'ngDialog', function ($scope, ngDialog) {
            var ctrl = this;
            $scope.Feature_sets = ctrl.featureCollection.Feature_sets;
            $scope.deleteFeatureSet = function (index) {
                ctrl.featureCollection.deleteFeatureSet(index);
            };
            $scope.editFeatureSet = function (index) {
                ngDialog.openConfirm({
                    template: '<edit-feature-set-dialog ' +
                    'on-confirm="confirm()" ' +
                    'on-discard="closeThisDialog(\'button\')" ' +
                    'feature-collection="ngDialogData.featureCollection" ' +
                    'feature-index="ngDialogData.featureIndex"></edit-feature-set-dialog>',
                    plain: true,
                    className: 'ngdialog-theme-default override-background',
                    scope: $scope,
                    closeByEscape: true,
                    closeByDocument: true,
                    data: {
                        featureCollection: ctrl.featureCollection,
                        featureIndex: index
                    }
                }).then(function (value) {
                    tiberias_tour_pause();
                }, function (reason) {
                    tiberias_tour_pause();
                });
            };
        }]
});
