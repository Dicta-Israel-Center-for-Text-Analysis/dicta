jTextMinerApp.directive('selectOnlineCorpus', function ($rootScope) {
    return {
        restrict: 'AE',
        templateUrl: 'partials/templates/SelectOnlineCorpusTemplate.html',
        controller: ['$scope', function ($scope) {
            $scope.Select_OnlineCorpus = 'Bible';
            $scope.showBibleDialog = true;
            $scope.OpenSelectBible = function () {
                $scope.showBibleDialog = true;
            };
            // http://wwwendt.de/tech/dynatree/doc/dynatree-doc.html 
            $("#trainTree").dynatree({
                checkbox: true,
                selectMode: 3,
                children: treeData,
                onSelect: function (select, node) {
                    // Get a list of all selected TOP nodes
                    var selRootNodes = node.tree.getSelectedNodes(true);
                    // Get a list of ALL selected nodes
                    selRootNodes = node.tree.getSelectedNodes(false);
                    // ... and convert to a key array:
                    var selRootKeys = $.map(selRootNodes, function (node) {
                        return node.data.key;
                    });
                    //http://stackoverflow.com/questions/12371159/how-to-get-evaluated-attributes-inside-a-custom-directive
                    //http://stackoverflow.com/questions/30332098/get-value-from-directive-into-controller
                    //http://plnkr.co/edit/8IkbWrOHHiq4HDBNVyCP?p=preview
                    $rootScope.$broadcast('lastSelectedRootKeys', selRootKeys);
                    if ($scope.selectedClassIndex >= 0 && $scope.inited) {
                        // call this after click next because if it will be here 
                        // then every time we update the tree it will arise the on_select event
                        // solved by inited
                        //ExperimentService.Corpus_selectedRootKeys[ExperimentService.Corpus_classes[$scope.selectedClassIndex].id] = selRootKeys;
                        //console.log("test ExperimentService.Corpus_selectedRootKeys[ExperimentService.Corpus_classes[$scope.selectedClassIndex].id]:: " + ExperimentService.Corpus_selectedRootKeys[ExperimentService.Corpus_classes[$scope.selectedClassIndex].id]);
                    }
                },
                onDblClick: function (node, event) {
                    node.toggleSelect();
                },
                onKeydown: function (node, event) {
                    if (event.which == 32) {
                        node.toggleSelect();
                        return false;
                    }
                },
                // The following options are only required, if we have more than one tree on one page:
                initId: "treeData",
                cookieId: "dynatree-Cb",
                idPrefix: "dynatree-Cb-"
            });

            $scope.getSelectedKeys = function () {
                var selRootNodes = $("#trainTree").dynatree("getTree").getSelectedNodes(true);
                // Get a list of ALL selected nodes
                selRootNodes = $("#trainTree").dynatree("getTree").getSelectedNodes(false);

                var selRootKeys = $.map(selRootNodes, function (node) {
                    return node.data.key;
                });
                return selRootKeys;
            };

            
        }]
    };
});