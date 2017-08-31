jTextMinerApp.component('viewSelectedText', {
        templateUrl: 'Components/ViewSelectedText/viewSelectedText.component.html',
        controller: ['$scope', 'SelectClassService', '$sce', 'APIService',
            function ($scope, SelectClassService, $sce, APIService) {
            const ctrl = this;
            ctrl.showInProcess = false;

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
            });
        }]
    }
);