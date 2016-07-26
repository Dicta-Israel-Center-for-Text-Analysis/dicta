jTextMinerApp.directive('tabsFirstTab', function () {
    return {
        restrict: 'AE',
        templateUrl: 'partials/templates/TabsFirstTab.html',
        controller: ['$scope', '$location', 'InProgressService', 'SaveClassInterface', 'SelectClassService', 'ExperimentService', 'ParallelsService', '$sce', function ($scope, $location, InProgressService, SaveClassInterface, SelectClassService, ExperimentService, ParallelsService, $sce) {
            $scope.showInProcess = InProgressService.isReady != 1;
            $scope.$on('isReady_Updated', function () {
                $scope.showInProcess = InProgressService.isReady != 1;
            });


            $scope.currentGroupIndex = 0;
            $scope.updateGroupIndex = function (indx) {
                $scope.currentGroupIndex = indx;
            }

            $scope.chunks = ParallelsService.chunks;
            $scope.groupNames = ParallelsService.groupNames;
            $scope.groups = ParallelsService.groups;
            $scope.numOfParallelsInGroups = ParallelsService.numOfParallelsInGroups;
            $scope.numOfParallels = ParallelsService.numOfParallels;
            $scope.parrallelsPerChunk = ParallelsService.parrallelsPerChunk;
            $scope.$on('ParallelsUpdates', function () {
                $scope.chunks = ParallelsService.chunks;
                $scope.groupNames = ParallelsService.groupNames;
                $scope.groups = ParallelsService.groups;
                $scope.numOfParallelsInGroups = ParallelsService.numOfParallelsInGroups;
                $scope.numOfParallels = ParallelsService.numOfParallels;
                $scope.parrallelsPerChunk = ParallelsService.parrallelsPerChunk;
            });

            $scope.markParallels = function (chunk) {
                $scope.currentGroup = $scope.groups[$scope.currentGroupIndex];
                for (i = 0; i < $scope.currentGroup.parallels.length; i = i + 1) {
                    $scope.currentParallel = $scope.currentGroup.parallels[i];
                    chunk = chunk.replace($scope.currentParallel.chunkText, "<span style='background-color:#FFFEA4;'>" + $scope.currentParallel.chunkText + "</span>");
                }
                return $sce.trustAsHtml(chunk);
            }

            $scope.chunkSelectedIndex = -1;
            $scope.setSelectedChunkIndex = function (chunkIndex) {
                $scope.chunkSelectedIndex = chunkIndex;
            }
            $scope.markParallelsForSelectedChunk = function (chunkIndex) {
                if (chunkIndex == -1)
                    return "";
                var chunk = $scope.chunks[chunkIndex];
                for (j = 0; j < $scope.groups.length; j = j + 1) 
                {
                    $scope.currentGroup = $scope.groups[j];
                    for (i = 0; i < $scope.currentGroup.parallels.length; i = i + 1) {
                        $scope.currentParallel = $scope.currentGroup.parallels[i];
                        chunk = chunk.replace($scope.currentParallel.chunkText, "<span style='background-color:#FFFEA4;'>" + $scope.currentParallel.chunkText + "</span>");
                    }
                }
                return $sce.trustAsHtml(chunk);
            }
            

        }]
    };
});