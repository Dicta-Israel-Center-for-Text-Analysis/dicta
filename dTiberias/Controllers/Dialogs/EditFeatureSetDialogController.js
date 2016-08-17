// create the controller and inject Angular's $scope
jTextMinerApp.controller('EditFeatureSetDialogController', function ($scope, ngDialog, InProgressService, APIService, FeatureService, ClassService) {
    
    $scope.showInProcess = InProgressService.isReady != 1;
    $scope.$on('isReady_Updated', function () {
        $scope.showInProcess = InProgressService.isReady != 1;
    });

    $scope.isAllBible = ClassService.isAllBible
    $scope.$on('isAllBibleValueUpdated', function () {
        $scope.isAllBible = ClassService.isAllBible;
    });
    
    if ($scope.ngDialogData && $scope.ngDialogData.featureSet) {
        $scope.newFeatureSet = false;
        $scope.featureSet = angular.copy($scope.ngDialogData.featureSet);
    }
    else {
        $scope.newFeatureSet = true;
        $scope.featureSet = {
            tokenizerType: 'Word',
            featureType: 'Unigram',
            normalizerType: 'Frequency',
            filterType: 'Common',
            filterCount: 250,
            takeFromFile: false,
            descending: true,
            fromEachClass: false,
            includeLexeme: false,
            spoOnly: false,
            vocalized: true,
            sinDot: false,
            tokenized: false,
            includeNumber: false,
            includePunctuation: false
        };
    }

    $scope.featureSetChanged = false;
    $scope.$watch('featureSet', function(newValue, oldValue) {
        if (oldValue && newValue !== oldValue)
            $scope.featureSetChanged = true;
    }, true);

    $scope.toggleFeature = function(feature) {
        feature.selected = !feature.selected;
        FeatureService.updateTotalNumberOfFeatures(feature);
    };

    $scope.saveFeatureSet = function () {
        if ($scope.newFeatureSet) {
            FeatureService.FeatureSet_maxId = FeatureService.FeatureSet_maxId + 1;
            console.log("isIncludeLexeme: " + $scope.featureSet.includeLexeme);
            console.log("isSpoOnly: " + $scope.featureSet.spoOnly);
            $scope.featureSet.id = FeatureService.FeatureSet_maxId;
            $scope.featureSet.featureSetName = 'Default name' + FeatureService.FeatureSet_maxId;
            FeatureService.Feature_sets.push($scope.featureSet);
        }
        else {
            angular.copy($scope.featureSet, $scope.ngDialogData.featureSet);
        }
    }

    $scope.saveFeatureSetAndReturn = function () {
        $scope.saveFeatureSet();
        $scope.confirm();
    }

    $scope.classNameToBgStyle = function (name) {
        return { "background-color": ClassService.classNameToColor(name) };
    };

});