// create the controller and inject Angular's $scope
jTextMinerApp.controller('UnmaskingController', function ($scope, ExperimentService, $location, ngDialog, AlertsService) {

    if (ExperimentService.user == 'none')
        $location.path('Login');
    

    $scope.ExperimentTypeModel = ExperimentService.ExperimentTypeModel;
    $scope.$watch('ExperimentTypeModel', function () {
        ExperimentService.updateExperimentTypeModelValue($scope.ExperimentTypeModel);
    });
    
    $scope.$on('valuesUpdated', function () {
        $scope.ExperimentTypeModel = ExperimentService.ExperimentTypeModel;
    });

    $scope.ExperimentMode = 'NewExperiment';
    $scope.Unmasking_FeatureSet = 'Default';
    $scope.Unmasking_LearningAlgorithm = 'Default';
    //Unmasking data members and watch functions
    $scope.Unmasking_NumberOfIteration = ExperimentService.Unmasking_NumberOfIteration;;
    $scope.Unmasking_NumberOfFeaturesToDelete = ExperimentService.Unmasking_NumberOfFeaturesToDelete;;
    $scope.Unmasking_RankingFeatureType = ExperimentService.Unmasking_RankingFeatureType;
    $scope.Unmasking_ChunkSize = ExperimentService.Unmasking_ChunkSize;
    $scope.Unmasking_NumberOfCrossValidation = ExperimentService.Unmasking_NumberOfCrossValidation;
    $scope.Unmasking_NumberOfTimes = ExperimentService.Unmasking_NumberOfTimes;

    $scope.$on('valuesUpdated', function () {
        //Unmasking valuesUpdated
        $scope.Unmasking_NumberOfIteration = ExperimentService.Unmasking_NumberOfIteration;;
        $scope.Unmasking_NumberOfFeaturesToDelete = ExperimentService.Unmasking_NumberOfFeaturesToDelete;;
        $scope.Unmasking_RankingFeatureType = ExperimentService.Unmasking_RankingFeatureType;
        $scope.Unmasking_ChunkSize = ExperimentService.Unmasking_ChunkSize;
        $scope.Unmasking_NumberOfCrossValidation = ExperimentService.Unmasking_NumberOfCrossValidation;
        $scope.Unmasking_NumberOfTimes = ExperimentService.Unmasking_NumberOfTimes;

    });


    $scope.Back = function () {
        $location.path('Experiment');
    }
    $scope.Next = function () {
        AlertsService.determineAlert({ msg: 'Check validation', type: 'success' });
    }

    $scope.classes = ExperimentService.Unmasking_classes;
    
    $scope.UpdateClass = function (index) {
        ngDialog.openConfirm({
            template: 'partials/Dialogs/partial-Class.html',
            controller: 'ClassDialogController',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (value) {
            alert("add class");
            console.log('Modal promise resolved. Value: ', value);
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }

    $scope.OpenSelectFeatureSet = function () {
        ngDialog.openConfirm({
            template: 'partials/Dialogs/partial-FeatureSet.html',
            controller: 'FeatureSetDialogController',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (value) {
            alert("SelectFeatureSet");
            console.log('Modal promise resolved. Value: ', value);
        }, function (reason) {
            $scope.Unmasking_FeatureSet = 'Default';
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };

    $scope.OpenSelectParametersOfAlgorithm = function () {
        ngDialog.openConfirm({
            template: 'partials/Dialogs/partial-Unmasking.html',
            controller: 'UnmaskingDialogController',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (value) {
            alert("SelectAlgorithm");
            console.log('Modal promise resolved. Value: ', value);
        }, function (reason) {
            $scope.Unmasking_LearningAlgorithm = 'Default';
            console.log('Modal promise rejected. Reason: ', reason);
        });
    };

    ExperimentService.selectedAlgorithmTypeId = 0;
    $scope.algorithms = ExperimentService.algorithms;
    $scope.selectedAlgorithmType = ExperimentService.algorithms[ExperimentService.selectedAlgorithmTypeId];
    $scope.$on('selectedAlgorithmTypebroadcast', function () {
        $scope.selectedAlgorithmType = ExperimentService.algorithms[ExperimentService.selectedAlgorithmTypeId];
        $scope.selectedAlgorithmTypeName = ExperimentService.selectedAlgorithmTypeName;

    });


});