// create the controller and inject Angular's $scope
jTextMinerApp.component('algorithmDialog', {
    bindings: { onConfirm: '&' },
    templateUrl: "Components/Classification/algorithmDialog.component.html",
    controller: function ($scope, ngDialog, ExperimentService) {
        $scope.selectedAlgorithmType = ExperimentService.algorithms[ExperimentService.selectedAlgorithmTypeId];
        $scope.$watch('selectedAlgorithmType', function () {
            ExperimentService.updateselectedAlgorithmTypeValue($scope.selectedAlgorithmType.id, $scope.selectedAlgorithmType.name, $scope.selectedAlgorithmType.attributes);
        });

    }
});