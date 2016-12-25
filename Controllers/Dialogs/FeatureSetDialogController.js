// create the controller and inject Angular's $scope
jTextMinerApp.controller('FeatureSetDialogController', function ($scope, ngDialog, ExperimentService, APIService, $filter, focus, ClassificationService, InProgressService, UserService) {
    
    $scope.showInProcess = ExperimentService.isReady != 1;
    $scope.$on('isReady_Updated', function () {
        $scope.showInProcess = ExperimentService.isReady != 1;
    });
    
    
    $scope.Feature_sets = ClassificationService.featureCollection.Feature_sets;
    $scope.$on('featureSetDataUpdated', function () {
        $scope.Feature_sets = ClassificationService.featureCollection.Feature_sets;
        $scope.featuresData = ClassificationService.featureCollection.featuresData;
    });

    $scope.featuresData = ClassificationService.featureCollection.featuresData;
    $scope.$watch('featuresData', function () {
        if (!angular.isUndefined($scope.featuresData)) {
            ClassificationService.featureCollection.updateFeaturesData($scope.featuresData);
        }
    });

    $scope.UpdateData = function () {
        $scope.data = {};
        $scope.data.userLogin = UserService.user;
        $scope.data.expType = 'Classification';


        $scope.data.expName = ExperimentService.ExperimentName;

        $scope.data.featureSets = ClassificationService.featureCollection.Feature_sets;
        $scope.data.corpusClasses = ExperimentService.Corpus_classes;

        $scope.data.featuresData = ClassificationService.featureCollection.featuresData;

    }
    $scope.AddFeatureSet = function () {
        ngDialog.openConfirm({
            template: '<edit-feature-set-dialog></edit-feature-set-dialog>',
            plain: true,
            className: 'ngdialog-theme-default',
            closeByEscape: true,
            closeByDocument: true,
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
            ClassificationService.featureCollection.updateFeaturesData(results);
            focus('focusIndexTop');

        });
    }

    $scope.predicate = '-maxTTest';

    $scope.TotalNumberOfFeatures = ClassificationService.featureCollection.totalNumberOfFeatures;
    $scope.$on('totalNumberOfFeaturesUpdated', function () {
        $scope.TotalNumberOfFeatures = ClassificationService.featureCollection.totalNumberOfFeatures;
    });

    $scope.checkAll = function () {
        for (var i = 0; i < $scope.featuresData.features.length; i++) {
            $scope.featuresData.features[i].selected = true;
        }
        ClassificationService.featureCollection.updateFeaturesData($scope.featuresData);
    };
    $scope.uncheckAll = function () {
        for (var i = 0; i < $scope.featuresData.features.length; i++) {
            $scope.featuresData.features[i].selected = false;
        }
        ClassificationService.featureCollection.updateFeaturesData($scope.featuresData);
    };
    $scope.checkTTest = function () {
        for (var i = 0; i < $scope.featuresData.features.length; i++) {
            if ($scope.featuresData.features[i].maxTTest >= 2)
                $scope.featuresData.features[i].selected = true;
            else
                $scope.featuresData.features[i].selected = false;
        }
        ClassificationService.featureCollection.updateFeaturesData($scope.featuresData);
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
        ClassificationService.featureCollection.updateFeaturesData($scope.featuresData);
    };
    
});