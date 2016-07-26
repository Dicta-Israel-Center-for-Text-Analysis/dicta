// create the controller and inject Angular's $scope
jTextMinerApp.controller('FeatureSetDialogController', function ($scope, ngDialog, ExperimentService, APIService, $filter, focus, FeatureService, InProgressService) {
    
    $scope.showInProcess = ExperimentService.isReady != 1;
    $scope.$on('isReady_Updated', function () {
        $scope.showInProcess = ExperimentService.isReady != 1;
    });
    
    
    $scope.Feature_sets = FeatureService.Feature_sets;
    $scope.$on('featureSetDataUpdated', function () {
        $scope.Feature_sets = FeatureService.Feature_sets;
        $scope.featuresData = FeatureService.featuresData;
    });

    $scope.featuresData = FeatureService.featuresData;
    $scope.$watch('featuresData', function () {
        if (!angular.isUndefined($scope.featuresData)) {
            FeatureService.updateFeaturesData($scope.featuresData);
        }
    });
    
    $scope.resultData = ExperimentService.resultData;
    $scope.$watch('resultData', function () {
        if (!angular.isUndefined($scope.resultData)) {
            ExperimentService.updateResultData($scope.resultData);
            if ($scope.resultData.length != []) {
                if (ExperimentService.ExperimentTypeModel == 'Unmasking')
                    $location.path('Chart');
                else //https://docs.angularjs.org/guide/$location
                    $location.path('Results');
            }
        }
    });

    $scope.UpdateData = function () {
        $scope.data = {};
        $scope.data.userLogin = ExperimentService.user;
        $scope.data.expType = ExperimentService.ExperimentTypeModel;


        $scope.data.expName = ExperimentService.ExperimentName;

        $scope.data.featureSets = FeatureService.Feature_sets;
        $scope.data.corpusClasses = ExperimentService.Corpus_classes;

        $scope.data.featuresData = FeatureService.featuresData;

    }
    $scope.AddFeatureSet = function () {
        ngDialog.openConfirm({
            template: 'partials/Dialogs/partial-AddFeatureSet.html',
            controller: 'AddFeatureSetDialogController',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (value) {
            $scope.featuresData = {};
            console.log('Modal promise resolved. Value: ', value);
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
    }
    $scope.ExtractFeatures = function () {
        InProgressService.updateIsReady(0);
        $scope.UpdateData();

        APIService.apiRun({ crud: 'Extract' }, $scope.data, function (response) {
            InProgressService.updateIsReady(1);
            var results = response;
            $scope.featuresData = results;
            FeatureService.updateFeaturesData(results);
            focus('focusIndexTop');

        });
    }

    $scope.predicate = '-maxTTest';

    $scope.TotalNumberOfFeatures = FeatureService.totalNumberOfFeatures;
    $scope.$on('totalNumberOfFeaturesUpdated', function () {
        $scope.TotalNumberOfFeatures = FeatureService.totalNumberOfFeatures;
    });

    $scope.checkAll = function () {
        for (var i = 0; i < $scope.featuresData.features.length; i++) {
            $scope.featuresData.features[i].selected = true;
        }
        FeatureService.updateFeaturesData($scope.featuresData);
    };
    $scope.uncheckAll = function () {
        for (var i = 0; i < $scope.featuresData.features.length; i++) {
            $scope.featuresData.features[i].selected = false;
        }
        FeatureService.updateFeaturesData($scope.featuresData);
    };
    $scope.checkTTest = function () {
        for (var i = 0; i < $scope.featuresData.features.length; i++) {
            if ($scope.featuresData.features[i].maxTTest >= 2)
                $scope.featuresData.features[i].selected = true;
            else
                $scope.featuresData.features[i].selected = false;
        }
        FeatureService.updateFeaturesData($scope.featuresData);
    };
    $scope.indexTop = 200;
    $scope.checkMostTop = function () {
        var count = 0;
        var features = $filter('orderBy')($scope.featuresData.features, $scope.predicate, $scope.reverse);
        //featuresData.features | orderBy:predicate:reverse;
        for (var i = 0; i < features.length; i++) {
            if (count < $scope.indexTop)
                features[i].selected = true;
            else
                features[i].selected = false;
            count++;
        }
        FeatureService.updateFeaturesData($scope.featuresData);
    };
    
});