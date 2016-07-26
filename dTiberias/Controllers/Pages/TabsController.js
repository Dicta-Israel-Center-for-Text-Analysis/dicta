// create the controller and inject Angular's $scope
jTextMinerApp.controller('TabsController', function ($scope, ClassService, $rootScope, SelectClassService) {
    
    $scope.goToZeroTab = function ()
    {
        $scope.zeroTabClass = "active";
        $scope.firstTabClass = "";
        $scope.secondTabClass = "";
        $scope.thirdTabClass = "";
    }
    $scope.goToFirstTab = function ()
    {
        $scope.zeroTabClass = "";
        $scope.firstTabClass = "active";
        $scope.secondTabClass = "";
        $scope.thirdTabClass = "";
    }
    $scope.goToSecondTab = function ()
    {
        $scope.zeroTabClass = "";
        $scope.firstTabClass = "";
        $scope.secondTabClass = "active";
        $scope.thirdTabClass = "";
    }
    $scope.goToThirdTab = function ()
    {
        $scope.zeroTabClass = "";
        $scope.firstTabClass = "";
        $scope.secondTabClass = "";
        $scope.thirdTabClass = "active";
    }
    $scope.goToZeroTab();

    $scope.editTestSet = function () {
        $scope.showClassDialog = true;
        $rootScope.$broadcast('lastSelectedRootKeys',SelectClassService.lastTestSetSelectedRootKeys);

        /*
        $scope.ExperimentMode = 'NewExperiment';

        ClassService.updateClassName('class ' + ClassService.Corpus_maxId);

        var selRootNodes = $("#trainTree").dynatree("getTree").getSelectedNodes(true);
        // Get a list of ALL selected nodes
        selRootNodes = $("#trainTree").dynatree("getTree").getSelectedNodes(false);

        var selRootKeys = $.map(selRootNodes, function (node) {
            return node.data.key;
        });
        for (var i in selRootKeys) {
            $("#trainTree").dynatree("getTree").getNodeByKey(selRootKeys[i]).select(false);
        }
        
        ClassService.updateExperimentActionMode(actionMode);
        */
    }
});