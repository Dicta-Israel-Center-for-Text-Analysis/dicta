angular.module('JTextMinerApp')
    .factory('search', function ($http) {
        const service = {
            RESULTS_AT_A_TIME: 20,
            query: "",
            offset: 0,
            sortByCorpusOrder: true,
            searchResults: [],
            searchResponse: {},
            searching: false,
            search(offset) {
                if (!offset) {
                    this.offset = 0;
                    if (this.lastQuery !== this.query) {
                        this.lastQuery = this.query;
                        this.submitSearch();
                    }
                }
                else {
                    service.offset = offset;
                    this.updateSearch();
                }
            },
            updateSearch() {
                service.searching = true;
                this.fullQuery.query.bool.filter[this.fullQuery.query.bool.filter.length - 1].ids.values
                    = service.completeResults.slice(this.offset, this.offset + service.RESULTS_AT_A_TIME);
                return $http.post("http://dev.dicta.org.il/essearch/", this.fullQuery)
                    .then(function (response) {
                        service.searchResults = response.data.hits.hits;
                        service.searching = false;
                    })
            },
            submitSearch() {
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

                this.fullQuery = {
                    "query": {
                        "bool": {
                            "must": baseQuery
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
                    "size": this.RESULTS_AT_A_TIME,
                    "track_scores": true
                };

                const preQuery = {
                    query: {
                        "bool": {
                            "must": baseQuery
                        }
                    },
                    "_source": ["corpus_order_path"],
                    size: 10000
                };
                if (!queryParams['sortByScore'] && this.sortByCorpusOrder) {
                    preQuery["sort"] = {"corpus_order_path": {"order": "asc"}};
                    this.fullQuery["sort"] = {"corpus_order_path": {"order": "asc"}};
                }
                if (queryParams['lexeme']) {
                    preQuery.query.bool["filter"] = [{"match": {"lemmas": queryParams['lexeme']}}];
                    this.fullQuery.query.bool["filter"] = [{"match": {"lemmas": queryParams['lexeme']}}];
                }
                if (!this.fullQuery.query.bool.hasOwnProperty("filter")) {
                    //preQuery.query.bool["filter"] = [];{"term": {"_type": "small"}}];
                    this.fullQuery.query.bool["filter"] = [];
                    //{"term": {"_type": "small"}}];
                }
                return $http.post("http://dev.dicta.org.il/essearch/", preQuery)
                    .then((response) => {
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
                            || smallUnitScores[hit._source.corpus_order_path] < hit._score)
                            .map(hit => hit._id);

                       this.fullQuery.query.bool.filter.push({
                                ids: {
                                    "values": service.completeResults.slice(0, service.RESULTS_AT_A_TIME)
                                }
                            });
                        return $http.post("http://dev.dicta.org.il/essearch/", this.fullQuery)
                    })
                    .then(function (response) {
                        service.searchResults = response.data.hits.hits;
                        service.searchResponse = response.data;
                        service.offset = 0;
                        service.searching = false;
                    })
            },
            toggleSortOrder(){
                this.sortByCorpusOrder = !this.sortByCorpusOrder;
                this.offset = 0;
                this.submitSearch();
            },
            loadResults(pageNum) {
                return service.search((pageNum - 1) * service.RESULTS_AT_A_TIME);
            }
        };
        return service;
    });

