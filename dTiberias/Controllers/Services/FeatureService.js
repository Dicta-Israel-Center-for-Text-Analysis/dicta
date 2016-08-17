jTextMinerApp.factory('FeatureService', function ($rootScope) {
    var DEFAULT_FEATURE_SET = {
        id: 0,
        featureSetName: 'Default name',
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
    
    var service = {
        totalNumberOfFeatures: 0,
        featuresData: {},
        FeatureSet_maxId: 1,
        Feature_sets: [DEFAULT_FEATURE_SET]
    };

    // does this code work?
    service.updateTotalNumberOfFeatures = function (item) {
        var countSelected = 0;

        if (angular.isUndefined(service.featuresData) || angular.isUndefined(service.featuresData.features))
            return;

        for (var i = 0; i < service.featuresData.features.length; i++) {
            if (service.featuresData.features[i].selected)
                countSelected++;
        }
        if (item != null) {
            if (item.selected)
                countSelected--;
            else
                countSelected++;
        }
        service.updateTotalNumberOfFeaturesValue(countSelected);
    }

    // Features
    service.updateTotalNumberOfFeaturesValue = function (value) {
        this.totalNumberOfFeatures = value;
        $rootScope.$broadcast("totalNumberOfFeaturesUpdated");
    }
    service.updateFeaturesData = function (value) {
        this.featuresData = value;
        this.updateTotalNumberOfFeatures(null);
        $rootScope.$broadcast("featuresDataUpdated");
    }
    
    service.deleteFeatureSet = function (index) {
        this.Feature_sets.splice(index, 1);
        this.updateFeaturesData({});
        $rootScope.$broadcast("featureSetDataUpdated");
    }

    return service;
});