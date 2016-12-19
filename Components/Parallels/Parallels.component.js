jTextMinerApp.component('parallels',
    {
        templateUrl: 'Components/Parallels/Parallels.component.html',
        controller: ['$scope', '$location', 'InProgressService', 'SelectClassService', 'ExperimentService', 'ParallelsService', '$sce', function ($scope, $location, InProgressService, SelectClassService, ExperimentService, ParallelsService, $sce) {
            $scope.parallels = ParallelsService;
            $scope.selectClassService = SelectClassService;

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

            $scope.advancedSettings = 0; // show the basic settings tab first
            $scope.runParallels = function () {
                ParallelsService.runParallels($scope.minParallelLength, $scope.maxParallelSkip);
            }

            $scope.minParallelLength = 12;
            $scope.maxParallelSkip = 6;

            $scope.smallUnits = ParallelsService.smallUnits;
            $scope.sourceForSmallUnits = ParallelsService.sourceForSmallUnits;

            $scope.groupNames = ParallelsService.groupNames;
            $scope.groups = ParallelsService.groups;
            $scope.numOfParallelsInGroups = ParallelsService.numOfParallelsInGroups;
            $scope.numOfParallels = ParallelsService.numOfParallels;
            $scope.parallelsPerChunk = ParallelsService.parallelsPerChunk;
            $scope.$on('ParallelsUpdates', function () {
                $scope.smallUnits = ParallelsService.smallUnits;
                $scope.sourceForSmallUnits = ParallelsService.sourceForSmallUnits;
                $scope.groupNames = ParallelsService.groupNames;
                $scope.groups = ParallelsService.groups;
                $scope.numOfParallelsInGroups = ParallelsService.numOfParallelsInGroups;
                $scope.numOfParallels = ParallelsService.numOfParallels;
                $scope.parallelsPerChunk = ParallelsService.parallelsPerChunk;
            });

            $scope.markParallels = function (chunk) {
                $scope.currentGroup = $scope.groups[$scope.currentGroupIndex];
                if ($scope.currentGroup == null || $scope.currentGroup['parallels'] == null) return $sce.trustAsHtml(chunk);
                for (i = 0; i < $scope.currentGroup.parallels.length; i = i + 1) {
                    $scope.currentParallel = $scope.currentGroup.parallels[i];
                    chunk = chunk.replace($scope.currentParallel.chunkText, "<span style='background-color:#FFFEA4;'>" + $scope.currentParallel.chunkText + "</span>");
                }
                return $sce.trustAsHtml(chunk);
            }
            $scope.createThumbnail = function (chunk) {
                if (chunk == null)
                    return "";
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
                for (j = 0; j < $scope.groups.length; j = j + 1) {
                    $scope.currentGroup = $scope.groups[j];
                    for (i = 0; i < $scope.currentGroup.parallels.length; i = i + 1) {
                        $scope.currentParallel = $scope.currentGroup.parallels[i];
                        chunk = chunk.replace($scope.currentParallel.chunkText, "<span style='background-color:#FFFEA4;'>" + $scope.currentParallel.chunkText + "</span>");
                    }
                }
                return $sce.trustAsHtml(chunk);
            }

            $scope.parallelFilter = function (itemIndex) {
                if ($scope.currentGroupIndex == -1)
                    return true;
                else {
                    $scope.currentGroup = $scope.groups[$scope.currentGroupIndex];
                    // most likely to happen if api call failed
                    if ($scope.currentGroup == null || $scope.currentGroup['parallels'] == null) return true;
                    // for each parallel in the current group, check its chunkIndex
                    for (i = 0; i < $scope.currentGroup.parallels.length; i = i + 1) {
                        $scope.currentParallel = $scope.currentGroup.parallels[i];
                        if ($scope.currentParallel.chunkIndex == itemIndex)
                            return true;
                    }
                }
                return false;
            };

            $scope.keys = Object.keys;

            $scope.removePrefix = function (groupName, chunkName, separatorLength) {
                // if groupName is "" then there's also no separator to delete,
                // and if the function is given invalid values during template init, just return
                if (!groupName || !chunkName)
                    return chunkName;
                return chunkName.substring(groupName.length + separatorLength);
            }

        }]
    }
    );