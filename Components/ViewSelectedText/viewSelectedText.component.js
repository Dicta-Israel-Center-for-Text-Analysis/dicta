jTextMinerApp.component('viewSelectedText', {
        templateUrl: 'Components/ViewSelectedText/viewSelectedText.component.html',
        controller: ['$scope', '$location', 'InProgressService', 'SelectClassService', 'ExperimentService', 'ParallelsService', '$sce', 'APIService', 'SaveClassInterface', function ($scope, $location, InProgressService, SelectClassService, ExperimentService, ParallelsService, $sce, APIService, SaveClassInterface) {
            $scope.showInProcess = InProgressService.isReady != 1;
            $scope.$on('isReady_Updated', function () {
                $scope.showInProcess = InProgressService.isReady != 1;
            });

            $scope.chunkAsHTML = function (chunk) {
                return $sce.trustAsHtml(chunk);
            };

            //UnknownTestClass
            var classData = SaveClassInterface.getInstance();

            if (angular.equals(classData.actionMode, 'SelectOnlineCorpus')) {
                classData.select_RootKeys = SelectClassService.lastTestSetSelectedRootKeys;
            }
            classData.expType = 'Classification';
            APIService.apiRun({crud: 'UnknownTestClassAsChunks'}, classData, function (response) {
                ParallelsService.updateChunks(response.chunks);
                ParallelsService.updateSource(response.source);
                $scope.chunks = ParallelsService.chunks;
                $scope.source = ParallelsService.source;

                InProgressService.updateIsReady(1);

            });
        }]
    }
);