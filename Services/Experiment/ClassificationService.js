jTextMinerApp.factory('ClassificationService', function (FeatureCollectionFactory, SelectClassService, TreeService, ClassService, $q, APIService, UserService, SaveClassInterface, ExperimentService) {

    function newExperiment() {
        function addClass(selectionData) {
            function addClass (classData) {
                experiment.classes.isAllBible = experiment.classes.isAllBible && classData.bible;
                experiment.featureCollection.updateFeaturesData({});
                experiment.classes.Corpus_maxId += 1;
                classData.id = experiment.classes.Corpus_maxId;
                experiment.classes.Corpus_classes.push(classData);
            }
            experiment.trainSet[selectionData.title] = selectionData.keys;
            addClass({
                title: selectionData.title,
                text: selectionData,
                selectedText: selectionData.keys, //results.selectedText,
                chunkMode: 'By chapter',
                chunkSize: '',
                // numberOfChunks: results.numberOfChunks,
                // totalNumberOfWords: results.totalNumberOfWords,
                bible: true
            });
        }
        function deleteClass(index) {
            const deletedClass = experiment.classes.Corpus_classes.splice(index, 1)[0];
            delete experiment.trainSet[deletedClass.title];
            experiment.featureCollection.updateFeaturesData({});
            experiment.tsResultData = [];
            experiment.cvResultData = [];
        }

        function updateClass (index, selectionData) {
            const classData = experiment.classes.Corpus_classes[index];
            experiment.featureCollection.updateFeaturesData({});
            experiment.classes.isAllBible = true; // FIXME: unclear when this is used, but the value is not updated
            delete experiment.trainSet[classData.title];
            experiment.trainSet[selectionData.title] = selectionData.keys;
            classData.title = selectionData.title;
            classData.text = selectionData;
            classData.selectedText = selectionData.keys;
        }

        function runClassification() {
            experiment.error = false;
            return experiment.prepareClassification()
                .then(runClassificationInternal)
                .then(response => {
                    if (experiment.listener)
                        experiment.listener(response);
                    return response;
                })
                .catch(() => {
                    experiment.setError('Server failed.');
                    experiment.inProgress = false;
                });
        }

        function runExtractAndCV() {
            experiment.error = false;
            experiment.inProgress = true;
            return experiment.prepareClassification()
                .then(callRunClassificationFirstTime)
                .then(() =>{
                    experiment.inProgress = false;
                })
                .catch(() => {
                    experiment.setError('Server failed.');
                    experiment.inProgress = false;
                });
        }

        function prepareClassification() {
            // in theory, if nothing has changed, this can be skipped, but we don't yet have code that can check
            if (false) {
                return $q.when(null);
            }
            experiment.inProgress = true;

            var apiCallData = {
                featureSets: experiment.featureCollection.Feature_sets,
                trainSet: experiment.trainSet
            };

            return APIService.call(
                'JTextMinerAPI/ExtractFeaturesClassification',
                apiCallData)
                .then(
                    function (response) {
                        const features = response.data;
                        // build a string of all the names of the features in the set
                        function nameString(featureSet) {
                            return featureSet.map(function (feature) {
                                return feature.name;
                            }).sort().join(":::;");
                        }

                        // check if we need to carry over selections from the previous feature set
                        const oldFeatures = experiment.featureCollection.featuresData.features;
                        if (oldFeatures) {
                            // first make a list of the old strings representing the names in the set
                            const oldFeatureStrings = oldFeatures.map(set => nameString(set));
                            features.forEach(newFeatureSet => {
                                const oldSet = oldFeatureStrings.indexOf(nameString(newFeatureSet));
                                // if it exists, then we have the same set as before, so copy the checkboxes
                                if (oldSet > -1) {
                                    // collect the old settings into an object
                                    const oldSelectedFeatures = {};
                                    oldFeatures[oldSet].forEach(function (feature) {
                                        oldSelectedFeatures[feature.name] = feature.selected
                                    });
                                    // apply them
                                    newFeatureSet.forEach(newFeature => {
                                        newFeature.selected = oldSelectedFeatures[newFeature.name];
                                    });
                                }
                            });
                        }
                        experiment.featureCollection.updateFeaturesData({features});
                        experiment.inProgress = false;
                    },
                    function (errorResponse) {
                        experiment.setError(errorResponse.statusText);
                    }
                );
        }

        function setError(message) {
            experiment.error = true;
            experiment.errorMsg = message;
        }

        function createRequestForRunClassification(type) {
            return {
                userLogin: UserService.$fixmeUser,
                expType: 'Classification',
                expName: experiment.base.experimentName,
                selectedAlgorithmTypeId: experiment.base.selectedAlgorithmTypeId,
                selectedAlgorithmTypeName: experiment.base.selectedAlgorithmTypeName,
                selectedAlgorithmTypeAttributes: experiment.base.selectedAlgorithmTypeAttributes,
                classificationExperimentMode: type,
                //classificationCrossValidationType: experiment.base.Classification_CrossValidationType,
                classificationCrossValidationFolds: experiment.Classification_CrossValidationFolds,
                //classificationSplitRatioCrossValidation: experiment.base.Classification_Split_ratio_cross_validation,

                featureSets: experiment.featureCollection.Feature_sets,

                features: experiment.featureCollection.featuresData.features,
                trainSet: experiment.trainSet,
                selectedTestTextKeys: SelectClassService.testText ? SelectClassService.testText.keys : []
            };
        }

        function callRunClassificationFirstTime() {
            return APIService.call('JTextMinerAPI/RunCrossValidation',
                    createRequestForRunClassification('CV'))
                .then(
                    function (response) {
                        experiment.cvResultData = response.data;
                    }
                );
        }

        function classifyTestSet() {
            var testClassData = SaveClassInterface.getInstance({
                experimentName: experiment.base.experimentName,
                testSet: true,
                text: SelectClassService.testText
            });
            testClassData.featureSets = experiment.featureCollection.Feature_sets;
            var request = createRequestForRunClassification('TestSet');
            request.unknownTestSetData = testClassData;
            return APIService.call('JTextMinerAPI/RunTestSet', request)
                .then(
                    function (response2) {
                        experiment.inProgress = false;
                        experiment.tsResultData = response2.data;
                        var sortedResults = TreeService.treeSort(response2.data.testSetResults,
                            function (item) {
                                return item.name.replace(/_/g, '/').replace('/Dicta Corpus/', '').replace(/.rtf$/, '');
                            });
                        experiment.tsResultData.testSetResults = sortedResults;
                        return sortedResults;
                    }
                );
        }

        function runClassificationInternal() {
            experiment.inProgress = true;

            return callRunClassificationFirstTime()
                .then(classifyTestSet);
        }

        function saveClass(selectionData) {
            function addClass(classData) {
                experiment.classes.isAllBible = experiment.classes.isAllBible && classData.bible;
                experiment.featureCollection.updateFeaturesData({});
                experiment.classes.Corpus_maxId += 1;
                classData.id = experiment.classes.Corpus_maxId;
                experiment.classes.Corpus_classes.push(classData);
            }

            // workaround for server bug - force names to be sorted correctly
            var prefix = experiment.fixmeCounter++; //"ABCDEFGHIJKLMNOPQRSTUVWXYZ".substr(experiment.fixmeCounter++, 1);
            selectionData.className = prefix + " - " + selectionData.className;

            if (angular.equals(selectionData.mode, 'BrowseThisComputer')) {
                var classData = SaveClassInterface.getInstance({
                    text: selectionData,
                    className: selectionData.className,
                    experimentName: experiment.base.experimentName,
                    trainSet: experiment.trainSet
                });
                experiment.inProgress = true;
                return APIService.call('JTextMinerAPI/TrainClass', classData)
                    .then(function (response) {
                        experiment.inProgress = false;
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
                experiment.inProgress = true;
                var classData = SaveClassInterface.getInstance({
                    text: selectionData,
                    className: selectionData.className,
                    experimentName: experiment.base.experimentName,
                    trainSet: experiment.trainSet
                });
                return APIService.call('JTextMinerAPI/TrainClass', classData)
                    .then(function (response) {
                        experiment.inProgress = false;
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
        }

        function getTextsWithFeatures() {
            if (!SelectClassService.testText || SelectClassService.testText.keys.length === 0)
                return $q.resolve();
            var featureTypeMap = {
                "Word": "WORDS",
                "Letter": "LETTERS",
                "Morphology": "MORPHOLOGY",
                "SyntaxClause": "SYNTAX_CLAUSE_TYPES",
                "SyntaxPhrase": "SYNTAX_PHRASE_SEQUENCES"
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
                    if (featureSet.tokenizerType === "Word" || featureSet.tokenizerType === "Letter") {
                        if (featureSet.vocalized)
                            return "VOWELIZED";
                        return "TEXT_ONLY";
                    }
                    if (featureSet.tokenizerType === "Morphology") {
                        return featureSet.includeLexeme ? "" : "(?<=@)[^#]+";
                    }
                    if (featureSet.tokenizerType === "SyntaxPhrase" && featureSet.spoOnly) {
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
                    "keys": SelectClassService.testText.keys,
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
                function (response) {
                    experiment.testTexts = response.data;
                    return response.data;
                }
            );
            var featuresCompletePromise = $q.all(featurePromises).then(function (responses) {
                experiment.testTextsFeatures = _.flatMap(responses, response => response.data);
            });
            return $q.all([textPromise, featuresCompletePromise]).then(values => {experiment.save(); return values;});
        }

        function registerListener(listener) {
            experiment.listener = listener;
            experiment.load();
            if (experiment.tsResultData.testSetResults)
                experiment.listener(experiment.tsResultData.testSetResults);
        }

        let experiment = {
            featureCollection: FeatureCollectionFactory.newCollection('Classification'),
            Classification_CrossValidationFolds: 10,
            Classification_isKeepingChunksFromSameFileTogether: false,
            Classification_TestSetExperimentType: 'Unknown',
            cvResultData: [],
            tsResultData: [],
            base: ExperimentService.newExperiment(),
            classes: ClassService.newInstance(),
            trainSet: {},
            inProgress: false,
            error: false,
            addClass,
            deleteClass,
            updateClass,
            runClassification,
            runExtractAndCV,
            prepareClassification,
            setError,
            getTextsWithFeatures,
            registerListener,
            fixmeCounter: 1,
            save() {
                const saveData = {
                    cvData: experiment.cvResultData,
                    tsData: experiment.tsResultData,
                    trainSet: experiment.trainSet,
                    featureCollection: experiment.featureCollection,
                    base: experiment.base,
                    classes: experiment.classes,
                    testTexts: experiment.testTexts,
                    testTextsFeatures: experiment.testTextsFeatures
                };
                // TODO: this can run into storage limits, and doesn't fail gracefully
                // window.sessionStorage.setItem('lastClassification',JSON.stringify(saveData));
            },
            load() {
                // TODO: this can run into storage limits, and doesn't fail gracefully and state isn't correctly restored
                //const savedDataStr = window.sessionStorage.getItem('lastClassification');
                // if (savedDataStr) {
                //     const savedData = JSON.parse(savedDataStr);
                //     experiment.cvResultData = savedData.cvData;
                //     experiment.tsResultData = savedData.tsData;
                //     experiment.trainSet = savedData.trainSet;
                //     experiment.featureCollection.totalNumberOfFeatures = savedData.featureCollection.totalNumberOfFeatures;
                //     experiment.featureCollection.featuresData = savedData.featureCollection.featuresData;
                //     experiment.featureCollection.FeatureSet_maxId = savedData.featureCollection.FeatureSet_maxId;
                //     experiment.featureCollection.Feature_sets = savedData.featureCollection.Feature_sets;
                //     experiment.classes.TestSet_unknown_class = savedData.classes.TestSet_unknown_class;
                //     experiment.classes.Corpus_classes = savedData.classes.Corpus_classes;
                //     experiment.classes.Corpus_maxId = savedData.classes.Corpus_maxId;
                //     experiment.classes.isAllBible = savedData.classes.isAllBible;
                //     experiment.base.experimentGUID = savedData.base.experimentGUID;
                //     experiment.base.experimentName = savedData.base.experimentName;
                //     experiment.base.selectedAlgorithmTypeId = savedData.base.selectedAlgorithmTypeId;
                //     experiment.base.selectedAlgorithmTypeName = savedData.base.selectedAlgorithmTypeName;
                //     experiment.testTexts = savedData.testTexts;
                //     experiment.testTextsFeatures = savedData.testTextsFeatures;
                // }
            },

            // save and load exp (not working)
            createSaveRequest() {
                alert('Not implemented');
                var saveRequest = {
                    userLogin: UserService.$fixmeUser,
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
                experiment.inProgress = true;
                APIService.call('JTextMinerAPI/SaveClassification', this.createSaveRequest())
                    .then(function () {
                        experiment.inProgress = false;
                    });
            }
            // end save and load exp
        };
        return experiment;
    }

    return {newExperiment};
});