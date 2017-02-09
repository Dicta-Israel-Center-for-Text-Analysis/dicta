jTextMinerApp.component('editFeatureSetDialog', {
    bindings: {
        featureCollection: '<',
        featureIndex: '<',
        classObject: '<',
        onConfirm: '&',
        onDiscard: '&',
        runExtract: '&'
    },
    templateUrl: "Components/Classification/editFeatureSetDialog.component.html",
    controller: function ($scope, ngDialog, InProgressService, APIService, ClassificationService, $timeout, SelectClassService) {
    var ctrl = this;
    var featureCollection = ctrl.featureCollection;
    var featureIndex = ctrl.featureIndex;
    var featureSet = {};
    var featuresData = [];

    $scope.showInProcess = InProgressService.isReady != 1;
    $scope.$on('isReady_Updated', function () {
        $scope.showInProcess = InProgressService.isReady != 1;
    });

    if (featureIndex !== undefined) {
        if (featureCollection.featuresData.features !== undefined && featureCollection.featuresData.features.length > featureIndex)
            featuresData = featureCollection.featuresData.features[featureIndex];
        featureSet = featureCollection.Feature_sets[featureIndex];
        $scope.newFeatureSet = false;
        $scope.featureSet = angular.copy(featureSet);
        $scope.featuresData = angular.copy(featuresData);
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
            vocalized: false,
            sinDot: false,
            tokenized: false,
            includeNumber: false,
            includePunctuation: false
        };
    }

    var corpusSets = {};

    // this doesn't belong here, but rather in a service that holds both the classes and feature sets, so it's here until after refactoring
    // get the class list
    var keyListArray = this.classObject.Corpus_classes.map(function (corpusclass) {
        return corpusclass.selectedText;
    });
    keyListArray = keyListArray.concat(SelectClassService.testText.keys);
    for (var i = 0; i < keyListArray.length; i++) {
        var classKeys = keyListArray[i].split(', ');
        for (var j = 0; j < classKeys.length; j++) {
            var key = classKeys[j];
            if (key.length > 0) {
                if (!key.startsWith('/Dicta Corpus/')) {
                    corpusSets['Uploaded'] = true;
                }
                else {
                    // we're removing /Dicta Corpus/
                    var corpus = key.split('/')[2];
                    corpusSets[corpus] = true;
                }
            }
        }
    }

    var corpusList = Object.keys(corpusSets);
    $scope.isAllBible = corpusList.length == 1 && (corpusList[0] == 'Bible' || corpusList[0] == 'Tanakh');

    var onlyBibleMishnaOrTosefta = true;
    for (var i = 0; i < corpusList.length; i++) {
        if (['Bible', 'Tanakh', 'Mishnah', 'Tosefta'].indexOf(corpusList[i]) == -1)
            onlyBibleMishnaOrTosefta = false;
    }

    $scope.featureEnabled = function (featureName) {
        if (['SyntaxClause', 'SyntaxPhrase'].indexOf(featureName) > -1)
            return $scope.isAllBible;
        else if (featureName == 'Morphology' && !onlyBibleMishnaOrTosefta)
            return false;
        else if (!$scope.isAllBible) {
            if (featureName == 'vocalized')
                return false;
        }
        return true;
    }

    if (!$scope.featureEnabled('vocalized')) {
        $scope.featureSet.vocalized = false;
    }

    $scope.featureSetChanged = false;
    $scope.$watch('featureSet', function (newValue, oldValue) {
        if (oldValue && newValue !== oldValue)
            $scope.featureSetChanged = true;
    }, true);

    $scope.toggleFeature = function (feature) {
        feature.selected = !feature.selected;
        featureCollection.updateTotalNumberOfFeatures(feature);
    };

    function showNewFeatures() {
        $scope.newFeatureSet = false;
        featuresData = featureCollection.featuresData.features[featureIndex];
        $scope.featureSet = angular.copy(featureSet);
        $scope.featuresData = angular.copy(featuresData);
        $timeout(function () {
            $scope.featureSetChanged = false;
        });
    }

    $scope.extractFeatures = function () {
        $scope.saveFeatureSet();
        ctrl.runExtract().then(showNewFeatures);
    }

    $scope.saveFeatureSet = function () {
        if ($scope.newFeatureSet) {
            console.log("isIncludeLexeme: " + $scope.featureSet.includeLexeme);
            console.log("isSpoOnly: " + $scope.featureSet.spoOnly);
            $scope.featureSet.id = featureCollection.FeatureSet_maxId;
            featureCollection.FeatureSet_maxId++;
            $scope.featureSet.featureSetName = 'Default name' + featureCollection.FeatureSet_maxId;
            featureCollection.Feature_sets.push($scope.featureSet);
            featureIndex = featureCollection.Feature_sets.length - 1;
            featureSet = $scope.featureSet;
            featureCollection.updateFeaturesData({});
        }
        else {
            if (angular.equals($scope.featureSet, featureSet)) {
                angular.copy($scope.featuresData, featuresData);
            }
            else {
                angular.copy([], featuresData);
                featureCollection.updateFeaturesData({});
            }
            angular.copy($scope.featureSet, featureSet);
        }
    }

    $scope.saveFeatureSetAndReturn = function () {
        $scope.saveFeatureSet();
        ctrl.onConfirm();
    }
    tiberias_tour(FeatureSetSelectionTour);
}
});