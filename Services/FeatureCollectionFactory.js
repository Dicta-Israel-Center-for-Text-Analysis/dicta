jTextMinerApp.factory('FeatureCollectionFactory', function ($rootScope) {
return {
    newCollection: function (collectionType) {
        const DEFAULT_FEATURE_SET = {
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

        const INITIAL_FEATURE_SET = _.assign(getNewFeatureSet(),{
            id: 0,
            featureSetName: 'Words'
        });

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
        const INITIAL_LEXEME = _.assign(getNewFeatureSet(), {
            id: 3,
            featureSetName: 'Lexeme',
            tokenizerType: 'Lexeme'
        });

        const collection = {
            totalNumberOfFeatures: 0,
            featuresData: {},
            FeatureSet_maxId: 1,
            Feature_sets: [INITIAL_FEATURE_SET],
            getNewFeatureSet: getNewFeatureSet,
            collectionType
        };

        if (collectionType === 'Classification') {
            collection.Feature_sets.push(INITIAL_MORPHOLOGY);
            collection.Feature_sets.push(INITIAL_SYNTAX);
            collection.FeatureSet_maxId = 3;
            collection.allFeatureSets = {
                'Words': {
                    set: INITIAL_FEATURE_SET,
                    selected: true
                },
                'Morphology': {
                    set: INITIAL_MORPHOLOGY,
                    selected: true
                },
                'Syntax': {
                    set: INITIAL_SYNTAX,
                    selected: true
                },
                'Lexemes': {
                    set: INITIAL_LEXEME,
                    selected: false
                }
            };
            collection.allFeatureSetNames = ['Words', 'Morphology', 'Syntax', 'Lexemes'];
            collection.toggleFeatureSet = function (name, selected) {
                if (!collection.allFeatureSets.hasOwnProperty(name))
                    throw "Incorrect feature set name passed to toggleFeatureSet.";
                const setData = collection.allFeatureSets[name];
                const state = setData.selected;
                if (selected === state) return;
                const newState = (selected === undefined) ? !state : !!selected;
                if (newState) {
                    collection.Feature_sets.push(setData.set);
                    collection.FeatureSet_maxId++;
                }
                else {
                    const index = collection.Feature_sets.indexOf(setData.set);
                    if (index === -1)
                        throw "Can't find the feature set to unselect it."
                    collection.Feature_sets.splice(index, 1);
                    collection.FeatureSet_maxId--;
                }
                setData.selected = newState;
            }
        }

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

        collection.copyData = function(source) {
            collection.totalNumberOfFeatures = source.totalNumberOfFeatures;
            collection.featuresData = _.cloneDeep(source.featuresData);
            collection.FeatureSet_maxId = source.FeatureSet_maxId;
            collection.allFeatureSets = _.cloneDeep(source.allFeatureSets);
            // regenerate Feature_sets from allFeatures. Perhaps it should be a getter
            collection.Feature_sets = Object.values(collection.allFeatureSets)
                .filter(setData => setData.selected).map(setData => setData.set);
        };

        return collection;
    },
    duplicateCollection(source) {
        const destination = this.newCollection(source.collectionType);
        destination.totalNumberOfFeatures = source.totalNumberOfFeatures;
        destination.featuresData = _.cloneDeep(source.featuresData);
        destination.FeatureSet_maxId = source.FeatureSet_maxId;
        destination.allFeatureSets = _.cloneDeep(source.allFeatureSets);
        destination.Feature_sets = Object.values(destination.allFeatureSets)
            .filter(setData => setData.selected).map(setData => setData.set);
        return destination;
    }
}});