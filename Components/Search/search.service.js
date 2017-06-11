angular.module('JTextMinerApp')
    .factory('search', function ($http) {
        const service = {
            RESULTS_AT_A_TIME: 20,
            query: "",
            offset: 0,
            searchResults: [],
            searchResponse: {},
            searching: false,
            search(offset) {
                if (!offset)
                    offset = 0;
                service.searching = true;
                const queryParamRegex = /(\S+:\S+)/g;
                const baseQueryString = service.query.replace(queryParamRegex, '');
                const queryParamsArray = service.query.match(queryParamRegex);
                let queryParams = {};
                if (queryParamsArray) {
                    queryParamsArray.forEach(
                        match => {
                            let [paramName, paramValue] = match.split(':');
                            queryParams[paramName] = paramValue;
                        }
                    )
                }
                const baseQuery = {
                    "multi_match": {
                        "fields": ["parsed_text*"],
                        "query": baseQueryString,
                        "tie_breaker": 0.001,
                        "minimum_should_match": "3<80%"
                    }
                };

                const fullQuery = {
                    "query": {
                        "bool": {
                            "should": baseQuery,
                            "must_not": {
                                "has_child": {
                                    "type": "small",
                                    "query": baseQuery
                                }
                            }
                        }
                    },
                    "highlight": {
                        "pre_tags": ["<mark>"],
                        "post_tags": ["</mark>"],
                        "fields": {
                            "parsed_text.y": {
                                fragment_size: 10000
                            }
                        }
                    },
                    "from": offset,
                    "size": service.RESULTS_AT_A_TIME,
                    "track_scores": true
                };
                if (!queryParams['sortByScore'])
                    fullQuery["sort"] = { "corpus_order_path": { "order": "asc" }};
                if (queryParams['lexeme'])
                    fullQuery.query.bool["filter"] = { "match": { "lemmas*": queryParams['lexeme'] }};
                return $http.post("http://dev.dicta.org.il/essearch/", fullQuery)
                    .then(function (response) {
                        service.searchResults = response.data.hits.hits;
                        service.searchResponse = response.data;
                        service.offset = offset;
                        service.searching = false;
                    })
            },
            loadResults(pageNum) {
                return service.search((pageNum - 1) * service.RESULTS_AT_A_TIME);
            }
        };
        return service;
    });

