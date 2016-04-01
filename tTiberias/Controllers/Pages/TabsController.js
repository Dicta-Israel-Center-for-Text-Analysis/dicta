﻿// create the controller and inject Angular's $scope
jTextMinerApp.controller('TabsController', function ($scope, ExperimentService, $location, focus, APIService, $filter, AlertsService, ClassificationService, FeatureService, InProgressService, ClassService, SaveClassInterface, SelectClassService, $sce) {

    if (ExperimentService.user == 'none')
        $location.path('Login');

    //http://stackoverflow.com/questions/19781004/tabs-with-angular-loading-tab-content-on-click-only-with-http
    $scope.tabs = [
    { title: "AJAX Tab 1", content: ["line 1", "line 2"], active: true },
    { title: "Another AJAX tab", content: ["row 1", "row 2"] }
    ];


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


    $scope.StartNewExperiment = function () {
        $scope.ExperimentMode = 'NewExperiment';
        $scope.NextToNew();
    }

    $scope.NextToNew = function () {
        if ($scope.ExperimentMode == 'NewExperiment' && $scope.NewExperimentName.length == 0)
            AlertsService.determineAlert({ msg: 'Please give a name for new experiment.', type: 'danger' });
        else {
            if (($scope.ExperimentMode == 'UploadStoredExperiment' && $scope.StoredExperimentName.length == 0)) {
                AlertsService.determineAlert({ msg: 'Please choose stored experiment', type: 'danger' });
            }
            else {
                InProgressService.updateIsReady(0);

                if ($scope.ExperimentMode == 'NewExperiment') {
                    ExperimentService.updateNewExperimentName($scope.NewExperimentName);

                    $scope.data = {};
                    $scope.data.userLogin = ExperimentService.user;
                    $scope.data.expType = ExperimentService.ExperimentTypeModel;

                    // http://www.aspsnippets.com/Articles/AngularJS-Get-and-display-Current-Date-and-Time.aspx
                    var date = new Date();
                    $scope.formatedDate = $filter('date')(new Date(), 'dd.MM.yyyy HH-mm-ss');

                    //ExperimentService.ExperimentName += ' ' + $scope.formatedDate;
                    $scope.data.expName = ExperimentService.ExperimentName;

                    APIService.apiRun({ crud: 'NewExperiment' }, $scope.data, function (response) {
                        InProgressService.updateIsReady(1);

                        if (response.userLogin.length != 0) {
                            AlertsService.determineAlert({ msg: 'NewExperiment', type: 'success' });
                            $location.path($scope.ExperimentTypeModel);
                        }
                        else
                            AlertsService.determineAlert({ msg: 'There is such exp name', type: 'success' });
                    });
                }
                else {
                    ExperimentService.updateStoredExperimentName($scope.StoredExperimentName);

                    $scope.data = {};
                    $scope.data.userLogin = ExperimentService.user;
                    $scope.data.expType = ExperimentService.ExperimentTypeModel;
                    $scope.data.expName = ExperimentService.ExperimentName;

                    APIService.apiRun({ crud: 'DownloadStoredExperiment' }, $scope.data, function (response) {
                        InProgressService.updateIsReady(1);
                        AlertsService.determineAlert({ msg: 'DownloadStoredExperiment', type: 'success' });
                        $scope.UpdateDataForNewExperiment(response);
                        FeatureService.updateTotalNumberOfFeatures(null);
                        $scope.UpdateExtractFeaturesData();
                        APIService.apiRun({ crud: 'Extract' }, $scope.data, function (response) {
                            var results = response;
                            $location.path($scope.ExperimentTypeModel);
                        });

                    });
                }

            }
        }
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
    $scope.UpdateExtractFeaturesData = function () {
        $scope.data = {};
        $scope.data.userLogin = ExperimentService.user;
        $scope.data.expType = ExperimentService.ExperimentTypeModel;


        $scope.data.expName = ExperimentService.ExperimentName;

        $scope.data.featureSets = FeatureService.Feature_sets;
        $scope.data.corpusClasses = ClassService.Corpus_classes;

        $scope.data.featuresData = FeatureService.featuresData;

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


    $scope.UpdateExtractFeaturesData = function () {
        $scope.data = {};
        $scope.data.userLogin = ExperimentService.user;
        $scope.data.expType = ExperimentService.ExperimentTypeModel;


        $scope.data.expName = ExperimentService.ExperimentName;

        $scope.data.featureSets = FeatureService.Feature_sets;
        $scope.data.corpusClasses = ClassService.Corpus_classes;

        $scope.data.featuresData = FeatureService.featuresData;

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
        $scope.Classification_ExperimentType = 'CV';
        ClassificationService.updateClassification_ExperimentTypeValue($scope.Classification_ExperimentType);
        if ($scope.Classification_ExperimentType == 'TestSet')
            $location.path('TestSet');
        else {
            AlertsService.determineAlert({ msg: 'Check validation', type: 'success' });
            InProgressService.updateIsReady(0);
            $scope.UpdateDataForGettingResult();

            APIService.apiRun({ crud: 'RunClassification' }, $scope.data, function (response) {
                $scope.Classification_ExperimentType = 'TestSet';
                ClassificationService.updateClassification_ExperimentTypeValue($scope.Classification_ExperimentType);
                $scope.CVResultData = response;
                $scope.UpdateDataForGettingResult();
                APIService.apiRun({ crud: 'RunClassification' }, $scope.data, function (response2) {
                    InProgressService.updateIsReady(1);
                    $scope.TSResultData = response2;
                    $scope.setSelectedTestFile($scope.TSResultData.testSetResults[0], 0);
                });
            });
        }
    }

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

    $scope.CVResultData = ExperimentService.resultData;
    $scope.$on('valuesUpdated', function () {
        //$scope.resultData = ExperimentService.resultData;
        //$scope.htmlSegmentation = $sce.trustAsHtml($scope.resultData.htmlSegmentation);

    });



    //TEST SET
    $scope.textAlign = 'left';
    if (ClassService.isAllBible)
        $scope.textAlign = 'right';


    $scope.Feature_sets = ExperimentService.Feature_sets;
    $scope.featuresData = ExperimentService.featuresData;

    $scope.updateCurrentFeatureListToEmpty = function () {

        $scope.currentFeatureList = [];
    }
    $scope.updateCurrentFeatureList = function () {

        $scope.currentFeatureList = $scope.tempFeatureList;
        /*
                $scope.data = {};
                $scope.data.userLogin = ExperimentService.user;
                $scope.data.index = $scope.currentIndex;
                APIService.apiRun({ crud: 'TestFileData' }, $scope.data, function (response) {
                    var results = response;
                    $scope.currentTestFileText = $sce.trustAsHtml(results.htmlText);
                    $scope.legend = $sce.trustAsHtml(results.legend);
                    $scope.currentFeatureList = results.features;
                });
         */
    }


    $scope.numberOfAppearancesInDoc = function (item) {
        return (item.numberOfAppearancesInDoc > 0);
    };


    $scope.test_predicate = 'orderByClass';

    $scope.showInProcess = InProgressService.isReady != 1;
    $scope.$on('isReady_Updated', function () {
        $scope.showInProcess = InProgressService.isReady != 1;
    });

    // select test file
    $scope.selectedTestFileIndex = -1;
    $scope.$watch('selectedTestFileIndex', function () {
        if (!angular.isUndefined($scope.selectedTestFileIndex)) {
            ExperimentService.updateSelectedTestFileIndex($scope.selectedTestFileIndex);
        }
    });

    $scope.selectedTestFile = null;
    $scope.selectedTestFileValue = '';

    $scope.isSelected = function (item) {
        if ($scope.selectedTestFile) {
            return $scope.selectedTestFile === item;
        }
        else {
            return false;
        }
    };

    $scope.currentTestFileText = $sce.trustAsHtml("<b><p style='color:red;'>Select a test file from left side in order to see the text</p></b>");

    $scope.setSelectedTestFile = function (item, index) {

        $scope.inited = false;

        $scope.selectedTestFileIndex = index;

        $scope.selectedTestFile = item;
        $scope.selectedTestFileValue = item.name;

        InProgressService.updateIsReady(0);

        $scope.data = {};
        $scope.data.userLogin = ExperimentService.user;
        $scope.data.index = item.index;
        $scope.currentIndex = item.index;
        APIService.apiRun({ crud: 'TestFileData' }, $scope.data, function (response) {
            InProgressService.updateIsReady(1);
            var results = response;
            $scope.currentTestFileText = $sce.trustAsHtml(results.htmlText);
            $scope.legend = $sce.trustAsHtml(results.legend);

            $scope.tempFeatureList = results.features;
            if ($scope.tab === '1')
                $scope.currentFeatureList = [];
            else {
                if ($scope.tab === '2')
                    $scope.currentFeatureList = $scope.tempFeatureList;
            }
        });

        $scope.inited = true;
    };
    $scope.tab = '1';
    
});