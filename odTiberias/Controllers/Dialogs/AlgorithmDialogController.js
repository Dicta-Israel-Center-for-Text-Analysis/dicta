// create the controller and inject Angular's $scope
jTextMinerApp.controller('AlgorithmDialogController', function ($scope, ngDialog, ExperimentService) {
    
    
    $scope.selectedAlgorithmType = ExperimentService.algorithms[ExperimentService.selectedAlgorithmTypeId];
    $scope.$watch('selectedAlgorithmType', function () {
        ExperimentService.updateselectedAlgorithmTypeValue($scope.selectedAlgorithmType.id, $scope.selectedAlgorithmType.name, $scope.selectedAlgorithmType.attributes);
    });
    
    $scope.GoBack = function () {
        $scope.confirm();
    }
});