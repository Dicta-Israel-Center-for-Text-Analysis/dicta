jTextMinerApp.component('search',
{
    bindings: {
        $transition$: '<'
    },
    templateUrl: 'Components/Search/search.component.html',
    controller: function ($http, search, $scope, bibleContextMenu, $timeout, StateService, $state) {
        const ctrl = this;
        ctrl.showBack = StateService.frontPageState === 'bibleFrontpage';
        ctrl.search = search;
        ctrl.currentPage = 1;
        ctrl.previousQuery = '';

        const searchParams = ctrl.$transition$.params();
        if (searchParams.hasOwnProperty('terms')) {
            search.query = searchParams.terms;
            getQueryFromService();
            search.search()
                .then(() => {
                    if (searchParams.hasOwnProperty('page')) {
                        this.currentPage = +searchParams.page;
                        updateResults();
                    }
                });
        }
        else if (!_.isEmpty(search.query)) {
            ctrl.previousQuery = search.query;
            ctrl.runSearch();
        }

        ctrl.uiOnParamsChanged = function (newParams) {
            console.log("new params: ", newParams);
        };

        ctrl.setSearchTerm = function (selected) {
            if (selected == null) return;
            ctrl.previousQuery = selected.title;
            search.query = selected.title;
            ctrl.runSearch();
        };

        $scope.$watch('$ctrl.search.query', getQueryFromService);
        // getQueryFromService();

        function getQueryFromService() {
            //if (ctrl.previousQuery != search.query) {
            ctrl.previousQuery = search.query;
            $timeout(() =>
                $scope.$broadcast('angucomplete-alt:changeInput', 'search', search.query), 1000
            );
            //}
        }

        ctrl.runSearch = function () {
            $state.go('search.terms', {terms: search.query, page: '1'});
            ctrl.currentPage = 1;
            search.search();
        };

        ctrl.inputChanged = function (searchTerm) {
            ctrl.previousQuery = searchTerm;
            search.query = searchTerm;
        };

        function splitWords(text) {
            return text.split(' ');
        }

        ctrl.onSearch = function (params) {
            search.query = params.query.replace(/<\/?mark>/g, '');
            if (params.item) {
                search.query += " lexeme:" + params.item.$parent.result._source.lemmas[params.item.$index];
            }
            ctrl.runSearch();
        };

        ctrl.menuOptions = bibleContextMenu.menu(ctrl.onSearch);

        ctrl.highlight = function (text) {
            // parsed_text_rep should cover all cases
            //if (text.highlight && text.highlight['parsed_text.y'])
            //    return splitWords(text.highlight['parsed_text.y'].join('...'));
            if (text.highlight && text.highlight['parsed_text_rep']) {
                const highlights = text.highlight['parsed_text_rep'][0].split(/\s/);
                const words = text._source.parsed_text.split(/\s/);
                let highlightedWords = [];
                highlights.forEach((highlight, index) =>
                    highlightedWords.push(
                        highlight.startsWith('<mark')
                            ? '<b>' + words[index] + '</b>'
                            : words[index]
                    ));
                return highlightedWords;
            }
            const re = new RegExp("(" + search.query.replace(/ /g, '|') + ")", "g");
            return splitWords(text._source.parsed_text.replace(re, "<b>$1</b>"));
        };

        ctrl.updateResults = updateResults;

        function updateResults () {
            $state.go('.', {page: ctrl.currentPage})
            search.loadResults(ctrl.currentPage);
        };

        ctrl.runSuggest = function (userInputString, timeoutPromise) {
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
    }
});