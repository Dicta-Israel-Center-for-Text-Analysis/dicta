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
                        "match": {
                            "_all": ctrl.searchTerm
                        }
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

            ctrl.highlight = function (text) {
                const re = new RegExp("(" + ctrl.searchTerm.replace(/ /g,'|') + ")", "g");
                return text.replace(re, "<mark>$1</mark>")
            };

            ctrl.nextResults = function () {
                ctrl.search(ctrl.offset + ctrl.RESULTS_AT_A_TIME)
            }
        }]
}); 