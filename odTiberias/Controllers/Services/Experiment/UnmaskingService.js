
jTextMinerApp.factory('UnmaskingService', function ($rootScope) {
    var root = {};

    root.Unmasking_classes = [{
        id: "1",
        title: "Class A",
        actionMode: "BrowseThisComputer",
        chunkMode: "DoNotChunk",
        chunkSize: 0,
        numberOfChunks: 0,
        selectedText: ""
    }, {
        id: "2",
        title: "Class B",
        actionMode: "BrowseThisComputer",
        chunkMode: "DoNotChunk",
        chunkSize: 0,
        numberOfChunks: 0,
        selectedText: ""
    }];

    //Unmasking data members and update functions
    root.Unmasking_NumberOfIteration = 10;
    root.Unmasking_NumberOfFeaturesToDelete = 3;
    root.Unmasking_RankingFeatureType = 'SVMRanker';
    root.Unmasking_ChunkSize = 250;
    root.Unmasking_NumberOfCrossValidation = 5;
    root.Unmasking_NumberOfTimes = 3;
    root.updateUnmasking_NumberOfIterationValue = function (value) {
        this.Unmasking_NumberOfIteration = value;
        $rootScope.$broadcast("valuesUpdated");
    }
    root.updateUnmasking_NumberOfFeaturesToDeleteValue = function (value) {
        this.Unmasking_NumberOfFeaturesToDelete = value;
        $rootScope.$broadcast("valuesUpdated");
    }
    root.updateUnmasking_RankingFeatureTypeValue = function (value) {
        this.Unmasking_RankingFeatureType = value;
        $rootScope.$broadcast("valuesUpdated");
    }
    root.updateUnmasking_ChunkSizeValue = function (value) {
        this.Unmasking_ChunkSize = value;
        $rootScope.$broadcast("valuesUpdated");
    }
    root.updateUnmasking_NumberOfCrossValidationValue = function (value) {
        this.Unmasking_NumberOfCrossValidation = value;
        $rootScope.$broadcast("valuesUpdated");
    }
    root.updateUnmasking_NumberOfTimesValue = function (value) {
        this.Unmasking_NumberOfTimes = value;
        $rootScope.$broadcast("valuesUpdated");
    }

    return root;
});