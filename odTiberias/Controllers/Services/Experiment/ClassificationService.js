
jTextMinerApp.factory('ClassificationService', function ($rootScope) {
    var root = {};

    //Classification data members and update functions
    root.Classification_CrossValidationFolds = 10;
    root.Classification_ExperimentType = 'CV';
    root.Classification_isKeepingChunksFromSameFileToghter = false;
    root.Classification_TestSetExperimentType = 'Unknown';


    root.updateClassification_CrossValidationFoldsValue = function (value) {
        this.Classification_CrossValidationFolds = value;
        $rootScope.$broadcast("ClassificationValuesUpdated");
    }
    root.updateClassification_ExperimentTypeValue = function (value) {
        this.Classification_ExperimentType = value;
        $rootScope.$broadcast("ClassificationValuesUpdated");
    }
    root.updateClassification_isKeepingChunksFromSameFileToghterValue = function (value) {
        this.Classification_isKeepingChunksFromSameFileToghter = value;
        $rootScope.$broadcast("ClassificationValuesUpdated");
    }
    root.updateClassification_TestSetExperimentTypeValue = function (value) {
        this.Classification_TestSetExperimentType = value;
        $rootScope.$broadcast("ClassificationValuesUpdated");
    }

    return root;
});