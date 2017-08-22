jTextMinerApp.factory('ClassificationService', function ($rootScope, FeatureCollectionFactory, SelectClassService, TreeService, ClassService, $q, InProgressService, APIService, UserService, SaveClassInterface, ExperimentService) {
    var root = {
        newExperiment() {
            var experiment = {
                featureCollection: FeatureCollectionFactory.newCollection(),
                Classification_CrossValidationFolds: 10,
                Classification_isKeepingChunksFromSameFileTogether: false,
                Classification_TestSetExperimentType: 'Unknown',
                cvResultData: [],
                tsResultData: [],
                base: ExperimentService.newExperiment(),
                classes: ClassService.newInstance(),
                trainSet: {},

                //Classification update functions
                updateClassification_CrossValidationFoldsValue(value) {
                    this.Classification_CrossValidationFolds = value;
                    $rootScope.$broadcast("ClassificationValuesUpdated");
                },
                updateClassification_isKeepingChunksFromSameFileTogetherValue(value) {
                    this.Classification_isKeepingChunksFromSameFileTogether = value;
                    $rootScope.$broadcast("ClassificationValuesUpdated");
                },
                updateClassification_TestSetExperimentTypeValue(value) {
                    this.Classification_TestSetExperimentType = value;
                    $rootScope.$broadcast("ClassificationValuesUpdated");
                },

                DeleteClass(index) {
                    var deletedClass = this.classes.Corpus_classes.splice(index, 1)[0];
                    delete this.trainSet[deletedClass.title];
                    this.featureCollection.updateFeaturesData({});
                },

                runClassification() {
                    return this.prepareClassification()
                        .then(this.runClassificationInternal.bind(this))
                        .then(response => {
                            if (experiment.listener)
                                experiment.listener(response);
                            return response;
                        });
                },

                prepareClassification() {
                    // in theory, if nothing has changed, this can be skipped, but we don't yet have code that can check
                    if (true) {
                        InProgressService.updateIsReady(0);

                        var apiCallData = {
                            //userLogin: UserService.user,
                            //expType: 'Classification',
                            //expName: this.base.experimentName,
                            featureSets: this.featureCollection.Feature_sets,
                            trainSet: this.trainSet
                        };

                        return APIService.call(
                            'JTextMinerAPI/ExtractFeaturesClassification',
                            apiCallData)
                            .then(
                            function (response) {
                                var results = { features: response.data };
                                // build a string of all the names of the features in the set
                                function nameString(featureSet) {
                                    return featureSet.map(function (feature) {
                                        return feature.name;
                                    }).sort().join(":::;");
                                }

                                // check if we need to carry over selections from the previous feature set
                                if (this.featureCollection.featuresData.features) {
                                    // first make a list of the old strings representing the names in the set
                                    var oldFeatureStrings = this.featureCollection.featuresData.features.map(function (set) {
                                        return nameString(set);
                                    });
                                    for (var i = 0; i < results.features.length; i++) {
                                        var oldSet = oldFeatureStrings.indexOf(nameString(results.features[i]));
                                        // if it exists, then we have the same set as before, so copy the checkboxes
                                        if (oldSet > -1) {
                                            // collect the old settings into an object
                                            var oldSelectedFeatures = {};
                                            this.featureCollection.featuresData.features[oldSet]
                                                .forEach(function (feature) {
                                                    oldSelectedFeatures[feature.name] = feature.selected
                                                });
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
                                this.featureCollection.updateFeaturesData(results);
                                InProgressService.updateIsReady(1);
                            }.bind(this),
                            function (errorResponse) {
                                InProgressService.setError(errorResponse.statusText);
                            }
                        );
                    }
                    else
                        return $q.when(null);
                },
                createRequestForRunClassification(type) {
                    return {
                        userLogin: UserService.user,
                        expType: 'Classification',
                        expName: this.base.experimentName,
                        selectedAlgorithmTypeId: this.base.selectedAlgorithmTypeId,
                        selectedAlgorithmTypeName: this.base.selectedAlgorithmTypeName,
                        selectedAlgorithmTypeAttributes: this.base.selectedAlgorithmTypeAttributes,
                        classificationExperimentMode: type,
                        //classificationCrossValidationType: this.base.Classification_CrossValidationType,
                        classificationCrossValidationFolds: this.Classification_CrossValidationFolds,
                        //classificationSplitRatioCrossValidation: this.base.Classification_Split_ratio_cross_validation,

                        featureSets: this.featureCollection.Feature_sets,

                        features: this.featureCollection.featuresData.features,
                        trainSet: this.trainSet,
                        selectedTestTextKeys: SelectClassService.testText.keys
                    };
                },

                callRunClassificationFirstTime() {
                    return APIService.call('JTextMinerAPI/RunCrossValidation',
                        this.createRequestForRunClassification('CV'))
                        .then(
                            function (response) {
                                this.cvResultData = response.data;
                            }.bind(this)
                        );
                },

                classifyTestSet() {
                    var testClassData = SaveClassInterface.getInstance({
                        experimentName: this.base.experimentName,
                        testSet: true,
                        text: SelectClassService.testText
                    });
                    testClassData.featureSets = this.featureCollection.Feature_sets;
                    var request = this.createRequestForRunClassification('TestSet');
                    request.unknownTestSetData = testClassData;
                    return APIService.call('JTextMinerAPI/RunTestSet', request)
                        .then(
                        function (response2) {
                            InProgressService.updateIsReady(1);
                            this.tsResultData = response2.data;
                            var sortedResults = TreeService.treeSort(response2.data.testSetResults,
                                function (item) {
                                    return item.name.replace(/_/g, '/').replace('/Dicta Corpus/', '').replace(/.rtf$/, '');
                                });
                            this.tsResultData.testSetResults = sortedResults;
                            return sortedResults;
                        }.bind(this)
                    );
                },

                runClassificationInternal() {
                    InProgressService.updateIsReady(0);

                    return this.callRunClassificationFirstTime()
                        .then(this.classifyTestSet.bind(this));
                },

                // save and load exp
                createSaveRequest() {
                    alert('Not implemented');
                    var saveRequest = {
                        userLogin: UserService.user,
                        expType: 'Classification',
                        expName: this.base.experimentName,
                        selectedAlgorithmTypeId: ExperimentService.selectedAlgorithmTypeId,
                        selectedAlgorithmTypeName: ExperimentService.selectedAlgorithmTypeName,
                        selectedAlgorithmTypeAttributes: ExperimentService.selectedAlgorithmTypeAttributes,
                        classificationExperimentMode: 'CV',
                        classificationCrossValidationFolds: this.Classification_CrossValidationFolds,
                        corpusMaxId: ClassService.Corpus_maxId,
                        featureSets: this.featureCollection.Feature_sets,
                        corpusClasses: ClassService.Corpus_classes,
                        featuresData: this.featureCollection.featuresData,
                        selectTestTextKeys: SelectClassService.lastTestSetSelectedRootKeys
                    };
                    // copy so we can modify it
                    saveRequest.cvResultData = angular.copy(this.cvResultData);
                    // the server can't handle this yet
                    delete saveRequest.cvResultData.classificationList;
                    // same thing
                    saveRequest.tsResultData = angular.copy(this.tsResultData);
                    delete saveRequest.tsResultData.classificationList;
                    return saveRequest;
                },
                SaveExperiment() {
                    InProgressService.updateIsReady(0);
                    APIService.call('JTextMinerAPI/SaveClassification', this.createSaveRequest())
                        .then(function () {
                            InProgressService.updateIsReady(1);
                        });
                },
                // end save and load exp
                fixmeCounter: 1,
                saveClass(selectionData) {
                    var experiment = this;
                    function addClass (classData) {
                        experiment.classes.isAllBible = experiment.classes.isAllBible && classData.bible;
                        experiment.featureCollection.updateFeaturesData({});
                        experiment.classes.Corpus_maxId += 1;
                        classData.id = experiment.classes.Corpus_maxId;
                        experiment.classes.Corpus_classes.push(classData);
                    }

                    // workaround for server bug - force names to be sorted correctly
                    var prefix = this.fixmeCounter++; //"ABCDEFGHIJKLMNOPQRSTUVWXYZ".substr(experiment.fixmeCounter++, 1);
                    selectionData.className = prefix + " - " + selectionData.className;

                    if (angular.equals(selectionData.mode, 'BrowseThisComputer')) {
                        var classData = SaveClassInterface.getInstance({
                            text: selectionData,
                            className: selectionData.className,
                            experimentName: experiment.base.experimentName,
                            trainSet: experiment.trainSet
                        });
                        InProgressService.updateIsReady(0);
                        return APIService.call('JTextMinerAPI/TrainClass', classData)
                            .then( function (response) {
                                InProgressService.updateIsReady(1);
                                var results = response.data;
                                experiment.trainSet[selectionData.className] = selectionData.keys;
                                addClass({
                                    title: selectionData.className,
                                    selectedText: results.selectedText,
                                    chunkMode: selectionData.browse_ChunkMode,
                                    chunkSize: selectionData.browse_MinimumChunkSize,
                                    numberOfChunks: results.numberOfChunks,
                                    totalNumberOfWords: results.totalNumberOfWords,
                                    bible: false
                                });
                            });
                    }
                    else if (angular.equals(selectionData.mode, 'SelectOnlineCorpus')) {
                        InProgressService.updateIsReady(0);
                        var classData = SaveClassInterface.getInstance({
                            text: selectionData,
                            className: selectionData.className,
                            experimentName: experiment.base.experimentName,
                            trainSet: experiment.trainSet
                        });
                        return APIService.call('JTextMinerAPI/TrainClass', classData)
                            .then(function (response) {
                                InProgressService.updateIsReady(1);
                                var results = response.data;
                                experiment.trainSet[selectionData.className] = selectionData.keys;
                                addClass({
                                    title: selectionData.className,
                                    selectedText: results.selectedText,
                                    chunkMode: 'By chapter',
                                    chunkSize: '',
                                    numberOfChunks: results.numberOfChunks,
                                    totalNumberOfWords: results.totalNumberOfWords,
                                    bible: true
                                });
                            });
                    }
                },

                getTextsWithFeatures(){
                    var featureTypeMap = {
                        "Word":"WORDS",
                        "Letter":"LETTERS",
                        "Morphology":"MORPHOLOGY",
                        "SyntaxClause":"SYNTAX_CLAUSE_TYPES",
                        "SyntaxPhrase":"SYNTAX_PHRASE_SEQUENCES"
                    };
                    var nGramMap = {
                        "Unigram": 1,
                        "Bigram": 2,
                        "Trigram": 3
                    };
                    experiment.testTexts = [];
                    experiment.testTextsFeatures = [];
                    var textPromise;
                    var featurePromises = [];
                    for (let featureSet of experiment.featureCollection.Feature_sets) {
                        var filter = function () {
                            if (featureSet.tokenizerType == "Word" || featureSet.tokenizerType == "Letter") {
                                if (featureSet.vocalized)
                                    return "VOWELIZED";
                                return "TEXT_ONLY";
                            }
                            if (featureSet.tokenizerType == "Morphology") {
                                return featureSet.includeLexeme ? "" : "(?<=@)[^#]+";
                            }
                            if (featureSet.tokenizerType == "SyntaxPhrase" && featureSet.spoOnly) {
                                return "SUBJECT_PREDICATE_OBJECT";
                            }
                            return "";
                            // filter = featureSet.
                            //     includeLexeme: false,
                            //     spoOnly: false,
                            //     vocalized: true,
                            //     sinDot: false,
                            //     tokenized: false,
                            //     includeNumber: false,
                            //     includePunctuation: false
                        }();
                        var featuresRequest = {
                            "keys":  SelectClassService.testText.keys,
                            "chunkType": "LARGE",
                            "featureSettings": {
                                "type": featureTypeMap[featureSet.tokenizerType],
                                "filter": filter,
                                "nGram": nGramMap[featureSet.featureType]
                            }
                        };
                        featurePromises.push(APIService.call("TextFeatures/ListFeatures", featuresRequest));
                    }
                    var textRequest = {
                        "keys": SelectClassService.testText.keys,
                        "chunkType": "LARGE"
                    };
                    textPromise = APIService.call("TextFeatures/GetText", textRequest).then(
                        function(response) {
                            experiment.testTexts = response.data;
                            return response.data;
                        }
                    );
                    var featuresCompletePromise = $q.all(featurePromises).then(function (responses) {
                        experiment.testTextsFeatures = _.flatMap(responses, response => response.data);
                    });
                    return $q.all([textPromise, featuresCompletePromise]);
                },
                registerListener(listener) {
                    experiment.listener = listener;
                }
            }
            return experiment;
        }
    };

    return root;
});