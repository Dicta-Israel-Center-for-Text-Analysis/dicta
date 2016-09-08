// create the controller and inject Angular's $scope
jTextMinerApp.controller('SegmentationDialogController', function ($scope, ngDialog, ExperimentService, SegmentationService) {

    $scope.ActionMode = SegmentationService.Segmentation_ActionMode;

    $scope.Segmentation_ChunkBy = SegmentationService.Segmentation_ChunkBy;
    $scope.Segmentation_SplitString = SegmentationService.Segmentation_SplitString;;
    $scope.Segmentation_NumberOfSentencePerChunk = SegmentationService.Segmentation_NumberOfSentencePerChunk;;
    $scope.Segmentation_SimilarityType = SegmentationService.Segmentation_SimilarityType;
    $scope.Segmentation_NumberOfClusters = SegmentationService.Segmentation_NumberOfClusters;
    $scope.Segmentation_CoreDocs = SegmentationService.Segmentation_CoreDocs;
    $scope.Segmentation_NumberOfWordsInFeatureSet = SegmentationService.Segmentation_NumberOfWordsInFeatureSet;
    $scope.Segmentation_NumberOfSentencesLockedIn = SegmentationService.Segmentation_NumberOfSentencesLockedIn;
    $scope.$watch('Segmentation_ChunkBy', function () {
        SegmentationService.updateSegmentation_ChunkByValue($scope.Segmentation_ChunkBy);
    });
    $scope.$watch('Segmentation_SplitString', function () {
        SegmentationService.updateSegmentation_SplitStringValue($scope.Segmentation_SplitString);
    });
    $scope.$watch('Segmentation_NumberOfSentencePerChunk', function () {
        SegmentationService.updateSegmentation_NumberOfSentencePerChunkValue($scope.Segmentation_NumberOfSentencePerChunk);
    });
    $scope.$watch('Segmentation_SimilarityType', function () {
        SegmentationService.updateSegmentation_SimilarityTypeValue($scope.Segmentation_SimilarityType);
    });
    $scope.$watch('Segmentation_NumberOfClusters', function () {
        SegmentationService.updateSegmentation_NumberOfClustersValue($scope.Segmentation_NumberOfClusters);
    });
    $scope.$watch('Segmentation_CoreDocs', function () {
        SegmentationService.updateSegmentation_CoreDocsValue($scope.Segmentation_CoreDocs);
    });
    $scope.$watch('Segmentation_NumberOfWordsInFeatureSet', function () {
        SegmentationService.updateSegmentation_NumberOfWordsInFeatureSetValue($scope.Segmentation_NumberOfWordsInFeatureSet);
    });
    $scope.$watch('Segmentation_NumberOfSentencesLockedIn', function () {
        //alert($scope.Segmentation_NumberOfSentencesLockedIn);
        SegmentationService.updateSegmentation_NumberOfSentencesLockedInValue($scope.Segmentation_NumberOfSentencesLockedIn);
    });
    $scope.$on('valuesUpdated', function () {
        //Segmentation valuesUpdated
        $scope.ActionMode = SegmentationService.Segmentation_ActionMode;
        $scope.Segmentation_ChunkBy = SegmentationService.Segmentation_ChunkBy;;
        $scope.Segmentation_SplitString = SegmentationService.Segmentation_SplitString;;
        $scope.Segmentation_NumberOfSentencePerChunk = SegmentationService.Segmentation_NumberOfSentencePerChunk;;
        $scope.Segmentation_SimilarityType = SegmentationService.Segmentation_SimilarityType;
        $scope.Segmentation_NumberOfClusters = SegmentationService.Segmentation_NumberOfClusters;
        $scope.Segmentation_CoreDocs = SegmentationService.Segmentation_CoreDocs;
        $scope.Segmentation_NumberOfWordsInFeatureSet = SegmentationService.Segmentation_NumberOfWordsInFeatureSet;
        $scope.Segmentation_NumberOfSentencesLockedIn = SegmentationService.Segmentation_NumberOfSentencesLockedIn;

    });

    $scope.selectedAlgorithmType = ExperimentService.algorithms[ExperimentService.selectedAlgorithmTypeId];
    $scope.$watch('selectedAlgorithmType', function () {
        ExperimentService.updateselectedAlgorithmTypeValue($scope.selectedAlgorithmType.id, $scope.selectedAlgorithmType.name, $scope.selectedAlgorithmType.attributes);
    });
    

});