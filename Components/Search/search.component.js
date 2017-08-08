jTextMinerApp.component('search',
{
    templateUrl: 'Components/Search/search.component.html',
    controller: [
        '$http', 'search', '$scope', 'bibleContextMenu',
        function($http, search, $scope, bibleContextMenu) {
            const ctrl = this;

            ctrl.search = search;
            ctrl.currentPage = 1;
            ctrl.previousQuery = '';

            ctrl.setSearchTerm = function (selected) {
                if (selected == null) return;
                ctrl.previousQuery = selected.title;
                search.query = selected.title;
                ctrl.runSearch();
            };

            $scope.$watch('$ctrl.search.query',
                function() {
                    if (ctrl.previousQuery != search.query) {
                        ctrl.previousQuery = search.query;
                        $scope.$broadcast('angucomplete-alt:changeInput', 'search', search.query)
                    }
            });

            ctrl.runSearch = function () {
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
                search.query = params.query.replace(/<\/?mark>/g,'');
                if (params.item) {
                    search.query += " lexeme:" + params.item.$parent.result._source.lemmas[params.item.$index];
                }
                ctrl.runSearch();
            };
            
            ctrl.menuOptions = bibleContextMenu.menu(ctrl.onSearch);

            ctrl.highlight = function (text) {
                if (text.highlight && text.highlight['parsed_text.y'])
                    return splitWords(text.highlight['parsed_text.y'].join('...'));
                if (text.highlight && text.highlight['parsed_text_rep']) {
                    const highlights = text.highlight['parsed_text_rep'][0].split(/\s/);
                    const words = text._source.parsed_text.split(/\s/);
                    let highlightedWords = [];
                    highlights.forEach((highlight, index) =>
                        highlightedWords.push(
                            highlight.startsWith('<mark')
                            ? '<mark>' + words[index] + '</mark>'
                            : words[index]
                        ));
                    return highlightedWords;
                }
                const re = new RegExp("(" + search.query.replace(/ /g,'|') + ")", "g");
                return splitWords(text._source.parsed_text.replace(re, "<mark>$1</mark>"));
            };

            ctrl.updateResults = function () {
                search.loadResults(ctrl.currentPage);
            };

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