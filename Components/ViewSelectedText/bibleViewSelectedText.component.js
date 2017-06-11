jTextMinerApp.component('bibleViewSelectedText',
{
    bindings: {
        onSearch: '&'
    },
    templateUrl: 'Components/ViewSelectedText/bibleViewSelectedText.component.html',
    controller: ['$scope', 'SelectClassService', 'APIService', 'FeatureCollectionFactory', 'bibleContextMenu',
        function ($scope, SelectClassService, APIService, FeatureCollectionFactory, bibleContextMenu) {
            var ctrl = this;
            ctrl.RESULTS_AT_A_TIME = 10;
            ctrl.currentPage = 1;
            ctrl.running = true;
            ctrl.selectClassService = SelectClassService;
            ctrl. featureCollection = FeatureCollectionFactory.newCollection();
            ctrl.featureCollection.Feature_sets[0].fromEachClass = true;
            
            $scope.$watchCollection("$ctrl.selectClassService.testText", updateText);
            function updateText() {
                APIService.call('TextFeatures/GetTextLargeAndSmall', SelectClassService.testText.keys)
                    .then(function (response) {
                        ctrl.chunks = response.data;
                        ctrl.chunks.forEach(chapter => ctrl.getFeatures(chapter));
                        ctrl.running = false;
                    });
            }

            ctrl.getFeatures = function (chapter) {
                var apiCallData = {
                    featureSets: ctrl.featureCollection.Feature_sets,
                    trainSet: {
                        "1": [chapter.chunkKey],
                        "2": ["/Dicta Corpus/Tanakh/Torah", "/Dicta Corpus/Tanakh/Prophets", "/Dicta Corpus/Tanakh/Writings"]
                    }
                };

                return APIService.call(
                    'JTextMinerAPI/ExtractFeaturesClassification',
                    apiCallData)
                    .then(function (response) {
                        var results = { features: response.data };
                        chapter.features = _.take(
                            _.sortBy(response.data[0].filter(feature => feature.className === "1"), [f => -f.maxTTest]), 5);
                        // build a string of all the names of the features in the set
                        function nameString(featureSet) {
                            return featureSet.map(function (feature) {
                                return feature.name;
                            }).sort().join(":::;");
                        }

                        // check if we need to carry over selections from the previous feature set
                        if (ctrl.featureCollection.featuresData.features) {
                            // first make a list of the old strings representing the names in the set
                            var oldFeatureStrings = ctrl.featureCollection.featuresData.features.map(function (set) {
                                return nameString(set);
                            });
                            for (var i = 0; i < results.features.length; i++) {
                                var oldSet = oldFeatureStrings.indexOf(nameString(results.features[i]));
                                // if it exists, then we have the same set as before, so copy the checkboxes
                                if (oldSet > -1) {
                                    // collect the old settings into an object
                                    var oldSelectedFeatures = {};
                                    ctrl.featureCollection.featuresData.features[oldSet]
                                        .forEach(function (feature) {
                                            oldSelectedFeatures[feature.name] = feature.selected
                                        });
                                    // apply them
                                    for (var j = 0; j < results.features[i].length; j++) {
                                        results.features[i][j].selected = oldSelectedFeatures[results.features[i][j].name];
                                    }
                                }
                            }
                        }
                        ctrl.featureCollection.updateFeaturesData(results);
                    });
            };

            ctrl.processText = function (text) {
                return text.split(' ').map(word => '<span>' + word + '</span>').join(' ');
            };

            ctrl.menuOptions = bibleContextMenu.menu(ctrl.onSearch);

            ctrl.updateResults = function () {

            }
        }]
}); 