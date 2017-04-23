jTextMinerApp.component('search',
{
    templateUrl: 'Components/Search/search.component.html',
    controller: [
        '$http',
        function($http) {
            const ctrl = this;

            ctrl.searchTerm = "";
            ctrl.searchResults = [];
            ctrl.searchResponse = {};
            ctrl.RESULTS_AT_A_TIME = 20;

            ctrl.search = function (offset) {
                ctrl.searching = true;
                if (!offset)
                    offset = 0;
                $http.post("http://dev.dicta.org.il/essearch/",{
                    "query": {
                        "multi_match": {
                            "fields": ["parsed_text*"],
                            "query": ctrl.searchTerm,
                            "tie_breaker": 0.001,
                            "minimum_should_match": "3<90%"
                        }
                    },
                    "highlight": {
                        "pre_tags" : ["<mark>"],
                        "post_tags" : ["</mark>"],
                        "fields": {"parsed_text.y": {
                            fragment_size: 10000
                        }}
                    },
                    "from": offset,
                    "size": ctrl.RESULTS_AT_A_TIME
                })
                    .then(function(response) {
                        ctrl.searching = false;
                        ctrl.searchResults = response.data.hits.hits;
                        ctrl.searchResponse = response.data;
                        ctrl.offset = offset;
                    })
            };

            ctrl.setSearchTerm = function (selected) {
                ctrl.searchTerm = selected.title;
                ctrl.search();
            };

            ctrl.inputChanged = function (searchTerm) {
                ctrl.searchTerm = searchTerm;
            };

            ctrl.highlight = function (text) {
                if (text.highlight && text.highlight['parsed_text.y'])
                    return text.highlight['parsed_text.y'].join('...');
                const re = new RegExp("(" + ctrl.searchTerm.replace(/ /g,'|') + ")", "g");
                return text._source.parsed_text.replace(re, "<mark>$1</mark>")
            };

            ctrl.nextResults = function () {
                ctrl.search(ctrl.offset + ctrl.RESULTS_AT_A_TIME)
            }

            ctrl.runSuggest = function(userInputString, timeoutPromise) {
                return $http.post("http://dev.dicta.org.il/essearch/",
                    {
                        "suggest": {
                            "my-suggestion": {
                                "prefix": userInputString,
                                "term": {
                                    "field": "parsed_text.y"
                                }
                            }
                        }
                    },
                    {timeout: timeoutPromise})
                    .then(response =>
                        response.data.suggest["my-suggestion"]["0"].options
                    );
            }
        }]
}); 