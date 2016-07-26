jTextMinerApp.controller('ResultsSegmentationController', function ($scope, ExperimentService, APIService, $sce, $location, AlertsService, SegmentationService, ClassService) {

    AlertsService.determineAlert({ msg: 'Here are the results, you may start new experiment by clicking on "New experiment" button', type: 'success' });

    if (ExperimentService.isNewExperiment)
        $location.path('Experiment');

    $scope.NewExperiment = function () {
        ExperimentService.NewExperiment();
        //location.reload(true);
    }
    
    $scope.GoToSegmentation = function () {
        ExperimentService.updateResultData([]);
        $location.path('Segmentation');
    }
    $scope.showSummary = true;
    $scope.NewExperimentName = '';
    $scope.ExperimentTypeModel = ExperimentService.ExperimentTypeModel;
    $scope.selectedAlgorithmTypeName = ExperimentService.selectedAlgorithmTypeName;
    $scope.totalNumberOfFeatures = ExperimentService.totalNumberOfFeatures;
    
    $scope.textAlign = 'left';
    if (ClassService.isAllBible)
        $scope.textAlign = 'right';
    
    $scope.resultData = ExperimentService.resultData;
    $scope.$on('valuesUpdated', function () {
        $scope.resultData = ExperimentService.resultData;
        $scope.htmlSegmentation = $sce.trustAsHtml($scope.resultData.htmlSegmentation);

    });
    
    $scope.htmlSegmentation = $sce.trustAsHtml($scope.resultData.htmlSegmentation);
    
    $scope.ExperimentMode = ExperimentService.ExperimentMode;
   

});
