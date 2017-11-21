jTextMinerApp.factory('FeatureCollectionFactory', function ($rootScope) {
    return { newCollection: function () {
        var DEFAULT_FEATURE_SET = {
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
            includeParenthesizedText: false,
            tokenized: false,
            includeNumber: false,
            includePunctuation: false
        };

        function getNewFeatureSet() {
            return angular.copy(DEFAULT_FEATURE_SET);
        }

        var INITIAL_FEATURE_SET = getNewFeatureSet();
        INITIAL_FEATURE_SET.id = 0;
        INITIAL_FEATURE_SET.featureSetName = 'Default name';

        const INITIAL_MORPHOLOGY = _.assign(getNewFeatureSet(), {
            id: 1,
            featureSetName: 'Morphology',
            tokenizerType: 'Morphology'
        });

        const INITIAL_SYNTAX = _.assign(getNewFeatureSet(), {
            id: 2,
            featureSetName: 'SyntaxClause',
            tokenizerType: 'SyntaxClause'
        });

        var collection = {
            totalNumberOfFeatures: 0,
            featuresData: {},
            FeatureSet_maxId: 3,
            Feature_sets: [INITIAL_FEATURE_SET, INITIAL_MORPHOLOGY/*, INITIAL_SYNTAX*/],
            getNewFeatureSet: getNewFeatureSet
        };

        // does this code work?
        collection.updateTotalNumberOfFeatures = function (item) {
            var countSelected = 0;

            if (angular.isUndefined(collection.featuresData) || angular.isUndefined(collection.featuresData.features))
                return;

            for (var i = 0; i < collection.featuresData.features.length; i++) {
                if (collection.featuresData.features[i].selected)
                    countSelected++;
            }
            if (item != null) {
                if (item.selected)
                    countSelected--;
                else
                    countSelected++;
            }
            collection.updateTotalNumberOfFeaturesValue(countSelected);
        }

        // Features
        collection.updateTotalNumberOfFeaturesValue = function (value) {
            this.totalNumberOfFeatures = value;
            $rootScope.$broadcast("totalNumberOfFeaturesUpdated");
        }
        collection.updateFeaturesData = function (value) {
            this.featuresData = value;
            this.updateTotalNumberOfFeatures(null);
            $rootScope.$broadcast("featuresDataUpdated");
        }

        collection.deleteFeatureSet = function (index) {
            this.Feature_sets.splice(index, 1);
            this.updateFeaturesData({});
            $rootScope.$broadcast("featureSetDataUpdated");
        }

        return collection;
    }
}});