angular.module('JTextMinerApp')
    .factory("bibleContextMenu", function () {
        return {
            menu(onSearch) {
                return [
                [scope => "Search for " + scope.word, function ($itemScope, $event, modelValue, text, $li) {
                    onSearch({query: $itemScope.word});
                }],
                [scope => "Search for " + scope.word + " used in the same sense", function ($itemScope, $event, modelValue, text, $li) {
                    onSearch({query: $itemScope.word});
                }],
                [scope => "Search for words with the same morphology as " + scope.word, function ($itemScope, $event, modelValue, text, $li) {
                    onSearch({query: $itemScope.word});
                }],
                null, // Divider
                [scope => "Search for " + scope.line.smallUnit.text, function ($itemScope, $event, modelValue, text, $li) {
                    onSearch({query: $itemScope.word});
                }],
                [scope => "Search for similar clauses", function ($itemScope, $event, modelValue, text, $li) {
                    onSearch({query: $itemScope.word});
                }],
                [scope => "Search for similar verses", function ($itemScope, $event, modelValue, text, $li) {
                    onSearch({query: $itemScope.word});
                }]
            ]}
        };
    });
