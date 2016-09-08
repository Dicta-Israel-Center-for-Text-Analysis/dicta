
jTextMinerApp.factory('TreeService', function ($http) {
    var treeObject = {};
    treeObject.ready = $http.get('corpusTree.json').then(function(response) {
        treeObject.corpusTree = response.data;
    });
    treeObject.keyToNode = {};

    treeObject.treeSort = function(list, getKeyFunc) {
        var nextItems = treeObject.corpusTree.slice(); // copies the array
        var sortedItems = [];
        while (nextItems.length > 0) {
            var currentItem = nextItems.shift();
            if (Array.isArray(currentItem['children']))
                nextItems = currentItem.children.concat(nextItems);
            for(var i = list.length - 1; i >= 0; i--) {
                if (currentItem.key == getKeyFunc(list[i])) {
                    sortedItems.push(list[i]);
                    list.splice(i, 1);
                }
            }
        }
        // if there are any items left, leave them unsorted at the end
        return sortedItems.concat(list);
    };
    return treeObject;
});