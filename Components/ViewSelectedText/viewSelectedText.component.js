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
                text: SelectClassService.testText,
                experimentName: 'Untitled'
            });

            APIService.call('TextFeatures/GetText',{
                    "keys": SelectClassService.testText.keys.map(textKey =>
                        ({
                            "keyType": textKey.startsWith('/Dicta Corpus/') ? "DICTA_CORPUS" : "USER_UPLOAD",
                            "key": textKey
                        })
                    ),
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