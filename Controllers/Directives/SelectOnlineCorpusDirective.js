jTextMinerApp.directive('selectOnlineCorpus', function ($rootScope) {
    return {
        restrict: 'AE',
        templateUrl: 'partials/templates/SelectOnlineCorpusTemplate.html',
        controller: ['$scope', '$http', 'TreeService', 'SelectClassService', function ($scope, $http, TreeService, SelectClassService) {
            $scope.Select_OnlineCorpus = 'Bible';

            $scope.showBibleDialog = false;
            $scope.OpenSelectBible = function () {
                $scope.showBibleDialog = true;
                $scope.showTalmudDialog = false;
            };
            $scope.showTalmudDialog = true;
            $scope.OpenSelectTalmud = function () {
                $scope.showBibleDialog = false;
                $scope.showTalmudDialog = true;
            };

            function initBreadCrumbs() {
                $scope.breadCrumbs = ['All Collections'];
            }
            initBreadCrumbs();

            TreeService.ready.then(function() {
                $scope.corpusTree = TreeService.corpusTree;
                $scope.treeNode = $scope.corpusTree;
                initCurrentLevel(null);
            });

            // based on http://stackoverflow.com/questions/14514461/how-to-bind-to-list-of-checkbox-values-with-angularjs
            // list selected nodes by key
            $scope.selectedNodes = SelectClassService.lastSelectedRootKeys.map(function(key){return key.substring("/Dicta Corpus/".length)});
            recalculatePartials();

            $rootScope.$on('lastSelectedRootKeys', function (event, args) {
                if (Array.isArray(args)) {
                    $scope.selectedNodes = args.map(function(key){return key.substring("/Dicta Corpus/".length)});
                    recalculatePartials();
                }
            });

            function initCurrentLevel(parentNode) {
                for (var i = 0; i < $scope.treeNode.length; i++) {
                    // add links back to the parent, so we can update selections
                    $scope.treeNode[i]['parent'] = parentNode;
                    TreeService.keyToNode[$scope.treeNode[i]['key']] = $scope.treeNode[i];
                }
            }

            // end of tree setup; helper functions come next

            $scope.expandNode = function (itemTitle) {
                var currentNode = $scope.treeNode;
                for (var i=0; i < currentNode.length; i++) {
                    if (currentNode[i]['title'] == itemTitle) {
                        $scope.treeNode = currentNode[i]['children'];
                        initCurrentLevel(currentNode[i]);
                        $scope.breadCrumbs.push(itemTitle);
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
                $scope.partialNodes = [];
                for (var i=0;i< $scope.selectedNodes.length; i++) {
                    var parent = TreeService.keyToNode[$scope.selectedNodes[i]]['parent'];
                    while (parent != null) {
                        if ($scope.partialNodes.indexOf(parent['key']) == -1)
                            $scope.partialNodes.push(parent['key']);
                        parent = parent['parent'];
                    }
                }
            }

            $scope.isNodeSelected = function isNodeSelected(node) {
                var parent = TreeService.keyToNode[node]['parent'];
                return $scope.selectedNodes.indexOf(node) > -1 || (parent != null && isNodeSelected(parent['key']));
            };

            $scope.isNodePartial = function isNodePartial(node) {
                return $scope.partialNodes.indexOf(node) > -1;
            };

            // toggle selection for a given node by key
            $scope.toggleSelection = function toggleSelection(itemKey) {
                // is currently selected, so this deselects
                if ($scope.isNodeSelected(itemKey)) {
                    // currently selected itself?
                    var idx = $scope.selectedNodes.indexOf(itemKey);
                    if (idx > -1) {
                        // yes, so remove it.
                        $scope.selectedNodes.splice(idx, 1);
                    }
                    else {
                        // select siblings and deselect ancestor
                        var currentNode = TreeService.keyToNode[itemKey];
                        while ((idx = $scope.selectedNodes.indexOf(currentNode['key'])) == -1) {
                            var children = currentNode['parent']['children'];
                            for (var i = 0; i < children.length; i++)
                                if (children[i] != currentNode)
                                    $scope.selectedNodes.push(children[i]['key']);
                            currentNode = currentNode['parent'];
                        }
                        $scope.selectedNodes.splice(idx, 1);
                    }
                }
                // is newly selected
                else {
                    // select this
                    $scope.selectedNodes.push(itemKey);
                    // check if all siblings are selected
                    var parent = TreeService.keyToNode[itemKey]['parent'];
                    if (parent != null) {
                        var sibCount = 0;
                        var siblings = parent['children'];
                        for (var i = 0; i < siblings.length; i++)
                            if ($scope.selectedNodes.indexOf(siblings[i]['key']) > -1)
                                sibCount++;
                        // if so, select the parent
                        if (sibCount == siblings.length)
                            $scope.toggleSelection(parent['key']);

                    }
                }

                // remove any descendants already selected
                for (var i = $scope.selectedNodes.length - 1; i>=0; i--)
                    removeIfAncestor($scope.selectedNodes, i, TreeService.keyToNode[itemKey]);

                recalculatePartials();

                $rootScope.$broadcast('lastSelectedRootKeys', $scope.selectedNodes.map(function(key){return "/Dicta Corpus/" + key;}));
            };

            $scope.selectCrumb = function (crumbNumber) {
                var oldCrumbs = $scope.breadCrumbs;
                initBreadCrumbs();
                $scope.treeNode = $scope.corpusTree;
                for (var i=1; i <= crumbNumber; i++) {
                    $scope.expandNode(oldCrumbs[i]);
                }

            };

            // $scope.getSelectedKeys = function () {
            //     var selRootNodes = $("#trainTree").dynatree("getTree").getSelectedNodes(true);
            //     // Get a list of ALL selected nodes
            //     selRootNodes = $("#trainTree").dynatree("getTree").getSelectedNodes(false);
            //
            //     var selRootKeys = $.map(selRootNodes, function (node) {
            //         return node.data.key;
            //     });
            //     return selRootKeys;
            // };

            
        }]
    };
});