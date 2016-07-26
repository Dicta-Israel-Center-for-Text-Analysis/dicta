jTextMinerApp.directive('tabsZeroTab', function () {
    return {
        restrict: 'AE',
        templateUrl: 'partials/templates/TabsZeroTab.html',
        controller: ['$scope', '$location', 'InProgressService', 'SaveClassInterface', 'SelectClassService', 'ExperimentService', 'ParallelsService', '$sce', function ($scope, $location, InProgressService, SaveClassInterface, SelectClassService, ExperimentService, ParallelsService, $sce) {
            $scope.showInProcess = InProgressService.isReady != 1;
            $scope.$on('isReady_Updated', function () {
                $scope.showInProcess = InProgressService.isReady != 1;
            });

            $scope.chunks = ParallelsService.chunks;
            $scope.source = ParallelsService.source;
            
            $scope.chunkAsHTML = function (chunk) {
                return $sce.trustAsHtml(chunk);
            }
           

        }]
    };
});