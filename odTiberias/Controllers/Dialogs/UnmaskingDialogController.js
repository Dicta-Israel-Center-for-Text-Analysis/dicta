// create the controller and inject Angular's $scope
jTextMinerApp.controller('UnmaskingDialogController', function ($scope, ngDialog, ExperimentService, UnmaskingService) {
    
    //Unmasking data members and watch functions
    $scope.Unmasking_NumberOfIteration = UnmaskingService.Unmasking_NumberOfIteration;;
    $scope.Unmasking_NumberOfFeaturesToDelete = UnmaskingService.Unmasking_NumberOfFeaturesToDelete;;
    $scope.Unmasking_RankingFeatureType = UnmaskingService.Unmasking_RankingFeatureType;
    $scope.Unmasking_ChunkSize = UnmaskingService.Unmasking_ChunkSize;
    $scope.Unmasking_NumberOfCrossValidation = UnmaskingService.Unmasking_NumberOfCrossValidation;
    $scope.Unmasking_NumberOfTimes = UnmaskingService.Unmasking_NumberOfTimes;

    $scope.$watch('Unmasking_NumberOfIteration', function () {
        UnmaskingService.updateUnmasking_NumberOfIterationValue($scope.Unmasking_NumberOfIteration);
    });
    $scope.$watch('Unmasking_NumberOfFeaturesToDelete', function () {
        UnmaskingService.updateUnmasking_NumberOfFeaturesToDeleteValue($scope.Unmasking_NumberOfFeaturesToDelete);
    });
    $scope.$watch('Unmasking_RankingFeatureType', function () {
        UnmaskingService.updateUnmasking_RankingFeatureTypeValue($scope.Unmasking_RankingFeatureType);
    });
    $scope.$watch('Unmasking_ChunkSize', function () {
        UnmaskingService.updateUnmasking_ChunkSizeValue($scope.Unmasking_ChunkSize);
    });
    $scope.$watch('Unmasking_NumberOfCrossValidation', function () {
        UnmaskingService.updateUnmasking_NumberOfCrossValidationValue($scope.Unmasking_NumberOfCrossValidation);
    });
    $scope.$watch('Unmasking_NumberOfTimes', function () {
        UnmaskingService.updateUnmasking_NumberOfTimesValue($scope.Unmasking_NumberOfTimes);
    });


    $scope.selectedAlgorithmType = ExperimentService.algorithms[ExperimentService.selectedAlgorithmTypeId];
    $scope.$watch('selectedAlgorithmType', function () {
        ExperimentService.updateselectedAlgorithmTypeValue($scope.selectedAlgorithmType.id, $scope.selectedAlgorithmType.name, $scope.selectedAlgorithmType.attributes);
    });
    
});