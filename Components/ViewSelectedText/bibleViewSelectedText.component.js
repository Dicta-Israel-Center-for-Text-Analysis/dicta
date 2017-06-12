jTextMinerApp.component('bibleViewSelectedText',
{
    bindings: {
        onSearch: '&',
        onClassify: '&',
        onSegment: '&'
    },
    templateUrl: 'Components/ViewSelectedText/bibleViewSelectedText.component.html',
    controller: ['$scope', 'SelectClassService', 'APIService', 'FeatureCollectionFactory', 'bibleContextMenu', '$q','$http',
        function ($scope, SelectClassService, APIService, FeatureCollectionFactory, bibleContextMenu, $q, $http) {
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
                        ctrl.chunks.forEach(chapter => {
                            ctrl.getFeatures(chapter);
                            ctrl.findSimilar(chapter);
                        });
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

                function handleExtractFeaturesResponse(response) {
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
                }
                const storageKey = "extract:" + JSON.stringify(apiCallData);
                const cache = window.sessionStorage.getItem(storageKey);
                if (cache)
                    return $q.resolve(JSON.parse(cache))
                        .then(handleExtractFeaturesResponse);

                return APIService.call(
                    'JTextMinerAPI/ExtractFeaturesClassification',
                    apiCallData)
                    .then(function(response){
                        try {
                            window.sessionStorage.setItem(storageKey, JSON.stringify(response));
                        }
                        // there might not be sufficient storage space
                        catch (e) {}
                        return response;
                    })
                    .then(handleExtractFeaturesResponse);
            };

            ctrl.processText = function (text) {
                return text.split(' ').map(word => '<span>' + word + '</span>').join(' ');
            };

            ctrl.menuOptions = bibleContextMenu.menu(ctrl.onSearch);

            ctrl.updateResults = function () {

            }

            ctrl.findSimilar = function(chunk) {
                const baseQuery = {
                    "multi_match": {
                        "fields": ["parsed_text*"],
                        "query": chunk.contents.map(unit => unit.hasOwnProperty('smallUnit') ? unit.smallUnit.text : '').join(' '),
                        "tie_breaker": 0.001,
                    }
                };

                const fullQuery = {
                    "query": {
                        "bool": {
                            must: baseQuery,
                            filter: {"term": {"_type": "large"}}
                        }
                    }
                };
                return $http.post("http://dev.dicta.org.il/essearch/", fullQuery)
                    .then(function (response) {
                        var searchResults = response.data.hits.hits;
                        chunk.similar = searchResults.filter(hit => hit._score > 200).map(hit => hit._source.english_path);
                    })
            }

            ctrl.getLink = function(chapter) {
                let [dummy, book, chapterNum] = /\/[^/]*\/([^/]*)\/Chapter (.*)/.exec(chapter);
                return "http://www.sefaria.org/" + book.replace(' ', '_') +'.' + chapterNum + "?lang=he"
            }
        }]
}); 