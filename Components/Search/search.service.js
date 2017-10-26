angular.module('JTextMinerApp')
    .factory('search', function (APIService, $q) {
        const service = {
            RESULTS_AT_A_TIME: 20,
            query: "",
            offset: 0,
            smallUnitsOnly: true,
            sortByCorpusOrder: true,
            searchResults: [],
            searchResponse: false,
            searching: false,
            search(offset) {
                if (!offset)
                    service.offset = 0;
                else
                    service.offset = offset;
                if (this.lastQuery !== this.query) {
                    this.lastQuery = this.query;
                    return service.submitSearch();
                }
                else
                    return this.updateSearch();
            },
            updateSearch() {
                service.searching = true;
                this.fullQuery.query.bool.filter[this.fullQuery.query.bool.filter.length - 1].ids.values
                    = (service.smallUnitsOnly ? service.smallUnitResults : service.completeResults)
                    .slice(this.offset, this.offset + service.RESULTS_AT_A_TIME);
                return APIService.search(this.fullQuery)
                    .then(function (response) {
                        service.searchResults = response.data.hits.hits;
                        service.searchResponse = true;
                        service.searching = false;
                    })
            },
            submitSearch() {
                service.searching = true;
                service.smallUnitsOnly = true;
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
                                fragment_size: 100000
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
                    "_source": ["corpus_order_path", "children_path"],
                    size: 10000,
                    track_scores: true
                };
                if (!queryParams['sortByScore'] && this.sortByCorpusOrder) {
                    preQuery["sort"] = {"corpus_order_path": {"order": "asc"}};
                    this.fullQuery["sort"] = {"corpus_order_path": {"order": "asc"}};
                }
                if (queryParams['lexeme']) {
                    const lemmaList = queryParams['lexeme'].replace(/-/g, ' ').split('+');
                    preQuery.query.bool["filter"] = lemmaList.map(lemma => ({"term": {"lemmas": lemma}}));
                    this.fullQuery.query.bool["filter"] = lemmaList.map(lemma => ({"term": {"lemmas": lemma}}));
                }
                if (!this.fullQuery.query.bool.hasOwnProperty("filter")) {
                    //preQuery.query.bool["filter"] = [];{"term": {"_type": "small"}}];
                    this.fullQuery.query.bool["filter"] = [];
                    //{"term": {"_type": "small"}}];
                }
                this.fullQuery.query.bool.filter.push({
                    ids: { "values": null }
                });
                return APIService.search(preQuery)
                    .then((response) => {
                        let childUnitScores = {};
                        let smallUnitScores = {};
                        const hits = response.data.hits.hits;
                        hits.forEach(hit =>
                        {
                            const path = hit._source.corpus_order_path;
                            smallUnitScores[path] = hit._score;
                            const parentPath = path.substring(0, path.lastIndexOf('/'));
                            childUnitScores[parentPath] = childUnitScores.hasOwnProperty(parentPath)
                                ? _.max([childUnitScores[parentPath], hit._score])
                                : hit._score;
                        });
                        service.completeResults = hits.filter(hit =>
                            {
                                if (hit._type === "cross") {
                                    return hit._source.children_path.every(path => smallUnitScores[path] < hit._score)
                                }
                                return !childUnitScores.hasOwnProperty(hit._source.corpus_order_path)
                                || childUnitScores[hit._source.corpus_order_path] < hit._score
                            })
                            .map(hit => hit._id);
                        service.smallUnitResults = hits.filter(hit => hit._type === 'small').map(hit => hit._id);;
                        if (service.smallUnitResults.length === 0)
                            service.smallUnitsOnly = false;
                        service.offset = 0;
                        return service.updateSearch();
                    })
            },
            getLexemeVariations() {
                function resultToVariation(result) {
                    const lemmaGroups = _.groupBy(result, wordData=> wordData.lemma);
                    const lemmaObject = _.mapValues(lemmaGroups, lemmaData=> _.maxBy(lemmaData, wordData => wordData.count))
                    return Object.values(lemmaObject);
                }
                return $q.all(service.query.split(' ').filter(term => !term.includes(':'))
                    .map(term => APIService.wordSearch({
                        query: {
                            multi_match: {
                                fields: ["parsed_text*"],
                                query: term
                            }
                        },
                        size: 10000,
                        "_source": ["parsed_text", "lemma", "count"]
                    })
                        .then(result => ({
                            term,
                            variations: resultToVariation(result.data.hits.hits.map(hit => hit._source))
                        }))
                    ));
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

