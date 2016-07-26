// create the controller and inject Angular's $scope
jTextMinerApp.controller('TabsController', function ($scope, ClassService) {

    $scope.goToFirstTab = function ()
    {
        $scope.firstTabClass = "active";
        $scope.secondTabClass = "";
        $scope.thirdTabClass = "";
    }
    $scope.goToSecondTab = function ()
    {
        $scope.firstTabClass = "";
        $scope.secondTabClass = "active";
        $scope.thirdTabClass = "";
    }
    $scope.goToThirdTab = function ()
    {
        $scope.firstTabClass = "";
        $scope.secondTabClass = "";
        $scope.thirdTabClass = "active";
    }
    $scope.goToFirstTab();

    $scope.editTestSet = function () {
        $scope.showClassDialog = true;

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