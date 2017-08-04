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
                if (!offset && this.lastQuery !== this.query) {
                    offset = 0;
                    this.lastQuery = this.query;
                    this.submitSearch();
                }
                else {
                    service.searchResults = service.completeResults.slice(offset, offset + service.RESULTS_AT_A_TIME);
                    service.offset = offset;
                }
            },
            submitSearch () {
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
                        "type": "phrase",
                        "slop": 1000,
                        "fields": ["parsed_text*"],
                        "query": baseQueryString,
                        "tie_breaker": 0.001,
                        "minimum_should_match": "3<80%"
                    }
                };

                const fullQuery = {
                    "query": {
                        "bool": {
                            "must": baseQuery,
                            // "must_not": {
                            //     "has_child": {
                            //         "type": "small",
                            //         "query": baseQuery
                            //     }
                            // }
                        }
                    },
                    "highlight": {
                        "pre_tags": ["<mark>"],
                        "post_tags": ["</mark>"],
                        "fields": {
                            "parsed_text*": {
                                fragment_size: 10000
                            }
                        }
                    },
                    //"from": offset,
                    // paging on client side so we can filter out large units, 10000 is the default elasticsearch limit
                    // via this API
                    size: 10000,
                    //"size": service.RESULTS_AT_A_TIME,
                    "track_scores": true
                };
                if (!queryParams['sortByScore'])
                    fullQuery["sort"] = { "corpus_order_path": { "order": "asc" }};
                if (queryParams['lexeme'])
                    fullQuery.query.bool["filter"] = { "match": { "lemmas": queryParams['lexeme'] }};
                return $http.post("http://dev.dicta.org.il/essearch/", fullQuery)
                    .then(function (response) {
                        let smallUnitScores = {};
                        const hits = response.data.hits.hits;
                        hits.forEach(hit =>
                        {
                            const path = hit._source.corpus_order_path;
                            const parentPath = path.substring(0, path.lastIndexOf('/'));
                            smallUnitScores[parentPath] = smallUnitScores.hasOwnProperty(parentPath)
                                                ? _.max([smallUnitScores[parentPath], hit._score])
                                                : hit._score;
                        });
                        service.completeResults = hits.filter(hit =>
                            !smallUnitScores.hasOwnProperty(hit._source.corpus_order_path)
                            || smallUnitScores[hit._source.corpus_order_path] < hit._score);
                        service.searchResults = service.completeResults.slice(0, service.RESULTS_AT_A_TIME);
                        service.searchResponse = response.data;
                        service.offset = 0;
                        service.searching = false;
                    })
            },
            loadResults(pageNum) {
                return service.search((pageNum - 1) * service.RESULTS_AT_A_TIME);
            }
        };
        return service;
    });

