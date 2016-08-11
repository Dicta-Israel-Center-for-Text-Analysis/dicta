jTextMinerApp.directive('tabsSecondTab', function () {
    return {
        restrict: 'AE',
        templateUrl: 'partials/templates/TabsSecondTab.html',
        controller: ['$scope', '$rootScope', 'ExperimentService', '$location', 'focus', 'APIService', '$filter', 'AlertsService', 'ClassificationService', 'FeatureService', 'InProgressService', 'ClassService', 'SaveClassInterface', 'SelectClassService', '$sce', 'ngDialog', 'TreeService', function ($scope, $rootScope, ExperimentService, $location, focus, APIService, $filter, AlertsService, ClassificationService, FeatureService, InProgressService, ClassService, SaveClassInterface, SelectClassService, $sce, ngDialog, TreeService) {
            $scope.showInProcess = InProgressService.isReady != 1;
            $scope.$on('isReady_Updated', function () {
                $scope.showInProcess = InProgressService.isReady != 1;
            });
            $scope.countFilesPerClass = [];
            
            $scope.colors = ClassService.colors;
            $scope.indexOfColor = ClassService.classNameToColor;

            // someone pressed the "Add Class" button, so show the dialog
            $scope.ContinueToAddClass = function (actionMode) {

                $rootScope.$broadcast('lastSelectedRootKeys', []);
                $scope.showAddClassDialog = true;

                ClassService.updateClassName('class ' + ClassService.Corpus_maxId);

                ClassService.updateExperimentActionMode(actionMode);
                //$scope.Next();
            }


            $scope.UpdateExtractFeaturesData = function () {
                $scope.data = {};
                $scope.data.userLogin = ExperimentService.user;
                $scope.data.expType = ExperimentService.ExperimentTypeModel;


                $scope.data.expName = ExperimentService.ExperimentName;

                $scope.data.featureSets = FeatureService.Feature_sets;
                $scope.data.corpusClasses = ClassService.Corpus_classes;

                $scope.data.featuresData = FeatureService.featuresData;

            }


            $scope.UpdateDataForNewExperiment = function (data) {
                //ExperimentService.updateExperimentModeValue();
                ExperimentService.updateExperimentTypeModelValue(data.expType);
                ExperimentService.updateExperimentName(data.expName);

                ExperimentService.updateselectedAlgorithmTypeValue(data.selectedAlgorithmTypeId, data.selectedAlgorithmTypeName, data.selectedAlgorithmTypeAttributes);

                ClassificationService.updateClassification_ExperimentTypeValue(data.classificationExperimentMode);
                ClassificationService.updateClassification_CrossValidationFoldsValue(data.classificationCrossValidationFolds);

                ClassService.Corpus_maxId = data.corpusMaxId;

                FeatureService.Feature_sets = data.featureSets;
                ClassService.Corpus_classes = data.corpusClasses;

                FeatureService.updateFeaturesData(data.featuresData);
            }



            // Bible
            $scope.cancelClass = function () {
                $scope.showClassDialog = false;
                $scope.showAddClassDialog = false;
            }

            $scope.saveClass = function () {
                $scope.showClassDialog = false;
                $scope.showAddClassDialog = false;
                ExperimentService.updateExperimentTypeModelValue('Classification');
                var classData = SaveClassInterface; // {};
                
                if (angular.equals(classData.actionMode, 'BrowseThisComputer')) {
                    classData.totalNumberOfWords = BrowseClassService.LastClassTotalNumberOfWords;
                    InProgressService.updateIsReady(0);
                    APIService.apiRun({ crud: 'TrainClass' }, classData, function (response) {
                        InProgressService.updateIsReady(1);
                        var results = response;
                        $scope.addClass(results.browse_ClassName, results.selectedText, results.browse_ChunkMode, results.browse_MinimumChunkSize, results.numberOfChunks, results.totalNumberOfWords, false);

                    });
                }
                else if (angular.equals(classData.actionMode, 'SelectOnlineCorpus')) {
                    InProgressService.updateIsReady(0);
                    classData.select_RootKeys = SelectClassService.lastSelectedRootKeys;
                    APIService.apiRun({ crud: 'TrainClass' }, classData, function (response) {
                        InProgressService.updateIsReady(1);
                        var results = response;
                        $scope.addClass(results.select_ClassName, results.selectedText, 'By chapter', '', results.numberOfChunks, results.totalNumberOfWords, true);

                    });
                }
                else if (angular.equals(classData.actionMode, 'LoadStoredClass')) {
                    InProgressService.updateIsReady(0);

                    var selRootNodes = $("#classTree").dynatree("getTree").getActiveNode();
                    // Get a list of ALL selected nodes
                    // selRootNodes = $("#classTree").dynatree("getTree").getSelectedNodes(false);
                    var selRootKeys = selRootNodes.data.key;
                    classData.activeKey = selRootKeys;
                    APIService.apiRun({ crud: 'TrainClass' }, classData, function (response) {
                        InProgressService.updateIsReady(1);
                        var results = response;
                        $scope.addClass(results.select_ClassName, results.selectedText, 'unknown', '', results.numberOfChunks, results.totalNumberOfWords, true);

                    });
                }
            }

            $scope.classes = ClassService.Corpus_classes;
            $scope.$on('Corpus_classesValueUpdated', function () {
                $scope.classes = ClassService.Corpus_classes;
            });
            $scope.addClass = function (newItemName, text, mode, size, number, total, is_Bible) {
                ClassService.updateIsAllBibleValue(ClassService.isAllBible && is_Bible);
                FeatureService.updateFeaturesData({});
                ClassService.Corpus_maxId = ClassService.Corpus_maxId + 1;
                //ExperimentService.Corpus_classes.push({
                ClassService.pushCorpus_classes({
                    id: ClassService.Corpus_maxId,
                    title: newItemName,
                    selectedText: text,
                    chunkMode: mode,
                    chunkSize: size,
                    numberOfChunks: number,
                    totalNumberOfWords: total,
                    bible: is_Bible
                });

            }



            $scope.ContinueToResult = function () {
                ExperimentService.updateExperimentTypeModelValue('Classification');

                if (!$scope.featuresData || !$scope.featuresData.features || $scope.featuresData.features.length == 0) {
                    InProgressService.updateIsReady(0);
                    $scope.UpdateExtractFeaturesData();

                    APIService.apiRun({ crud: 'ExtractFeaturesClassification' }, $scope.data, function (response) {
                        var results = response;
                        $scope.featuresData = results;
                        FeatureService.updateFeaturesData($scope.featuresData);
                        InProgressService.updateIsReady(1);
                        $scope.NextToResult();
                    }, function (errorResponse) {InProgressService.setError(errorResponse.statusText);});
                }
                else {
                    $scope.NextToResult();
                }
            }
            $scope.NextToResult = function () {
                //UnknownTestClass
                var classData = SaveClassInterface; // {};
                classData.actionMode = classData.testSetActionMode;
                InProgressService.updateIsReady(0);
                if (angular.equals(classData.actionMode, 'SelectOnlineCorpus')) {
                    classData.select_RootKeys = SelectClassService.lastTestSetSelectedRootKeys;
                }

                classData.expType = 'Classification';
                APIService.apiRun({ crud: 'UnknownTestClass' }, classData, function (response) {
                    InProgressService.updateIsReady(1);
                    var results = response;
                    $scope.unknownClasses.splice(0, 1);
                    $scope.addUnknownClass(1, results.browse_ClassName, results.selectedText, results.browse_ChunkMode, results.browse_MinimumChunkSize, results.numberOfChunks);
                    ClassService.TestSet_unknown_class = $scope.unknownClasses;

                    //CV
                    $scope.Classification_ExperimentType = 'CV';
                    ClassificationService.updateClassification_ExperimentTypeValue($scope.Classification_ExperimentType);

                    AlertsService.determineAlert({ msg: 'Check validation', type: 'success' });
                    InProgressService.updateIsReady(0);
                    $scope.UpdateDataForGettingResult();

                    APIService.apiRun({ crud: 'RunClassification' }, $scope.data, function (response) {
                        //Test set
                        $scope.Classification_ExperimentType = 'TestSet';
                        ClassificationService.updateClassification_ExperimentTypeValue($scope.Classification_ExperimentType);

                        ExperimentService.updateCvResultData(response);
                        $scope.UpdateDataForGettingResult();
                        APIService.apiRun({ crud: 'RunClassification' }, $scope.data, function (response2) {
                            InProgressService.updateIsReady(1);
                            ExperimentService.tsResultData = response2;
                            $scope.TSResultData = response2;
                            $scope.testSetChunks = [];
                            var sortedResults = TreeService.treeSort($scope.TSResultData.testSetResults,
                                function(item) {
                                    return item.name.replace(/_/g,'/').replace(/.rtf$/,'');
                                });
                            $scope.TSResultData.testSetResults = sortedResults;
                            ExperimentService.tsResultData.testSetResults = sortedResults;
                            for (var testFileIndex in sortedResults) {
                                $scope.setSelectedTestFile(sortedResults[testFileIndex], testFileIndex);
                            }
                        });
                    });


                    });

            }
            $scope.CVResultData = ExperimentService.cvResultData;
            $scope.$on('cvResultDataUpdated', function () {
                $scope.CVResultData = ExperimentService.cvResultData;
            });
            $scope.TSResultData = ExperimentService.tsResultData;
            $scope.$on('tsResultDataUpdated', function () {
                alert("tsResultDataUpdated");
                $scope.TSResultData = ExperimentService.tsResultData;
                $scope.testSetChunks = [];
                for (testFileIndex in $scope.TSResultData.testSetResults) {
                    $scope.testSetChunks.push($scope.TSResultData.testSetResults[testFileIndex]);
                }
                if ($scope.testSetChunks.length > 0) {
                    $scope.data = {};
                    $scope.data.userLogin = ExperimentService.user;
                    $scope.data.index = 0;
                    $scope.currentIndex = 0;
                    APIService.apiRun({ crud: 'TestFileData' }, $scope.data, function (response) {
                        InProgressService.updateIsReady(1);
                        var results = response;
                        $scope.legend = $sce.trustAsHtml(results.legend);
                    });
                }
            });
            $scope.UpdateDataForGettingResult = function () {
                $scope.data = {};
                $scope.data.userLogin = ExperimentService.user;
                $scope.data.expType = ExperimentService.ExperimentTypeModel;
                $scope.data.expName = ExperimentService.ExperimentName;
                $scope.data.selectedAlgorithmTypeId = ExperimentService.selectedAlgorithmTypeId;
                $scope.data.selectedAlgorithmTypeName = ExperimentService.selectedAlgorithmTypeName;
                $scope.data.selectedAlgorithmTypeAttributes = ExperimentService.selectedAlgorithmTypeAttributes;
                $scope.data.classificationExperimentMode = ClassificationService.Classification_ExperimentType;
                //$scope.data.classificationCrossValidationType = ExperimentService.Classification_CrossValidationType;
                $scope.data.classificationCrossValidationFolds = ClassificationService.Classification_CrossValidationFolds;
                //$scope.data.classificationSplitRatioCrossValidation = ExperimentService.Classification_Split_ratio_cross_validation;
                $scope.data.corpusMaxId = ClassService.Corpus_maxId;

                $scope.data.featureSets = FeatureService.Feature_sets;
                $scope.data.corpusClasses = ClassService.Corpus_classes;

                $scope.data.featuresData = FeatureService.featuresData;
            }

            // CV
            $scope.Feature_sets = ExperimentService.Feature_sets;
            $scope.featuresData = ExperimentService.featuresData;


            $scope.cv_predicate = 'className';
            $scope.cv_predicate = '-maxTTest';

            //$scope.CVResultData = ExperimentService.resultData;
            $scope.$on('valuesUpdated', function () {
                //$scope.resultData = ExperimentService.resultData;
                //$scope.htmlSegmentation = $sce.trustAsHtml($scope.resultData.htmlSegmentation);

            });

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

            //TEST SET
            $scope.textAlign = 'left';
            if (ClassService.isAllBible)
                $scope.textAlign = 'right';


            $scope.Feature_sets = ExperimentService.Feature_sets;
            $scope.featuresData = ExperimentService.featuresData;

            $scope.updateCurrentFeatureListToEmpty = function () {
                $scope.tab = 1;
            }
            $scope.updateCurrentFeatureList = function () {
                $scope.tab = 2;
            }


            $scope.numberOfAppearancesInDoc = function (item) {
                return (item.numberOfAppearancesInDoc > 0);
            };


            $scope.test_predicate = 'orderByClass';

            $scope.showInProcess = InProgressService.isReady != 1;
            $scope.$on('isReady_Updated', function () {
                $scope.showInProcess = InProgressService.isReady != 1;
            });

            $scope.testSetChunks = [];
            for (testFileIndex in $scope.TSResultData.testSetResults) {
                $scope.testSetChunks.push($scope.TSResultData.testSetResults[testFileIndex]);
            }
            if ($scope.testSetChunks.length > 0) {
                $scope.data = {};
                $scope.data.userLogin = ExperimentService.user;
                $scope.data.index = 0;
                $scope.currentIndex = 0;
                APIService.apiRun({ crud: 'TestFileData' }, $scope.data, function (response) {
                    InProgressService.updateIsReady(1);
                    var results = response;
                    $scope.legend = $sce.trustAsHtml(results.legend);
                });
            }
            $scope.setSelectedTestFile = function (item, index) {

                $scope.inited = false;

                InProgressService.updateIsReady(0);

                $scope.data = {};
                $scope.data.userLogin = ExperimentService.user;
                $scope.data.index = item.index;
                $scope.currentIndex = item.index;
                APIService.apiRun({ crud: 'TestFileData' }, $scope.data, function (response) {
                    InProgressService.updateIsReady(1);
                    var results = response;
                    item.htmlText = results.htmlText;
                    item.featureList = results.features;
                    $scope.testSetChunks[index] = item;
                    $scope.legend = $sce.trustAsHtml(results.legend);

                    if ($scope.testSetChunks.length == $scope.TSResultData.testSetResults.length)
                    {
                        $scope.countFilesPerClass = [];
                        for (currentClass in $scope.classes) {
                            var l = 0;
                            for (testFile in $scope.testSetChunks) {
                                if (angular.equals($scope.testSetChunks[testFile].classifiedAs, $scope.classes[currentClass].title))
                                    l = l + 1;
                            }
                            $scope.countFilesPerClass.push(l);
                        }
                    }
                });

                $scope.inited = true;
            };
            $scope.tab = '1';
            $scope.convert2TrustAsHtml = function (text) {
                return $sce.trustAsHtml(text);
            };

            // advanced  - algorithems
            $scope.OpenSelectAlgorithm = function () {
                ngDialog.openConfirm({
                    template: 'partials/Dialogs/partial-Algorithm.html',
                    controller: 'AlgorithmDialogController',
                    className: 'ngdialog-theme-plain',
                    scope: $scope
                }).then(function (value) {
                    console.log('Modal promise resolved. Value: ', value);
                }, function (reason) {
                    console.log('Modal promise rejected. Reason: ', reason);
                });
            };
            $scope.algorithms = ExperimentService.algorithms;
            $scope.selectedAlgorithmType = ExperimentService.algorithms[ExperimentService.selectedAlgorithmTypeId];
            $scope.selectedAlgorithmTypeName = ExperimentService.selectedAlgorithmTypeName;
            $scope.$on('selectedAlgorithmTypebroadcast', function () {
                $scope.selectedAlgorithmType = ExperimentService.algorithms[ExperimentService.selectedAlgorithmTypeId];
                $scope.selectedAlgorithmTypeName = ExperimentService.selectedAlgorithmTypeName;

            });


            // feature dialog
            $scope.featuresData = FeatureService.featuresData;

            $scope.$on('featuresDataUpdated', function () {
                $scope.featuresData = FeatureService.featuresData;
            });

            $scope.OpenSelectFeatureSet = function () {
                ngDialog.openConfirm({
                    template: 'partials/Dialogs/partial-EditFeatureSetDialog.html',
                    controller: 'FeatureSetPropertiesDlgCtrl',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                }).then(function (value) {
                    console.log('Modal promise resolved. Value: ', value);
                }, function (reason) {
                    console.log('Modal promise rejected. Reason: ', reason);
                });
            };

            $scope.createThumbnail = function (chunk) {
                var dotsNail = "";
                for (i = 0; i < chunk.length / 200; i = i + 1) {
                    dotsNail += ". ";
                }
                return $sce.trustAsHtml(dotsNail);
            }

            $scope.scrollTo = function (index) {
                window.scrollTo(0, $("#section" + index)[0].offsetTop - 100);
            }
        }]
    };
});