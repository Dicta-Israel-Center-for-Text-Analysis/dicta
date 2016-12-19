
jTextMinerApp.factory('ClassificationService', function ($rootScope, FeatureCollectionFactory, SelectClassService, TreeService, ClassService, $q, InProgressService, APIService, UserService, SaveClassInterface, ExperimentService) {
    var root = {
        featureCollection: FeatureCollectionFactory.newCollection(),
        Classification_CrossValidationFolds: 10,
        Classification_ExperimentType: 'CV',
        Classification_isKeepingChunksFromSameFileTogether: false,
        Classification_TestSetExperimentType: 'Unknown',
        Experiment: ExperimentService.newExperiment()
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
            userLogin: UserService.user,
            expType: 'Classification',
            expName: root.Experiment.ExperimentName
        };
        InProgressService.updateIsReady(0);

        return APIService.apiRun({crud: 'DeleteClass'}, deleteData, function (response) {
            ClassService.Corpus_classes.splice(index, 1);
            root.featureCollection.updateFeaturesData({});
            ClassService.updateIsAllBibleValue(true);
            for (var i = 0; i < ClassService.Corpus_classes.length; i++) {
                var corpusClass = ClassService.Corpus_classes[i];
                ClassService.updateIsAllBibleValue(ClassService.isAllBible && corpusClass.bible);
            }
            InProgressService.updateIsReady(1);
        }).$promise;
    };

    root.runClassification = function () {
        return root.prepareClassification()
        .then(runClassificationInternal);
    };

    root.prepareClassification = function() {
        // in theory, if nothing has changed, this can be skipped, but we don't yet have code that can check
        if (true) {
            InProgressService.updateIsReady(0);

            var apiCallData = {
                userLogin: UserService.user,
                expType: 'Classification',
                expName: root.Experiment.ExperimentName,
                featureSets: root.featureCollection.Feature_sets,
                corpusClasses: ClassService.Corpus_classes,
                featuresData: root.featureCollection.featuresData
            };

            return APIService.apiRun(
                { crud: 'ExtractFeaturesClassification' },
                apiCallData,
                function (results) {
                    // build a string of all the names of the features in the set
                    function nameString (featureSet) {
                        return featureSet.map(function (feature) { return feature.name;}).sort().join(":::;");
                    }
                    // check if we need to carry over selections from the previous feature set
                    if (root.featureCollection.featuresData.features) {
                        // first make a list of the old strings representing the names in the set
                        var oldFeatureStrings = root.featureCollection.featuresData.features.map(function (set) {
                            return nameString(set);
                        });
                        for (var i = 0; i < results.features.length; i++) {
                            var oldSet = oldFeatureStrings.indexOf(nameString(results.features[i]));
                            // if it exists, then we have the same set as before, so copy the checkboxes
                            if (oldSet > -1) {
                                // collect the old settings into an object
                                var oldSelectedFeatures = {};
                                root.featureCollection.featuresData.features[oldSet]
                                    .forEach(function (feature) { oldSelectedFeatures[feature.name] = feature.selected});
                                // apply them
                                for (var j = 0; j < results.features[i].length; j++) {
                                    results.features[i][j].selected = oldSelectedFeatures[results.features[i][j].name];
                                }
                            }
                        }
                    }
                    // we need the toJSON because we later pass this data back to the server,
                    // and we don't want the extra values that a resource has.
                    // It simply creates an object, not a JSON string.
                    root.featureCollection.updateFeaturesData(results.toJSON());
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
            userLogin: UserService.user,
            expType: 'Classification',
            expName: root.Experiment.ExperimentName,
            selectedAlgorithmTypeId: root.Experiment.selectedAlgorithmTypeId,
            selectedAlgorithmTypeName: root.Experiment.selectedAlgorithmTypeName,
            selectedAlgorithmTypeAttributes: root.Experiment.selectedAlgorithmTypeAttributes,
            classificationExperimentMode: root.Classification_ExperimentType,
            //classificationCrossValidationType: root.Experiment.Classification_CrossValidationType,
            classificationCrossValidationFolds: root.Classification_CrossValidationFolds,
            //classificationSplitRatioCrossValidation: root.Experiment.Classification_Split_ratio_cross_validation,
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
                root.Experiment.updateCvResultData(response);
            }
        ).$promise;
    }

    function classifyTestSet() {
        return APIService.apiRun(
            {crud: 'RunClassification'},
            createRequestForRunClassification(),
            function (response2) {
                InProgressService.updateIsReady(1);
                root.Experiment.tsResultData = response2;
                var sortedResults = TreeService.treeSort(response2.testSetResults,
                    function (item) {
                        return item.name.replace(/_/g, '/').replace('/Dicta Corpus/','').replace(/.rtf$/, '');
                    });
                root.Experiment.tsResultData.testSetResults = sortedResults;
                return sortedResults;
            }
        ).$promise;
    }

    function runClassificationInternal() {
        var classData = root.SaveClassInterface.getInstance();
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

    // save and load exp
    root.createSaveRequest = function () {
        var saveRequest = {
            userLogin: UserService.user,
            expType: 'Classification',
            expName: this.ExperimentName,
            selectedAlgorithmTypeId: ExperimentService.selectedAlgorithmTypeId,
            selectedAlgorithmTypeName: ExperimentService.selectedAlgorithmTypeName,
            selectedAlgorithmTypeAttributes: ExperimentService.selectedAlgorithmTypeAttributes,
            classificationExperimentMode: this.Classification_ExperimentType,
            classificationCrossValidationFolds: this.Classification_CrossValidationFolds,
            corpusMaxId: ClassService.Corpus_maxId,
            featureSets: this.featureCollection.Feature_sets,
            corpusClasses: ClassService.Corpus_classes,
            featuresData: this.featureCollection.featuresData,
            selectTestTextKeys: SelectClassService.lastTestSetSelectedRootKeys
        };
        // copy so we can modify it
        saveRequest.cvResultData = angular.copy(ExperimentService.cvResultData);
        // the server can't handle this yet
        delete saveRequest.cvResultData.classificationList;
        // same thing
        saveRequest.tsResultData = angular.copy(ExperimentService.tsResultData);
        delete saveRequest.tsResultData.classificationList;
        return saveRequest;
    }

    root.SaveExperiment = function () {
        InProgressService.updateIsReady(0);
        APIService.apiRun({ crud: 'SaveClassification' }, this.createSaveRequest(), function (response) {
            InProgressService.updateIsReady(1);
            var results = response;
        });
    };
    // end save and load exp


    return root;
});