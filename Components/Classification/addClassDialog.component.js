jTextMinerApp.component('addClassDialog', {
    bindings: {
        onConfirm: '&',
        onCancel: '&',
        classObject: '='
    },
    templateUrl: 'Components/Classification/addClassDialog.component.html',
    controller: function ($scope, InProgressService, ClassService) {

        $scope.showInProcess = InProgressService.isReady != 1;
        $scope.$on('isReady_Updated', function () {
            $scope.showInProcess = InProgressService.isReady != 1;
        });

        $scope.ActionMode = ClassService.ExperimentActionMode;
        $scope.$on('ExperimentActionModeValuesUpdated', function () {
            $scope.ActionMode = ClassService.ExperimentActionMode;
        });
    }
});