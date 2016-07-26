jTextMinerApp.factory('ClassService', function ($rootScope, SegmentationService) {
    var service = {};

    service.colors = ["Red", "Green", "Blue", "FFFF00", "FF00FF", "00FFFF", "Gray"];
    service.ExperimentActionMode = 'SelectOnlineCorpus';//'BrowseThisComputer';
    service.updateExperimentActionMode = function (value) {
        this.ExperimentActionMode = value;
        SegmentationService.updateSegmentation_ActionModeValue(value);
        $rootScope.$broadcast("ExperimentActionModeValuesUpdated");
    }


    service.TestSet_unknown_class = [{
        id: "1",
        title: "Unknown",
        chunkMode: "",
        chunkSize: 0,
        numberOfChunks: 0,
        selectedText: ""
    }];
    service.TestSet_known_classes = [];



    //Corpus
    service.Corpus_classes = [];
    service.pushCorpus_classes = function (value) {
        this.Corpus_classes.push(value);
        $rootScope.$broadcast("Corpus_classesValueUpdated");
    }

    service.Corpus_maxId = 0;
    service.Corpus_ClassifyByModel = 'Chapter';
    service.updateCorpus_ClassifyByModelValue = function (value) {
        this.Corpus_ClassifyByModel = value;
        $rootScope.$broadcast("valuesUpdated");
    }

    service.selectedClassIndex = 0;
    service.updateSelectedClassIndex = function (value) {
        this.selectedClassIndex = value;
        $rootScope.$broadcast("valuesUpdated");
    }


    service.selectedRootKeys = [];
    service.updateSelectedRootKeys = function (value) {
        this.selectedRootKeys = value;
        $rootScope.$broadcast("valuesUpdated");
    }

    service.selectedTestRootKeys = [];
    service.updateSelectedTestRootKeys = function (value) {
        this.selectedTestRootKeys = value;
        $rootScope.$broadcast("valuesUpdated");
    }


    service.KnownTestSet = false;

    service.isAllBible = true;
    service.updateIsAllBibleValue = function (value) {
        this.isAllBible = value;
        $rootScope.$broadcast("isAllBibleValueUpdated");
    }

    service.ClassName = '';
    service.updateClassName = function (value) {
        this.ClassName = value;
        //BrowseClassService.updateBrowse_ClassName(value);
        //SelectClassService.updateSelect_ClassName(value);
        $rootScope.$broadcast("ClassNameUpdated");
    }

    return service;
});