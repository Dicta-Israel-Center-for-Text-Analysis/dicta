
jTextMinerApp.factory('ClassificationService', function ($rootScope, FeatureCollectionFactory, SelectClassService, TreeService, ClassService, $q, InProgressService, APIService, AlertsService) {
    var root = {
        featureCollection: FeatureCollectionFactory.newCollection(),
        Classification_CrossValidationFolds: 10,
        Classification_ExperimentType: 'CV',
        Classification_isKeepingChunksFromSameFileTogether: false,
        Classification_TestSetExperimentType: 'Unknown',
        ExperimentServiceFixMe: null,
        SaveClassInterfaceFixMe: null
    };

    //Classification update functions
    root.updateClassification_CrossValidationFoldsValue = function (value) {
        this.Classification_CrossValidationFolds = value;
        $rootScope.$broadcast("ClassificationValuesUpdated");
    }
    root.updateClassification_ExperimentTypeValue = function (value) {
        this.Classification_ExperimentType = value;
        $rootScope.$broadcast("ClassificationValuesUpdated");
    }
    root.updateClassification_isKeepingChunksFromSameFileTogetherValue = function (value) {
        this.Classification_isKeepingChunksFromSameFileTogether = value;
        $rootScope.$broadcast("ClassificationValuesUpdated");
    }
    root.updateClassification_TestSetExperimentTypeValue = function (value) {
        this.Classification_TestSetExperimentType = value;
        $rootScope.$broadcast("ClassificationValuesUpdated");
    }

    root.DeleteClass = function (index) {
        var currentClass = ClassService.Corpus_classes[index];
        var deleteData = {
            title: currentClass.title,
            id: currentClass.id,
            userLogin: ExperimentService.user,
            expType: ExperimentService.ExperimentTypeModel,
            expName: ExperimentService.ExperimentName
        };
        InProgressService.updateIsReady(0);

        return APIService.apiRun({crud: 'DeleteClass'}, deleteData, function (response) {
            ClassService.Corpus_classes.splice(index, 1);
            ClassificationService.featureCollection.updateFeaturesData({});
            ClassService.updateIsAllBibleValue(true);
            for (var i = 0; i < ClassService.Corpus_classes.length; i++) {
                var corpusClass = ClassService.Corpus_classes[i];
                ClassService.updateIsAllBibleValue(ClassService.isAllBible && corpusClass.bible);
            }
            InProgressService.updateIsReady(1);
        }).$promise;
    };

    root.runClassification = function () {
        return prepareClassification()
        .then(runClassificationInternal);
    };
    function prepareClassification () {
        root.ExperimentServiceFixMe.updateExperimentTypeModelValue('Classification');
        // in theory, if nothing has changed, this can be skipped, but we don't yet have code that can check
        if (true) {
            InProgressService.updateIsReady(0);

            var apiCallData = {
                userLogin: root.ExperimentServiceFixMe.user,
                expType: root.ExperimentServiceFixMe.ExperimentTypeModel,
                expName: root.ExperimentServiceFixMe.ExperimentName,
                featureSets: root.featureCollection.Feature_sets,
                corpusClasses: ClassService.Corpus_classes,
                featuresData: root.featureCollection.featuresData
            };

            return APIService.apiRun(
                { crud: 'ExtractFeaturesClassification' },
                apiCallData,
                function (results) {
                    //TODO: $scope.featuresData = results;
                    root.featureCollection.updateFeaturesData(results);
                    InProgressService.updateIsReady(1);
                },
                function (errorResponse) {
                    InProgressService.setError(errorResponse.statusText);
                }
            ).$promise;
        }
        else
            return $q.when(null);
    }

    function createRequestForRunClassification() {
        return {
            userLogin: root.ExperimentServiceFixMe.user,
            expType: root.ExperimentServiceFixMe.ExperimentTypeModel,
            expName: root.ExperimentServiceFixMe.ExperimentName,
            selectedAlgorithmTypeId: root.ExperimentServiceFixMe.selectedAlgorithmTypeId,
            selectedAlgorithmTypeName: root.ExperimentServiceFixMe.selectedAlgorithmTypeName,
            selectedAlgorithmTypeAttributes: root.ExperimentServiceFixMe.selectedAlgorithmTypeAttributes,
            classificationExperimentMode: root.Classification_ExperimentType,
            //classificationCrossValidationType: root.ExperimentServiceFixMe.Classification_CrossValidationType,
            classificationCrossValidationFolds: root.Classification_CrossValidationFolds,
            //classificationSplitRatioCrossValidation: root.ExperimentServiceFixMe.Classification_Split_ratio_cross_validation,
            corpusMaxId: ClassService.Corpus_maxId,
    
            featureSets: root.featureCollection.Feature_sets,
            corpusClasses: ClassService.Corpus_classes,
    
            featuresData: root.featureCollection.featuresData
        };
    }

    function callUnknownTestClass(classData) {
        return APIService.apiRun(
            {crud: 'UnknownTestClass'},
            classData,
            function (results) {
                InProgressService.updateIsReady(1);
                var $scope = {};
                $scope.unknownClasses = ClassService.TestSet_unknown_class;
                $scope.addUnknownClass = function (index, newItemName, text, mode, size, number) {
                    $scope.unknownClasses.push({
                        id: index,
                        title: newItemName,
                        selectedText: text,
                        chunkMode: mode,
                        chunkSize: size,
                        numberOfChunks: number
                    });
                }
                $scope.unknownClasses.splice(0, 1);
                $scope.addUnknownClass(1, results.browse_ClassName, results.selectedText, results.browse_ChunkMode, results.browse_MinimumChunkSize, results.numberOfChunks);
                ClassService.TestSet_unknown_class = $scope.unknownClasses;

                root.updateClassification_ExperimentTypeValue('CV');

                AlertsService.determineAlert({msg: 'Check validation', type: 'success'});
                InProgressService.updateIsReady(0);
            }
        ).$promise;
    }

    function callRunClassificationFirstTime() {
        return APIService.apiRun(
            {crud: 'RunClassification'},
            createRequestForRunClassification(),
            function (response) {
                root.updateClassification_ExperimentTypeValue('TestSet');
                root.ExperimentServiceFixMe.updateCvResultData(response);
            }
        ).$promise;
    }

    function classifyTestSet() {
        return APIService.apiRun(
            {crud: 'RunClassification'},
            createRequestForRunClassification(),
            function (response2) {
                InProgressService.updateIsReady(1);
                root.ExperimentServiceFixMe.tsResultData = response2;
                var sortedResults = TreeService.treeSort(response2.testSetResults,
                    function (item) {
                        return item.name.replace('/Dicta Corpus/','').replace(/_/g, '/').replace(/.rtf$/, '');
                    });
                root.ExperimentServiceFixMe.tsResultData.testSetResults = sortedResults;
                return sortedResults;
            }
        ).$promise;
    }

    function runClassificationInternal() {
        var classData = root.SaveClassInterfaceFixMe;
        classData.actionMode = classData.testSetActionMode;
        InProgressService.updateIsReady(0);
        if (angular.equals(classData.actionMode, 'SelectOnlineCorpus')) {
            classData.select_RootKeys = SelectClassService.lastTestSetSelectedRootKeys;
        }

        classData.expType = 'Classification';
        return callUnknownTestClass(classData)
        .then(callRunClassificationFirstTime)
        .then(classifyTestSet);
    }


    return root;
});