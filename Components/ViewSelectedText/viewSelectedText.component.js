jTextMinerApp.component('viewSelectedText', {
        templateUrl: 'Components/ViewSelectedText/viewSelectedText.component.html',
        controller: function ($scope, SelectClassService, $sce, APIService, UserService, $timeout) {
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

            ctrl.trimTitle = function(title) {
                return title.substr(SelectClassService.testSetTitlesCommonPrefix.length + 1);
            }

            ctrl.saveText = function () {
                UserService.saveSelection({
                    title: SelectClassService.testText.title,
                    subtitle: SelectClassService.testText.subtitle,
                    type: 'Text',
                    time: Date.now(),
                    text: SelectClassService.testText
                });
                ctrl.saveMessage = 'Saved';
                $timeout(() => { ctrl.saveMessage = ''; }, 3000);
            }
        }
    }
);