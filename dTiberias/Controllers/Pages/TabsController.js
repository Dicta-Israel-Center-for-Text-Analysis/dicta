// create the controller and inject Angular's $scope
jTextMinerApp.controller('TabsController', function ($scope, ClassService, $rootScope, SelectClassService, SaveClassInterface) {
    
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

    $scope.SelectedTestClassText = function () {
        if (SaveClassInterface.testSetActionMode == 'SelectOnlineCorpus')
            return SelectClassService.lastTestSetSelectedRootKeys.join(', ');
        else
            return "Uploaded Text";
    }
});