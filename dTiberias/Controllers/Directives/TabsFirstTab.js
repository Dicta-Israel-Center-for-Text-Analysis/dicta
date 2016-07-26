﻿jTextMinerApp.directive('tabsFirstTab', function () {
    return {
        restrict: 'AE',
        templateUrl: 'partials/templates/TabsFirstTab.html',
        controller: ['$scope', '$location', 'InProgressService', 'SaveClassInterface', 'SelectClassService', 'ExperimentService', 'ParallelsService', '$sce', function ($scope, $location, InProgressService, SaveClassInterface, SelectClassService, ExperimentService, ParallelsService, $sce) {
            $scope.showInProcess = InProgressService.isReady != 1;
            $scope.$on('isReady_Updated', function () {
                $scope.showInProcess = InProgressService.isReady != 1;
            });

            $scope.currentGroupIndex = -1;
            $scope.updateGroupIndex = function (indx) {
                if ($scope.currentGroupIndex == indx)
                    $scope.currentGroupIndex = -1;
                else
                    $scope.currentGroupIndex = indx;
            }

            $scope.smallUnits = ParallelsService.smallUnits;
            $scope.sourceForSmallUnits = ParallelsService.sourceForSmallUnits;

            $scope.groupNames = ParallelsService.groupNames;
            $scope.groups = ParallelsService.groups;
            $scope.numOfParallelsInGroups = ParallelsService.numOfParallelsInGroups;
            $scope.numOfParallels = ParallelsService.numOfParallels;
            $scope.parrallelsPerChunk = ParallelsService.parrallelsPerChunk;
            $scope.$on('ParallelsUpdates', function () {
                $scope.smallUnits = ParallelsService.smallUnits;
                $scope.sourceForSmallUnits = ParallelsService.sourceForSmallUnits;
                $scope.groupNames = ParallelsService.groupNames;
                $scope.groups = ParallelsService.groups;
                $scope.numOfParallelsInGroups = ParallelsService.numOfParallelsInGroups;
                $scope.numOfParallels = ParallelsService.numOfParallels;
                $scope.parrallelsPerChunk = ParallelsService.parrallelsPerChunk;
            });

            $scope.markParallels = function (chunk) {
                $scope.currentGroup = $scope.groups[$scope.currentGroupIndex];
                if ($scope.currentGroup== null  || $scope.currentGroup['parallels'] == null) return $sce.trustAsHtml(chunk);
                for (i = 0; i < $scope.currentGroup.parallels.length; i = i + 1) {
                    $scope.currentParallel = $scope.currentGroup.parallels[i];
                    chunk = chunk.replace($scope.currentParallel.chunkText, "<span style='background-color:#FFFEA4;'>" + $scope.currentParallel.chunkText + "</span>");
                }
                return $sce.trustAsHtml(chunk);
            }
            $scope.createThumbnail = function (chunk) {
                var dotsNail = "";
                for (i = 0; i < chunk.length / 20; i = i + 1) {
                    dotsNail += ". ";
                }
                return $sce.trustAsHtml(dotsNail);
            }
            $scope.chunkSelectedIndex = -1;
            $scope.setSelectedChunkIndex = function (chunkIndex) {
                $scope.chunkSelectedIndex = chunkIndex;
            }
            $scope.setSelectedClass = function (chunkIndex) {
                if ($scope.chunkSelectedIndex == chunkIndex)
                    return "sid-bar-selected";
                return "";
            }
            $scope.markParallelsForSelectedChunk = function (chunkIndex) {
                if (chunkIndex == -1)
                    return "";
                var chunk = $scope.smallUnits[chunkIndex];
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

            $scope.parallelFilter = function (item) {
                if ($scope.currentGroupIndex == -1)
                    return true;
                else
                {
                    $scope.currentGroup = $scope.groups[$scope.currentGroupIndex];
                    if ($scope.currentGroup== null  || $scope.currentGroup['parallels'] == null) return true;
                    for (i = 0; i < $scope.currentGroup.parallels.length; i = i + 1) {
                        $scope.currentParallel = $scope.currentGroup.parallels[i];
                        for (j = 0; j < $scope.smallUnits.length; j = j + 1) {
                            if (item == $scope.smallUnits[j])
                            {
                                if ($scope.currentParallel.chunkIndex == j)
                                    return true;
                            }
                        }

                        
                    }
                }
                return false;
            };

        }]
    };
});