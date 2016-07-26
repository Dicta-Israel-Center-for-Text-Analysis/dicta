
jTextMinerApp.controller('SecondTabController', function ($scope, ExperimentService, $location, focus, APIService, $filter, AlertsService, ClassificationService, FeatureService, InProgressService, ClassService, SaveClassInterface, SelectClassService, $sce, ngDialog) {
    $scope.showInProcess = InProgressService.isReady != 1;
    $scope.$on('isReady_Updated', function () {
        $scope.showInProcess = InProgressService.isReady != 1;
    });
    $scope.GoToThirdTab = function () {
        $location.path('ThirdTab');
    }

    $scope.userLogin = ExperimentService.user;

    if (ExperimentService.user == 'user')
        $location.path('Login');

    $scope.isShow = false;

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
    $scope.tTestScale = 4;
   

    $scope.beforeOther = function (avg, other, val, ttest) {
        
        if (ttest >= ($scope.tTestScale))
            return "";
        var delta = $scope.tTestScale / 20;
        var dots = Math.floor(($scope.tTestScale - ttest) / 2 / delta);
        var strDots = "";
        for (k = 0; k < dots; k = k + 1) {
            strDots += ".";
        }
        return strDots;
    }
    $scope.afterOther = function (avg, other, val, ttest) {

        if (ttest >= ($scope.tTestScale))
            return "..........";
        var delta = $scope.tTestScale / 20;
        var dots = Math.floor(ttest/2 / delta);
        var strDots = "";
        for (k = 0; k < dots; k = k + 1) {
            strDots += ".";
        }
        return strDots;
    }
    $scope.beforeClass = function (avg, other, val, ttest) {

        if (ttest >= ($scope.tTestScale))
            return "..........";
        var delta = $scope.tTestScale / 20;
        var dots = Math.floor(ttest / 2 / delta);
        var strDots = "";
        for (k = 0; k < dots; k = k + 1) {
            strDots += ".";
        }
        return strDots;
    }
    $scope.afterClass = function (avg, other, val, ttest) {

        if (ttest >= ($scope.tTestScale))
            return "";
        var delta = $scope.tTestScale / 20;
        var dots = Math.floor(($scope.tTestScale - ttest) / 2 / delta);
        var strDots = "";
        for (k = 0; k < dots; k = k + 1) {
            strDots += ".";
        }
        return strDots;
    }
    $scope.beforeClassBeforeStar = function (avg, other, val) {
        
        if (val >= avg)
            return ".......";
        var delta = (avg - other) / 10;
        var dots = Math.floor((val - other)/delta);  
        var strDots = "";
        for (k = 0; k < dots; k = k + 1) {
            strDots += ".";
        }
        
        return strDots;
    }
    $scope.beforeClassAfterStar = function (avg, other, val) {
        if (val >= avg)
            return ".......";
        var delta = (avg - other) / 10;
        var dots = Math.floor((avg - val) / delta);
        var strDots = "";
        for (k = 0; k < dots; k = k + 1) {
            strDots += ".";
        }
        return strDots;
    }
    $scope.afterClassBeforeStar = function (avg, other, val) {
        if (val < avg)
            return ".......";
        var delta = (avg - other) / 10;
        if ((delta*10 <= (val - avg)))
            return "..........";
        var dots = Math.floor((val - avg) / delta);
        var strDots = "";
        for (k = 0; k < dots; k = k + 1) {
            strDots += ".";
        }
        return strDots;
    }
    $scope.afterClassAfterStar = function (avg, other, val) {
        if (val < avg)
            return ".......";
        var delta = (avg - other) / 10;
        if ((delta * 10 <= (val - avg)))
            return "";
        var dots = Math.floor((delta * 10 - (val - avg)) / delta);
        var strDots = "";
        for (k = 0; k < dots; k = k + 1) {
            strDots += ".";
        }
        return strDots;
    }
    $scope.objArrayContains = function (arr, keyName, val) {
        return $scope.colors(arr.map(function (a) { return a[keyName]; }).indexOf(val));
    };

    $scope.GoToFirstTab = function () {
        $location.path('FirstTab');
    }

    $scope.StartNewExperiment = function () {
        $scope.ExperimentMode = 'NewExperiment';
        ExperimentService.NewExperiment();
    }
    $scope.NewExperimentName = ExperimentService.NewExperimentName;

    $scope.SaveExperiment = function () {
        ngDialog.openConfirm({
            template: 'partials/Dialogs/partial-SaveAs.html',
            controller: 'SaveAsController',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (value) {
            console.log('Modal promise resolved. Value: ', value);
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }


    if (ExperimentService.user == 'none')
        $location.path('Login');

    $scope.ContinueToAddClass = function (actionMode) {

        $scope.showClassDialog = true;

        ClassService.updateClassName('class ' + ClassService.Corpus_maxId);

        var selRootNodes = $("#trainTree").dynatree("getTree").getSelectedNodes(true);
        // Get a list of ALL selected nodes
        selRootNodes = $("#trainTree").dynatree("getTree").getSelectedNodes(false);

        var selRootKeys = $.map(selRootNodes, function (node) {
            return node.data.key;
        });
        for (var i in selRootKeys) {
            $("#trainTree").dynatree("getTree").getNodeByKey(selRootKeys[i]).select(false);
        }

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

    }

    $scope.saveClass = function () {
        $scope.showClassDialog = false;
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
        if (!$scope.featuresData || !$scope.featuresData.features || $scope.featuresData.features.length == 0) {
            InProgressService.updateIsReady(0);
            $scope.UpdateExtractFeaturesData();

            APIService.apiRun({ crud: 'Extract' }, $scope.data, function (response) {
                var results = response;
                $scope.featuresData = results;
                FeatureService.updateFeaturesData($scope.featuresData);
                InProgressService.updateIsReady(1);
                $scope.NextToResult();
            });
        }
        else {
            $scope.NextToResult();
        }
    }
    $scope.NextToResult = function () {
        //UnknownTestClass
        var classData = SaveClassInterface; // {};
        InProgressService.updateIsReady(0);
        if (angular.equals(classData.actionMode, 'SelectOnlineCorpus')) {
            classData.select_RootKeys = SelectClassService.lastTestSetSelectedRootKeys;
        }

        classData.expType = 'Segmentation';
        APIService.apiRun({ crud: 'UnknownTestClass' }, classData, function (response) {
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
                        for (testFileIndex in $scope.TSResultData.testSetResults) {
                            $scope.setSelectedTestFile($scope.TSResultData.testSetResults[testFileIndex], testFileIndex);
                        }

                    });
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
        $scope.TSResultData = ExperimentService.tsResultData;
        $scope.testSetChunks = [];
        for (testFileIndex in $scope.TSResultData.testSetResults) {
            $scope.testSetChunks.push($scope.TSResultData.testSetResults[testFileIndex]);
        }
        if ($scope.testSetChunks.length > 0)
        {
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
            $scope.testSetChunks.push(item);

            $scope.legend = $sce.trustAsHtml(results.legend);


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
            template: 'partials/Dialogs/partial-FeatureSet.html',
            controller: 'FeatureSetDialogController',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (value) {
            console.log('Modal promise resolved. Value: ', value);
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };
    
});

