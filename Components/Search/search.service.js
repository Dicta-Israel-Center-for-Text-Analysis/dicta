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
                const baseQuery = {
                    "multi_match": {
                        "fields": ["parsed_text*"],
                        "query": service.query,
                        "tie_breaker": 0.001,
                        "minimum_should_match": "3<80%"
                    }
                };
                return $http.post("http://dev.dicta.org.il/essearch/", {
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
                    "sort": { "corpus_order_path": { "order": "asc" }}
                })
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

