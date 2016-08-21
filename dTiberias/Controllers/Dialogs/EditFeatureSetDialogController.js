﻿// create the controller and inject Angular's $scope
jTextMinerApp.controller('EditFeatureSetDialogController', function ($scope, ngDialog, InProgressService, APIService, ClassService) {

    var featureCollection = $scope.ngDialogData.featureCollection;
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
        $scope.featuresData = angular.copy($scope.ngDialogData.featuresData);
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
        featureCollection.updateTotalNumberOfFeatures(feature);
    };

    $scope.saveFeatureSet = function () {
        if ($scope.newFeatureSet) {
            featureCollection.FeatureSet_maxId = featureCollection.FeatureSet_maxId + 1;
            console.log("isIncludeLexeme: " + $scope.featureSet.includeLexeme);
            console.log("isSpoOnly: " + $scope.featureSet.spoOnly);
            $scope.featureSet.id = featureCollection.FeatureSet_maxId;
            $scope.featureSet.featureSetName = 'Default name' + featureCollection.FeatureSet_maxId;
            featureCollection.Feature_sets.push($scope.featureSet);
        }
        else {
            angular.copy($scope.featureSet, $scope.ngDialogData.featureSet);
            angular.copy($scope.featuresData, $scope.ngDialogData.featuresData);
        }
    }

    $scope.saveFeatureSetAndReturn = function () {
        $scope.saveFeatureSet();
        $scope.confirm();
    }
});