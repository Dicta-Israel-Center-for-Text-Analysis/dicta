// loads the tree of the Dicta corpus
// also provides a utility function 'treeSort' which sorts a list according to an in-order traversal of the tree
jTextMinerApp.factory('TreeService', function ($http) {
    var service = {
        corpusTree: [],
        readyPromise: $http.get('corpusTree.json').then(function (response) {
            service.corpusTree = response.data;
        }),
        // map of key to tree node, FIXME: this is maintained in SelectOnlineCorpus instead of here.
        keyToNode: {},
        // list - the list to be sorted
        // getKeyFunc - a function that takes a list item and returns its key
        treeSort (list, getKeyFunc) {
            var nextItems = service.corpusTree.slice(); // copies the array
            var sortedItems = [];
            while (nextItems.length > 0) {
                var currentItem = nextItems.shift();
                if (Array.isArray(currentItem['children']))
                    nextItems = currentItem.children.concat(nextItems);
                for (var i = list.length - 1; i >= 0; i--) {
                    if (currentItem.key == getKeyFunc(list[i])) {
                        sortedItems.push(list[i]);
                        list.splice(i, 1);
                    }
                }
            }
            // if there are any items left, leave them unsorted at the end
            return sortedItems.concat(list);
        }
    };

    return service;
});