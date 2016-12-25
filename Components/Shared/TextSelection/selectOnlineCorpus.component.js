jTextMinerApp.component('selectOnlineCorpus', {
        templateUrl: 'Components/Shared/TextSelection/selectOnlineCorpus.component.html',
        controller: ['TreeService', 'SelectClassService', function (TreeService, SelectClassService) {
            var ctrl = this;
            function initBreadCrumbs() {
                ctrl.breadCrumbs = ['All Collections'];
            }
            initBreadCrumbs();

            TreeService.readyPromise.then(function() {
                ctrl.corpusTree = TreeService.corpusTree;
                ctrl.treeNode = ctrl.corpusTree;
                initCurrentLevel(null);
            });

            // based on http://stackoverflow.com/questions/14514461/how-to-bind-to-list-of-checkbox-values-with-angularjs
            // list selected nodes by key
            ctrl.selectedNodes = SelectClassService.lastSelectedRootKeys.map(function(key){return key.substring("/Dicta Corpus/".length)});
            recalculatePartials();

            function initCurrentLevel(parentNode) {
                for (var i = 0; i < ctrl.treeNode.length; i++) {
                    // add links back to the parent, so we can update selections
                    ctrl.treeNode[i]['parent'] = parentNode;
                    TreeService.keyToNode[ctrl.treeNode[i]['key']] = ctrl.treeNode[i];
                }
            }

            // end of tree setup; helper functions come next

            ctrl.expandNode = function (itemTitle) {
                var currentNode = ctrl.treeNode;
                for (var i=0; i < currentNode.length; i++) {
                    if (currentNode[i]['title'] == itemTitle) {
                        ctrl.treeNode = currentNode[i]['children'];
                        initCurrentLevel(currentNode[i]);
                        ctrl.breadCrumbs.push(itemTitle);
                        break;
                    }
                }
            };

            // remove current item from array if 'ancestor' is an ancestor
            function removeIfAncestor(arr, idx, ancestor) {
                var current = TreeService.keyToNode[arr[idx]];
                while(current['parent'] != null) {
                    if (current['parent'] === ancestor) {
                        arr.splice(idx, 1);
                        break;
                    }
                    current = current['parent'];
                }
            }

            function recalculatePartials() {
                ctrl.partialNodes = [];
                for (var i=0;i< ctrl.selectedNodes.length; i++) {
                    var parent = TreeService.keyToNode[ctrl.selectedNodes[i]]['parent'];
                    while (parent != null) {
                        if (ctrl.partialNodes.indexOf(parent['key']) == -1)
                            ctrl.partialNodes.push(parent['key']);
                        parent = parent['parent'];
                    }
                }
            }

            ctrl.isNodeSelected = function isNodeSelected(node) {
                var parent = TreeService.keyToNode[node]['parent'];
                return ctrl.selectedNodes.indexOf(node) > -1 || (parent != null && isNodeSelected(parent['key']));
            };

            ctrl.isNodePartial = function isNodePartial(node) {
                return ctrl.partialNodes.indexOf(node) > -1;
            };

            // toggle selection for a given node by key
            ctrl.toggleSelection = function toggleSelection(itemKey) {
                // is currently selected, so this deselects
                if (ctrl.isNodeSelected(itemKey)) {
                    // currently selected itself?
                    var idx = ctrl.selectedNodes.indexOf(itemKey);
                    if (idx > -1) {
                        // yes, so remove it.
                        ctrl.selectedNodes.splice(idx, 1);
                    }
                    else {
                        // select siblings and deselect ancestor
                        var currentNode = TreeService.keyToNode[itemKey];
                        while ((idx = ctrl.selectedNodes.indexOf(currentNode['key'])) == -1) {
                            var children = currentNode['parent']['children'];
                            for (var i = 0; i < children.length; i++)
                                if (children[i] != currentNode)
                                    ctrl.selectedNodes.push(children[i]['key']);
                            currentNode = currentNode['parent'];
                        }
                        ctrl.selectedNodes.splice(idx, 1);
                    }
                }
                // is newly selected
                else {
                    // select this
                    ctrl.selectedNodes.push(itemKey);
                    // check if all siblings are selected
                    var parent = TreeService.keyToNode[itemKey]['parent'];
                    if (parent != null) {
                        var sibCount = 0;
                        var siblings = parent['children'];
                        for (var i = 0; i < siblings.length; i++)
                            if (ctrl.selectedNodes.indexOf(siblings[i]['key']) > -1)
                                sibCount++;
                        // if so, select the parent
                        if (sibCount == siblings.length)
                            ctrl.toggleSelection(parent['key']);

                    }
                }

                // remove any descendants already selected
                for (var i = ctrl.selectedNodes.length - 1; i>=0; i--)
                    removeIfAncestor(ctrl.selectedNodes, i, TreeService.keyToNode[itemKey]);

                recalculatePartials();

                SelectClassService.lastSelectedRootKeys = ctrl.selectedNodes.map(function(key){return "/Dicta Corpus/" + key;});
            };

            ctrl.selectCrumb = function (crumbNumber) {
                var oldCrumbs = ctrl.breadCrumbs;
                initBreadCrumbs();
                ctrl.treeNode = ctrl.corpusTree;
                for (var i=1; i <= crumbNumber; i++) {
                    ctrl.expandNode(oldCrumbs[i]);
                }

            };
            
        }]
});