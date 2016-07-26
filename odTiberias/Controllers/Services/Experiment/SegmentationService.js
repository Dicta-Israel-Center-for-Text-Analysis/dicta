jTextMinerApp.factory('SegmentationService', function ($rootScope) {
    var root = {};

    root.SegmentationDefaultValues = function () {
        this.Segmentation_ActionMode = 'SelectOnlineCorpus';
        this.Segmentation_ChunkBy = 'NumberOfSentence';
        this.Segmentation_SplitString = '';
        this.Segmentation_NumberOfSentencePerChunk = 30;
        this.Segmentation_SimilarityType = 'Cosine';
        this.Segmentation_NumberOfClusters = 2;
        this.Segmentation_CoreDocs = 80;
        this.Segmentation_NumberOfWordsInFeatureSet = 5;
        this.Segmentation_NumberOfSentencesLockedIn = 25;
        $rootScope.$broadcast("SegmentationValuesUpdated");
    }
    /*
    root.Segmentation_class = [{
        id: "1",
        title: "Unknown",
        chunkMode: "",
        chunkSize: 0,
        numberOfChunks: 0,
        selectedText: ""
    }];
    */
    //Segmentation data members and update functions
    root.Segmentation_ActionMode = 'SelectOnlineCorpus';
    root.Segmentation_ChunkBy = 'NumberOfSentence';
    root.Segmentation_SplitString = '';
    root.Segmentation_NumberOfSentencePerChunk = 30;
    root.Segmentation_SimilarityType = 'Cosine';
    root.Segmentation_NumberOfClusters = 2;
    root.Segmentation_CoreDocs = 80;
    root.Segmentation_NumberOfWordsInFeatureSet = 5;
    root.Segmentation_NumberOfSentencesLockedIn = 25;
    root.updateSegmentation_ActionModeValue = function (value) {
        this.Segmentation_ActionMode = value;
        if (angular.equals(this.Segmentation_ActionMode, 'SelectOnlineCorpus'))
            this.updateSegmentation_ChunkByValue('BibleChapter');
        else
            this.updateSegmentation_ChunkByValue('NumberOfSentence');
        $rootScope.$broadcast("SegmentationActionModeValuesUpdated");
    }
    root.updateSegmentation_ChunkByValue = function (value) {
        this.Segmentation_ChunkBy = value;
        $rootScope.$broadcast("SegmentationValuesUpdated");
    }
    root.updateSegmentation_SplitStringValue = function (value) {
        this.Segmentation_SplitString = value;
        $rootScope.$broadcast("SegmentationValuesUpdated");
    }
    root.updateSegmentation_NumberOfSentencePerChunkValue = function (value) {
        this.Segmentation_NumberOfSentencePerChunk = value;
        $rootScope.$broadcast("SegmentationValuesUpdated");
    }
    root.updateSegmentation_SimilarityTypeValue = function (value) {
        this.Segmentation_SimilarityType = value;
        $rootScope.$broadcast("SegmentationValuesUpdated");
    }
    root.updateSegmentation_NumberOfClustersValue = function (value) {
        this.Segmentation_NumberOfClusters = value;
        $rootScope.$broadcast("SegmentationValuesUpdated");
    }
    root.updateSegmentation_CoreDocsValue = function (value) {
        this.Segmentation_CoreDocs = value;
        $rootScope.$broadcast("SegmentationValuesUpdated");
    }
    root.updateSegmentation_NumberOfWordsInFeatureSetValue = function (value) {
        this.Segmentation_NumberOfWordsInFeatureSet = value;
        $rootScope.$broadcast("SegmentationValuesUpdated");
    }
    root.updateSegmentation_NumberOfSentencesLockedInValue = function (value) {
        this.Segmentation_NumberOfSentencesLockedIn = value;
        $rootScope.$broadcast("SegmentationValuesUpdated");
    }

    return root;
});