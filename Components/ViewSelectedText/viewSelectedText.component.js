jTextMinerApp.component('viewSelectedText', {
        templateUrl: 'Components/ViewSelectedText/viewSelectedText.component.html',
        controller: ['$scope', 'InProgressService', 'SelectClassService', '$sce', 'APIService', 'SaveClassInterface',
            function ($scope, InProgressService, SelectClassService, $sce, APIService, SaveClassInterface) {
            var ctrl = this;
            ctrl.showInProcess = InProgressService.isReady != 1;
            $scope.$on('isReady_Updated', function () {
                ctrl.showInProcess = InProgressService.isReady != 1;
            });

            ctrl.chunkAsHTML = function (chunk) {
                return $sce.trustAsHtml(chunk);
            };

            //UnknownTestClass
            var classData = SaveClassInterface.getInstance({
                text: SelectClassService.testText
            });

            APIService.apiRun({crud: 'UnknownTestClassAsChunks'}, classData, function (response) {
                ctrl.chunks = response.chunks;
                ctrl.source = response.source;

                InProgressService.updateIsReady(1);

            });
        }]
    }
);