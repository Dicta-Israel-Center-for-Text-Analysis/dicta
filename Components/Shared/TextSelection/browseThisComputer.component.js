jTextMinerApp.component('browseThisComputer', {
    bindings: { browseData: '=' },
    templateUrl: 'Components/Shared/TextSelection/browseThisComputer.component.html',
    controller: ['$scope', 'focus', 'fileUpload', 'ngDialog', 'InProgressService', 'UserService',
        function ($scope, focus, fileUpload, ngDialog, InProgressService, UserService) {
            var ctrl = this;

            focus('Browse_focusZipFile');

            //input
            ctrl.browseData = {
                zipFile: '',
                minimumChunkSize: 250,
                chunkMode: 'DoNotChunk'
            };
            ctrl.Browse_fileUploaded = false;
            ctrl.file_changed = function () {
                ctrl.Browse_fileUploaded = true;
                ctrl.UploadZipFile();
            };

            ctrl.UploadZipFile = function () {
                InProgressService.updateIsReady(0);

                ctrl.browseData = SelectClassService.newTextFromUpload(ctrl.zipFile, 'DoNotChunk', 250);
                fileUpload.uploadFileToUrl(ctrl.zipFile, 'zipFile', UserService.user)
                    .then(function (wordCounts) {
                        InProgressService.updateIsReady(1);
                        ctrl.browseData.textInfo.wordCounts = wordCounts;
                        // reduce is used to sum the array
                        ctrl.browseData.textInfo.totalWordCount = wordCounts.reduce((a, b) => a + b, 0);
                        ctrl.browseData.textInfo.numberOfFiles = wordCounts.length;

                        ctrl.browseData.textInfo.doNotChunk_ChunkSize = ctrl.browseData.numberOfFiles;
                        ctrl.calculateChunks();

                        focus('Browse_focusClassName');
                    });
            };

            ctrl.calculateChunks = function () {
                ctrl.browseData.textInfo.appendAndChunk_ChunkSize
                    = Math.floor(ctrl.browseData.textInfo.totalWordCount / ctrl.browseData.chunkSize);
                ctrl.browseData.textInfo.chunkBigFiles_ChunkSize = Math.floor(
                    ctrl.browseData.textInfo.wordCounts.reduce(
                        (sum, wordCount) => (wordCount / ctrl.browseData.chunkSize) + sum,
                        ctrl.browseData.textInfo.numberOfFiles
                    )
                );
            }
        }]
});