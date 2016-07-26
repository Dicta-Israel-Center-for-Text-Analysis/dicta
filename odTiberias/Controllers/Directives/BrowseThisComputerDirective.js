jTextMinerApp.directive('browseThisComputer', function ($rootScope) {
    return {
        restrict: 'AE',
        scope: {
            showClassName: '=showClassName'
        },
        templateUrl: 'partials/templates/BrowseThisComputerTemplate.html',
        controller: ['$scope', 'focus', 'ExperimentService', 'fileUpload', 'ngDialog', 'BrowseClassService', 'InProgressService', function ($scope, focus, ExperimentService, fileUpload, ngDialog, BrowseClassService, InProgressService) {
            focus('Browse_focusZipFile');

            //$scope.showClassName = true;

            //input
            $scope.Browse_DoNotChunk_ChunkSize = BrowseClassService.Browse_DoNotChunk_ChunkSize;
            $scope.$watch('Browse_DoNotChunk_ChunkSize', function () {
                BrowseClassService.updateBrowse_DoNotChunk_ChunkSize($scope.Browse_DoNotChunk_ChunkSize);
            });
            $scope.Browse_AppendAndChunk_ChunkSize = BrowseClassService.Browse_AppendAndChunk_ChunkSize;
            $scope.$watch('Browse_AppendAndChunk_ChunkSize', function () {
                BrowseClassService.updateBrowse_AppendAndChunk_ChunkSize($scope.Browse_AppendAndChunk_ChunkSize);
            });
            $scope.Browse_ChunkBigFiles_ChunkSize = BrowseClassService.Browse_ChunkBigFiles_ChunkSize;
            $scope.$watch('Browse_ChunkBigFiles_ChunkSize', function () {
                BrowseClassService.updateBrowse_ChunkBigFiles_ChunkSize($scope.Browse_ChunkBigFiles_ChunkSize);
            });
            $scope.Browse_NumberOfFiles = BrowseClassService.countWordsForUploadedZipFile.length;
            $scope.$watch('Browse_NumberOfFiles', function () {
                BrowseClassService.updateBrowse_NumberOfFiles($scope.Browse_NumberOfFiles);
            });
            $scope.Browse_NumberOfWords = BrowseClassService.Browse_NumberOfWords;
            $scope.$watch('Browse_NumberOfWords', function () {
                BrowseClassService.updateBrowse_NumberOfWords($scope.Browse_NumberOfWords);
            });
            $scope.Browse_ChunkMode = BrowseClassService.Browse_ChunkMode;
            $scope.$watch('Browse_ChunkMode', function () {
                BrowseClassService.updateBrowse_ChunkMode($scope.Browse_ChunkMode);
            });
            $scope.Browse_MinimumChunkSize = BrowseClassService.Browse_MinimumChunkSize;
            $scope.$watch('Browse_MinimumChunkSize', function () {
                BrowseClassService.updateBrowse_MinimumChunkSize($scope.Browse_MinimumChunkSize);
            });
            
            $scope.zipFile='';
            $scope.$watch('zipFile', function () {
                BrowseClassService.updateBrowse_FileName($scope.zipFile.name);
            });


            $scope.Browse_fileUploaded = false;
            //http://stackoverflow.com/questions/17922557/angularjs-how-to-check-for-changes-in-file-input-fields
            //http://stackoverflow.com/questions/16631702/file-pick-with-angular-js
            $scope.file_changed = function (event) {
                $scope.$apply(function () {
                    $scope.Browse_fileUploaded = true;
                    var files = event.target.files;
                    $scope.UploadZipFile();
                });
            };

            $scope.countWordsForUploadedZipFile = BrowseClassService.countWordsForUploadedZipFile;
            // http://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs
            $scope.UploadZipFile = function () {
                InProgressService.updateIsReady(0);

                var zipFile = $scope.zipFile;
                console.log('file is ' + JSON.stringify(zipFile));
                var uploadUrl = ExperimentService.baseUrl + "/uploadZipFile";
                fileUpload.uploadFileToUrl(zipFile, uploadUrl, 'zipFile', ExperimentService.user);
            };

            $scope.$on('countWordsForUploadedZipFileUpdated', function () {
                $scope.countWordsForUploadedZipFile = BrowseClassService.countWordsForUploadedZipFile;
                $scope.Browse_NumberOfFiles = BrowseClassService.countWordsForUploadedZipFile.length;
                $scope.Browse_NumberOfWords = 0;
                for (var i = 0; i < $scope.Browse_NumberOfFiles; i++) {
                    $scope.Browse_NumberOfWords += BrowseClassService.countWordsForUploadedZipFile[i];
                }
                $scope.updateBrowse_ChunkSize();
                BrowseClassService.updateLastClassTotalNumberOfWordsValue($scope.Browse_NumberOfWords);
                focus('Browse_focusClassName');
            });

            $scope.updateBrowse_ChunkSize = function () {
                $scope.Browse_DoNotChunk_ChunkSize = $scope.Browse_NumberOfFiles;

                $scope.Browse_AppendAndChunk_ChunkSize = Math.floor($scope.Browse_NumberOfWords / $scope.Browse_MinimumChunkSize);

                $scope.Browse_ChunkBigFiles_ChunkSize = $scope.Browse_NumberOfFiles;
                for (var i = 0; i < $scope.Browse_NumberOfFiles; i++) {
                    $scope.Browse_ChunkBigFiles_ChunkSize += (BrowseClassService.countWordsForUploadedZipFile[i] / $scope.Browse_MinimumChunkSize);
                }
                $scope.Browse_ChunkBigFiles_ChunkSize = Math.floor($scope.Browse_ChunkBigFiles_ChunkSize);
            };

        }]
    };
});