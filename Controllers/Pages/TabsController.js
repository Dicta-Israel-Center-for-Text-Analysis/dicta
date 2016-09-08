// create the controller and inject Angular's $scope
jTextMinerApp.controller('TabsController', function ($scope, ClassService, $rootScope, SelectClassService, SaveClassInterface) {
    $scope.tabNumber = 0;
    $scope.goToTab = function (tabNumber)
    {
        tiberias_tour_pause();
        $scope.tabNumber = tabNumber;
        switch(tabNumber) {
            case 1: tiberias_tour(ParallelsTour); break;
            case 2: tiberias_tour(ClassificationTour); break;
            case 3: tiberias_tour(SegmentationTour); break;
        }
    };

    $scope.tabClass = function(tabNumber){
        return $scope.tabNumber == tabNumber ? "active" : "";
    };

    $scope.SelectedTestClassText = function () {
        if (SaveClassInterface.testSetActionMode == 'SelectOnlineCorpus')
            return SelectClassService.lastTestSetSelectedRootKeys.join(', ');
        else
            return "Uploaded Text";
    }
});