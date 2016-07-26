// create the controller and inject Angular's $scope
jTextMinerApp.controller('SaveAsController', function ($scope, ngDialog, ExperimentService) {
    $scope.expName = ExperimentService.ExperimentName;
    $scope.Save = function () {
        ExperimentService.updateExperimentName($scope.expName);
        ExperimentService.SaveExperiment();
        $scope.confirm();
    }
});