// loads the tree of the Dicta corpus
// also provides a utility function 'treeSort' which sorts a list according to an in-order traversal of the tree
jTextMinerApp.factory('TreeService', function ($http, $q, StateService) {
    var service = {
        corpusTree: [],
        readyPromise: StateService.initPromise
            .then(() => $http.get(
                StateService.isBibleMode
                ? 'corpusData/Bible.json'
                :'corpusData/corpusTree.json'))
            .then(function (response)
        {
            service.corpusTree = response.data;
            service.loaded = false;
            service.loadNode(null);
        }),
        loadNode(node){
            if (node == null) {
                if (service.loaded)
                    return $q.resolve(null);
            }
            else if (node.loaded)
                return $q.resolve(node);
            var children = node ? node.children : service.corpusTree;
            var requests = [];
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                // add links back to the parent, so we can find the parent to update selections
                child['parent'] = node;
                service.$keyToNode[child['key']] = child;
                if (typeof(child.children)=='string') {
                    requests.push($http.get('corpusData/' + child.children).
                        then(function (response) {
                            this.children = response.data;
                        }.bind(child)));
                }
            }
            return $q.all(requests).then(function() {
                if (node)
                    node.loaded = true;
                else
                    service.loaded = true;
                return node;
                });
        },
        $keyToNode: {},
        keyToNode(key) {
            if (!service.$keyToNode.hasOwnProperty(key)) {
                const pathElements = key.split('/');
                let nodeChildren = service.corpusTree;
                let path = "";
                pathElements.forEach(name => {
                    if (path.length === 0)
                        path = name;
                    else
                        path = path + '/' + name; 
                    const childList = nodeChildren.filter(child => child.key === path);
                    if (childList.length > 0) {
                        const node = childList[0];
                        service.loadNode(node);
                        nodeChildren = node.children;
                    }
                    else
                        return null;
                })
            }
            return service.$keyToNode[key];
        },
        // list - the list to be sorted
        // getKeyFunc - a function that takes a list item and returns its key
        treeSort (list, getKeyFuncParam) {
            const getKeyFunc = getKeyFuncParam || (x => x);
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