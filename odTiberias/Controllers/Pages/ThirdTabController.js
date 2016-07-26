
jTextMinerApp.controller('ThirdTabController', function (
    $scope, ExperimentService, $location, focus, APIService, $filter, AlertsService, SegmentationService, FeatureService, InProgressService, ClassService, SaveClassInterface, SelectClassService, $sce, ngDialog) {
                                                                       

    $scope.userLogin = ExperimentService.user;

    if (ExperimentService.user == 'user')
        $location.path('Login');

    $scope.showInProcess = InProgressService.isReady != 1;
    $scope.$on('isReady_Updated', function () {
        $scope.showInProcess = InProgressService.isReady != 1;
    });

    $scope.GoToFirstTab = function () {
        $location.path('FirstTab');
    }
    $scope.GoToSecondTab = function () {
        $location.path('SecondTab');
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

    $scope.ExperimentTypeModel = ExperimentService.ExperimentTypeModel;
    $scope.$watch('ExperimentTypeModel', function () {
        ExperimentService.updateExperimentTypeModelValue($scope.ExperimentTypeModel);
    });

    $scope.$on('valuesUpdated', function () {
        $scope.ExperimentTypeModel = ExperimentService.ExperimentTypeModel;
    });

    //Segmentation data members and watch functions
    $scope.Segmentation_ChunkBy = SegmentationService.Segmentation_ChunkBy;
    $scope.Segmentation_SplitString = SegmentationService.Segmentation_SplitString;
    $scope.Segmentation_NumberOfSentencePerChunk = SegmentationService.Segmentation_NumberOfSentencePerChunk;
    $scope.Segmentation_SimilarityType = SegmentationService.Segmentation_SimilarityType;
    $scope.Segmentation_NumberOfClusters = SegmentationService.Segmentation_NumberOfClusters;
    $scope.Segmentation_CoreDocs = SegmentationService.Segmentation_CoreDocs;
    $scope.Segmentation_NumberOfWordsInFeatureSet = SegmentationService.Segmentation_NumberOfWordsInFeatureSet;
    $scope.Segmentation_NumberOfSentencesLockedIn = SegmentationService.Segmentation_NumberOfSentencesLockedIn;

    $scope.$watch('Segmentation_ChunkBy', function () {
        SegmentationService.updateSegmentation_ChunkByValue($scope.Segmentation_ChunkBy);
    });
    $scope.$watch('Segmentation_SplitString', function () {
        SegmentationService.updateSegmentation_SplitStringValue($scope.Segmentation_SplitString);
    });
    $scope.$watch('Segmentation_NumberOfSentencePerChunk', function () {
        SegmentationService.updateSegmentation_NumberOfSentencePerChunkValue($scope.Segmentation_NumberOfSentencePerChunk);
    });
    $scope.$watch('Segmentation_SimilarityType', function () {
        SegmentationService.updateSegmentation_SimilarityTypeValue($scope.Segmentation_SimilarityType);
    });
    $scope.$watch('Segmentation_NumberOfClusters', function () {
        SegmentationService.updateSegmentation_NumberOfClustersValue($scope.Segmentation_NumberOfClusters);
    });
    $scope.$watch('Segmentation_CoreDocs', function () {
        SegmentationService.updateSegmentation_CoreDocsValue($scope.Segmentation_CoreDocs);
    });
    $scope.$watch('Segmentation_NumberOfWordsInFeatureSet', function () {
        SegmentationService.updateSegmentation_NumberOfWordsInFeatureSetValue($scope.Segmentation_NumberOfWordsInFeatureSet);
    });
    $scope.$watch('Segmentation_NumberOfSentencesLockedIn', function () {
        //alert($scope.Segmentation_NumberOfSentencesLockedIn);
        SegmentationService.updateSegmentation_NumberOfSentencesLockedInValue($scope.Segmentation_NumberOfSentencesLockedIn);
    });
    $scope.$on('SegmentationValuesUpdated', function () {
        //Segmentation valuesUpdated
        $scope.Segmentation_ChunkBy = SegmentationService.Segmentation_ChunkBy;
        $scope.Segmentation_SplitString = SegmentationService.Segmentation_SplitString;
        $scope.Segmentation_NumberOfSentencePerChunk = SegmentationService.Segmentation_NumberOfSentencePerChunk;
        $scope.Segmentation_SimilarityType = SegmentationService.Segmentation_SimilarityType;
        $scope.Segmentation_NumberOfClusters = SegmentationService.Segmentation_NumberOfClusters;
        $scope.Segmentation_CoreDocs = SegmentationService.Segmentation_CoreDocs;
        $scope.Segmentation_NumberOfWordsInFeatureSet = SegmentationService.Segmentation_NumberOfWordsInFeatureSet;
        $scope.Segmentation_NumberOfSentencesLockedIn = SegmentationService.Segmentation_NumberOfSentencesLockedIn;

    });

    $scope.UpdateDataForExtract = function () {
        $scope.dataExtract = {};
        $scope.dataExtract.userLogin = ExperimentService.user;
        $scope.dataExtract.expType = ExperimentService.ExperimentTypeModel;


        $scope.dataExtract.expName = ExperimentService.ExperimentName;

        $scope.dataExtract.featureSets = FeatureService.Feature_sets;
        $scope.dataExtract.corpusClasses = ClassService.Corpus_classes;

        $scope.dataExtract.featuresData = FeatureService.featuresData;

        $scope.dataExtract.segmentationActionMode = SegmentationService.Segmentation_ActionMode;
        $scope.dataExtract.segmentationChunkBy = SegmentationService.Segmentation_ChunkBy;

        InProgressService.updateIsReady(0);

        $scope.dataExtract.select_RootKeys = SelectClassService.lastSelectedRootKeys;
    }


    $scope.UpdateDataForRun = function () {
        $scope.dataRun = {};
        $scope.dataRun.userLogin = ExperimentService.user;
        $scope.dataRun.expType = ExperimentService.ExperimentTypeModel;
        $scope.dataRun.expName = ExperimentService.ExperimentName;
        $scope.dataRun.selectedAlgorithmTypeId = ExperimentService.selectedAlgorithmTypeId;
        $scope.dataRun.selectedAlgorithmTypeName = ExperimentService.selectedAlgorithmTypeName;
        $scope.dataRun.selectedAlgorithmTypeAttributes = ExperimentService.selectedAlgorithmTypeAttributes;

        $scope.dataRun.featureSets = FeatureService.Feature_sets;

        $scope.dataRun.featuresData = FeatureService.featuresData;


        $scope.dataRun.segmentationActionMode = SegmentationService.Segmentation_ActionMode;
        $scope.dataRun.segmentationChunkBy = SegmentationService.Segmentation_ChunkBy;
        $scope.dataRun.segmentationSplitString = SegmentationService.Segmentation_SplitString;;
        $scope.dataRun.segmentationNumberOfSentencePerChunk = SegmentationService.Segmentation_NumberOfSentencePerChunk;;
        $scope.dataRun.segmentationSimilarityType = SegmentationService.Segmentation_SimilarityType;
        $scope.dataRun.segmentationNumberOfClusters = SegmentationService.Segmentation_NumberOfClusters;
        $scope.dataRun.segmentationCoreDocs = SegmentationService.Segmentation_CoreDocs;
        $scope.dataRun.segmentationNumberOfWordsInFeatureSet = SegmentationService.Segmentation_NumberOfWordsInFeatureSet;
        $scope.dataRun.segmentationNumberOfSentencesLockedIn = SegmentationService.Segmentation_NumberOfSentencesLockedIn;

    }

    $scope.RunExperiment = function () {
        AlertsService.determineAlert({ msg: 'Check validation', type: 'success' });
        $scope.showClassDialog = false;
        InProgressService.updateIsReady(0);

        /*
        if (angular.equals($scope.data.actionMode, 'SelectOnlineCorpus')) {
            var selRootNodes = $("#trainTree").dynatree("getTree").getSelectedNodes(true);
            // Get a list of ALL selected nodes
            selRootNodes = $("#trainTree").dynatree("getTree").getSelectedNodes(false);
            var selRootKeys = $.map(selRootNodes, function (node) {
                return node.data.key;
            });
            $scope.data.select_RootKeys = selRootKeys;
        }*/

        ExperimentService.updateExperimentTypeModelValue('Segmentation');

        //UnknownTestClass
        var classData = SaveClassInterface; // {};
        InProgressService.updateIsReady(0);
        if (angular.equals(classData.actionMode, 'SelectOnlineCorpus')) {
            classData.select_RootKeys = SelectClassService.lastTestSetSelectedRootKeys;
        }

        classData.expType = 'Segmentation';
        APIService.apiRun({ crud: 'UnknownTestClass' }, classData, function (response) {
            $scope.UpdateDataForExtract();

            APIService.apiRun({ crud: 'Extract' }, $scope.dataExtract, function (response) {
                var results = response;
                $scope.featuresData = results;
                $scope.UpdateDataForRun();
                InProgressService.updateIsReady(0);

                APIService.apiRun({ crud: 'RunSegmentation' }, $scope.dataRun, function (response) {
                    InProgressService.updateIsReady(1);
                    var results = response;
                    $scope.resultData = results;
                });

            });
        });

        

    }

    $scope.resultData = ExperimentService.resultData;
    $scope.$watch('resultData', function () {
        if (!angular.isUndefined($scope.resultData)) {
            ExperimentService.updateResultData($scope.resultData);
            if ($scope.resultData.length != []) {
                $scope.htmlSegmentation = $sce.trustAsHtml($scope.resultData.htmlSegmentation);
                //$location.path('ResultsSegmentation');
            }
        }
    });
    
});

