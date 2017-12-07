jTextMinerApp.component('editFeatureSetDialog', {
    bindings: {
        experiment: '<',
        onConfirm: '&',
        onCancel: '&',
    },
    templateUrl: "Components/Classification/editFeatureSetDialog.component.html",
    controller: function ($scope, $timeout, SelectClassService, FeatureCollectionFactory) {
    const ctrl = this;
    ctrl.featureCollection = FeatureCollectionFactory.duplicateCollection(ctrl.experiment.featureCollection);
    let individualFeaturesData = {};
    ctrl.classObject = ctrl.experiment.classes;

    if (ctrl.featureCollection.featuresData.features !== undefined)
        ctrl.featureCollection.featuresData.features.forEach(initializeFeatureSet);

    function initializeFeatureSet(featuresList, index) {
        // Surprisingly, the featureSetId returned with every feature is the index of the featureSet in the request
        // The ID field in the request is ignored
        // Instead, we rely on the index of the feature sets staying consistent with the extracted features.
        // We must therefore rerun extraction immediately after closing this dialog
        const featureSetKey = _.findKey(ctrl.experiment.featureCollection.allFeatureSets, setData => setData.set.tokenizerType
                 === ctrl.experiment.featureCollection.Feature_sets[index].tokenizerType);
        individualFeaturesData[featureSetKey] = featuresList;
    }

    ctrl.newFeatureSet = false;
    ctrl.featuresData = individualFeaturesData;

    // if this component would be used to edit a new feature set, use these lines:
    // ctrl.newFeatureSet = true;
    // ctrl.featureSet = featureCollection.getNewFeatureSet();

    var corpusSets = {};

    // this doesn't belong here, but rather in a service that holds both the classes and feature sets, so it's here until after refactoring
    // get the class list
    var keyListArray = this.classObject.Corpus_classes.map(function (corpusclass) {
        return corpusclass.selectedText;
    });
    keyListArray = keyListArray.concat(SelectClassService.testText ? SelectClassService.testText.keys : []);
    keyListArray = _.flatten(keyListArray);
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
    ctrl.isAllBible = corpusList.length == 1 && (corpusList[0] == 'Bible' || corpusList[0] == 'Tanakh');

    var onlyBibleMishnaOrTosefta = true;
    for (var i = 0; i < corpusList.length; i++) {
        if (['Bible', 'Tanakh', 'Mishnah', 'Tosefta'].indexOf(corpusList[i]) == -1)
            onlyBibleMishnaOrTosefta = false;
    }

    ctrl.featureEnabled = function (featureName) {
        if (['SyntaxClause', 'SyntaxPhrase'].indexOf(featureName) > -1)
            return ctrl.isAllBible;
        else if (featureName == 'Morphology' && !onlyBibleMishnaOrTosefta)
            return false;
        else if (!ctrl.isAllBible) {
            if (featureName == 'vocalized')
                return false;
        }
        return true;
    };

    if (!ctrl.featureEnabled('vocalized')) {
        ctrl.featureSet.vocalized = false;
    }

    ctrl.featureSetChanged = false;
    $scope.$watch('$ctrl.featureSet', function (newValue, oldValue) {
        if (oldValue && newValue !== oldValue)
            ctrl.featureSetChanged = true;
    }, true);

    ctrl.toggleFeature = function (feature) {
        feature.selected = !feature.selected;
        ctrl.featureCollection.updateTotalNumberOfFeatures(feature);
    };

    function showNewFeatures() {
        ctrl.newFeatureSet = false;
        individualFeaturesData = ctrl.featureCollection.featuresData.features[featureIndex];
        ctrl.featureSet = angular.copy(featureSet);
        ctrl.featuresData = angular.copy(individualFeaturesData);
        $timeout(function () {
            ctrl.featureSetChanged = false;
        });
    }

    ctrl.extractFeatures = function () {
        ctrl.saveFeatureSet();
        ctrl.runExtract().then(showNewFeatures);
    };

    ctrl.saveFeatureSet = function () {
        if (ctrl.newFeatureSet) {
            console.log("isIncludeLexeme: " + ctrl.featureSet.includeLexeme);
            console.log("isSpoOnly: " + ctrl.featureSet.spoOnly);
            ctrl.featureSet.id = ctrl.featureCollection.FeatureSet_maxId;
            ctrl.featureCollection.FeatureSet_maxId++;
            ctrl.featureSet.featureSetName = 'Default name' + ctrl.featureCollection.FeatureSet_maxId;
            ctrl.featureCollection.Feature_sets.push(ctrl.featureSet);
            featureIndex = ctrl.featureCollection.Feature_sets.length - 1;
            featureSet = ctrl.featureSet;
            ctrl.featureCollection.updateFeaturesData({});
        }
        else {
           ctrl.experiment.featureCollection.copyData(ctrl.featureCollection);
        }
    };

    ctrl.saveFeatureSetAndReturn = function () {
        ctrl.saveFeatureSet();
        ctrl.experiment.runClassification();
        ctrl.onConfirm();
    };

    ctrl.currentCategory = ctrl.featureCollection.allFeatureSetNames[0];
    ctrl.showFeatureSet = function (category) {
        ctrl.currentCategory = category;
    };

    tiberias_tour(FeatureSetSelectionTour);
}
});