
jTextMinerApp.factory('FeatureService', function ($rootScope) {
    var root = {};

    root.updateTotalNumberOfFeatures = function (item) {
        var countSelected = 0;

        if (angular.isUndefined(root.featuresData) || angular.isUndefined(root.featuresData.features))
            return;

        for (var i = 0; i < root.featuresData.features.length; i++) {
            if (root.featuresData.features[i].selected)
                countSelected++;
        }
        if (item != null) {
            if (item.selected)
                countSelected--;
            else
                countSelected++;
        }
        root.updateTotalNumberOfFeaturesValue(countSelected);
    }

    // Features
    root.totalNumberOfFeatures = 0;
    root.updateTotalNumberOfFeaturesValue = function (value) {
        this.totalNumberOfFeatures = value;
        $rootScope.$broadcast("totalNumberOfFeaturesUpdated");
    }
    root.featuresData = {};
    root.updateFeaturesData = function (value) {
        this.featuresData = value;
        this.updateTotalNumberOfFeatures(null);
        $rootScope.$broadcast("featuresDataUpdated");
    }


    root.FeatureSet_maxId = 0;
    root.FeatureSet_maxId = root.FeatureSet_maxId + 1;
    root.Feature_sets = [];
    root.Feature_sets.push({
        id: root.FeatureSet_maxId,
        featureSetName: 'Default name' + root.FeatureSet_maxId,
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
    });

    root.deleteFeatureSet = function (index) {
        this.Feature_sets.splice(index, 1);
        this.updateFeaturesData({});
        $rootScope.$broadcast("featureSetDataUpdated");
    }


    return root;
});