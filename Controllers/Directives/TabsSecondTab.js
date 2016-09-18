jTextMinerApp.directive('tabsSecondTab', function () {
    return {
        restrict: 'AE',
        templateUrl: 'partials/templates/TabsSecondTab.html',
        controller: ['$scope', '$rootScope', 'ExperimentService', '$location', 'focus', 'APIService', '$filter', 'AlertsService', 'ClassificationService', 'InProgressService', 'ClassService', 'SaveClassInterface', 'SelectClassService', '$sce', 'ngDialog', 'TreeService', 'BrowseClassService', function ($scope, $rootScope, ExperimentService, $location, focus, APIService, $filter, AlertsService, ClassificationService, InProgressService, ClassService, SaveClassInterface, SelectClassService, $sce, ngDialog, TreeService, BrowseClassService) {
            $scope.showInProcess = InProgressService.isReady != 1;
            $scope.$on('isReady_Updated', function () {
                $scope.showInProcess = InProgressService.isReady != 1;
            });
            $scope.countFilesPerClass = [];
            
            $scope.colors = ClassService.colors;
            $scope.indexOfColor = function (val) {
                var l = $scope.classes.length;
                for (k = 0; k < l; k = k + 1) {
                    if (angular.equals($scope.classes[k].title, val)) {
                        return $scope.colors[k];
                    }
                }
                return "Grey";
            }

            $scope.classNameToColor = ClassService.classNameToColor;

            // someone pressed the "Add Class" button, so show the dialog
            $scope.ContinueToAddClass = function (actionMode) {

                $rootScope.$broadcast('lastSelectedRootKeys', []);
                $scope.showAddClassDialog = true;

                ClassService.updateClassName('class ' + ClassService.Corpus_maxId);

                ClassService.updateExperimentActionMode(actionMode);
                //$scope.Next();
            };

            // set all the different data structures that hold classification data based on a saved data structure
            $scope.UpdateDataForNewExperiment = function (data) {
                //ExperimentService.updateExperimentModeValue();
                ExperimentService.updateExperimentTypeModelValue(data.expType);
                ExperimentService.updateExperimentName(data.expName);

                ExperimentService.updateselectedAlgorithmTypeValue(data.selectedAlgorithmTypeId, data.selectedAlgorithmTypeName, data.selectedAlgorithmTypeAttributes);

                ClassificationService.updateClassification_ExperimentTypeValue(data.classificationExperimentMode);
                ClassificationService.updateClassification_CrossValidationFoldsValue(data.classificationCrossValidationFolds);

                ClassService.Corpus_maxId = data.corpusMaxId;

                ClassificationService.featureCollection.Feature_sets = data.featureSets;
                ClassService.Corpus_classes = data.corpusClasses;

                ClassificationService.featureCollection.updateFeaturesData(data.featuresData);
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
                ClassificationService.featureCollection.updateFeaturesData({});
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

            $scope.runClassification = function () {
                $scope.countFilesPerClass = [];
                $scope.testSetChunks = [];

                ClassificationService.runClassification()
                    .then(function (response2) {
                    $scope.testSetResults = response2.testSetResults;
                    $scope.testSetChunks = [];
                    for (var testFileIndex in $scope.testSetResults) {
                        $scope.setSelectedTestFile($scope.testSetResults[testFileIndex], testFileIndex);
                    }
                });
            }

            $scope.CVResultData = ExperimentService.cvResultData;
            $scope.$on('cvResultDataUpdated', function () {
                $scope.CVResultData = ExperimentService.cvResultData;
            });
            $scope.TSResultData = ExperimentService.tsResultData;
            $scope.$on('tsResultDataUpdated', function () {
                alert("tsResultDataUpdated");
                $scope.testSetResults = ExperimentService.tsResultData.testSetResults;
                $scope.testSetChunks = [];
                for (testFileIndex in $scope.testSetResults) {
                    $scope.testSetChunks.push($scope.testSetResults[testFileIndex]);
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
            for (testFileIndex in $scope.testSetResults) {
                $scope.testSetChunks.push($scope.testSetResults[testFileIndex]);
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

            function cleanTitle(name){
                var trimmed = name.replace(/.rtf$/,'');
                // there's not going to be anything left if this is the only key
                if (trimmed.length == SelectClassService.testSetTitlesCommonPrefix.length) {
                    return trimmed.substring(trimmed.lastIndexOf('_') + 1);
                }
                else {
                    return trimmed.substring((SelectClassService.testSetTitlesCommonPrefix.length + 1));
                }
            }

            function prettyPrintMorphologyClassification(html) {
                function prettyPrintWord(word) {
                    return '[' + prettyPrintMorphology(word) + ']';
                }
                if (/@#BASEFORM/.test(html)) {
                    return html.replace(/(@#[A-Z_0-9#]*)/g, prettyPrintWord);
                }
                return html;
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
                    item.htmlText = prettyPrintMorphologyClassification(results.htmlText);
                    item.featureList = results.features;
                    item.title = cleanTitle(item.name);
                    $scope.testSetChunks[index] = item;
                    $scope.legend = $sce.trustAsHtml(results.legend);

                    if ($scope.testSetChunks.length == $scope.testSetResults.length)
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
            $scope.featuresData = ClassificationService.featureCollection.featuresData;
            $scope.featureCollection = ClassificationService.featureCollection;

            $scope.$on('featuresDataUpdated', function () {
                $scope.featuresData = ClassificationService.featureCollection.featuresData;
            });

            $scope.OpenSelectFeatureSet = function () {
                ngDialog.openConfirm({
                    template: 'partials/Dialogs/partial-EditFeatureSetDialog.html',
                    controller: 'EditFeatureSetDialogController',
                    className: 'ngdialog-theme-default override-background',
                    data: { featureCollection: ClassificationService.featureCollection },
                    closeByEscape: true,
                    closeByDocument: true,
                    scope: $scope
                }).then(function (value) {
                    tiberias_tour_pause();
                }, function (reason) {
                    tiberias_tour_pause();
                });
            };

            $scope.createThumbnail = function (chunk) {
                if (chunk == null)
                    return "";
                var dotsNail = "";
                for (i = 0; i < chunk.length / 200; i = i + 1) {
                    dotsNail += ". ";
                }
                return $sce.trustAsHtml(dotsNail);
            };

            $scope.scrollTo = function (index) {
                window.scrollTo(0, $("#section" + index)[0].offsetTop - 100);
            };

            $scope.convertFeatureName = function (featureName) {
                var converted = featureName;
                if (converted.indexOf('_') > -1) {
                    converted = prettyPrintMorphology(converted);
                }
                return converted;
            }
        }]
    };
});
