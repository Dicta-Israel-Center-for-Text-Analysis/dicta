jTextMinerApp.component('viewSelectedText', {
        templateUrl: 'Components/ViewSelectedText/viewSelectedText.component.html',
        controller: ['$scope', 'InProgressService', 'SelectClassService', '$sce', 'APIService',
            function ($scope, InProgressService, SelectClassService, $sce, APIService) {
            var ctrl = this;
            ctrl.showInProcess = InProgressService.isReady != 1;
            $scope.$on('isReady_Updated', function () {
                ctrl.showInProcess = InProgressService.isReady != 1;
            });

            ctrl.chunkAsHTML = function (chunk) {
                return $sce.trustAsHtml(chunk);
            };

            APIService.call('TextFeatures/GetText',{
                    "keys": SelectClassService.testText.keys,
                    "chunkType": "LARGE"
                })
                .then(function (response) {
                ctrl.chunks = response.data.map(chunk => chunk.text);
                ctrl.source = response.data.map(chunk => chunk.chunkKey);

                InProgressService.updateIsReady(1);

            });
        }]
    }
);