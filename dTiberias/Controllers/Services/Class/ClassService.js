jTextMinerApp.factory('ClassService', function ($rootScope, SegmentationService) {
    var service = {};

    // TODO: remove this, since these colors aren't really used
    service.colors = ["Red", "Green", "Blue", "FFFF00", "FF00FF", "00FFFF", "Gray"];

    service.classIndexToColor = function(index) {
        var realColors = ['#FF931E','#7AC943','#3FA9F5','#FF3833','#FF7BAC'];
        // if we overshoot the array, just return something blueish
        return index >= realColors.length ? "#1111" + (index << 4).toString(16) : realColors[index];
    };

    service.classNameToColor = function(name) {
        var index = -1;
        for (var i = 0; i < service.Corpus_classes.length; i++) {
            if (service.Corpus_classes[i].title == name) {
                index = i;
                break;
            }
        }
        return index == -1 ? "#777777" : service.classIndexToColor(index);
    }

    service.ExperimentTestSetActionMode = 'SelectOnlineCorpus';//'BrowseThisComputer';
    service.ExperimentActionMode = 'SelectOnlineCorpus';//'BrowseThisComputer';
    service.updateExperimentActionMode = function (value) {
        this.ExperimentActionMode = value;
        SegmentationService.updateSegmentation_ActionModeValue(value);
        $rootScope.$broadcast("ExperimentActionModeValuesUpdated");
    }
    service.updateExperimentTestSetActionMode = function (value) {
        this.ExperimentTestSetActionMode = value;
        SegmentationService.updateSegmentation_ActionModeValue(value);
        $rootScope.$broadcast("ExperimentTestSetActionModeValuesUpdated");
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