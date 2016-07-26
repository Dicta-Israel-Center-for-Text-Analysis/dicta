// create the controller and inject Angular's $scope
jTextMinerApp.controller('TxtClassDialogController', function ($scope, ngDialog, ExperimentService, fileUpload, focus, SegmentationService, BrowseClassService, InProgressService, ClassService) {
    
    focus('Browse_focusTxtFile');

    $scope.showInProcess = InProgressService.isReady != 1;
    $scope.$on('isReady_Updated', function () {
        $scope.showInProcess = InProgressService.isReady != 1;
    });

    //input
    $scope.Browse_DoNotChunk_ChunkSize = 0;
    $scope.Browse_AppendAndChunk_ChunkSize = 0;
    $scope.Browse_ChunkBigFiles_ChunkSize = 0;
    $scope.Browse_NumberOfFiles = BrowseClassService.countWordsForUploadedTxtFile.length;
    $scope.Browse_NumberOfWords = 0;
    
    $scope.Select_OnlineCorpus = 'Bible';

    $scope.Segmentation_ActionMode = SegmentationService.Segmentation_ActionMode;
    $scope.$on('SegmentationActionModeValuesUpdated', function () {
        //Segmentation valuesUpdated
        $scope.Segmentation_ActionMode = SegmentationService.Segmentation_ActionMode;
    });

    $scope.txtFile = '';
    


    $scope.Browse_fileUploaded = false;
    //http://stackoverflow.com/questions/17922557/angularjs-how-to-check-for-changes-in-file-input-fields
    //http://stackoverflow.com/questions/16631702/file-pick-with-angular-js
    $scope.file_changed = function (event) {
        $scope.$apply(function () {
            $scope.Browse_fileUploaded = true;
            var files = event.target.files;
            $scope.UploadTxtFile();
        });
    };

    $scope.countWordsForUploadedTxtFile = BrowseClassService.countWordsForUploadedTxtFile;
    // http://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs
    $scope.UploadTxtFile = function () {
        InProgressService.updateIsReady(0);

        var txtFile = $scope.txtFile;
        console.log('file is ' + JSON.stringify(txtFile));
        var uploadUrl = ExperimentService.baseUrl + "/uploadTxtFile";
        fileUpload.uploadFileToUrl(txtFile, uploadUrl, 'txtFile', ExperimentService.user);
    };

    $scope.$on('countWordsForUploadedTxtFileUpdated', function () {
        $scope.countWordsForUploadedTxtFile = BrowseClassService.countWordsForUploadedTxtFile;
        $scope.Browse_NumberOfFiles = BrowseClassService.countWordsForUploadedTxtFile.length;
        $scope.Browse_NumberOfWords = 0;
        for (var i = 0; i < $scope.Browse_NumberOfFiles; i++) {
            $scope.Browse_NumberOfWords += BrowseClassService.countWordsForUploadedTxtFile[i];
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
            $scope.Browse_ChunkBigFiles_ChunkSize += (BrowseClassService.countWordsForUploadedTxtFile[i] / $scope.Browse_MinimumChunkSize);
        }
        $scope.Browse_ChunkBigFiles_ChunkSize = Math.floor($scope.Browse_ChunkBigFiles_ChunkSize);
    };


    $scope.Next = function (data) {
        $scope.confirm(data);
    }

    //for first version
    $scope.maxId = ClassService.Corpus_maxId;
    $scope.classes = ClassService.Corpus_classes;
    $scope.selectedClassIndex = ClassService.selectedClassIndex;
    $scope.$watch('selectedClassIndex', function () {
        if (!angular.isUndefined($scope.selectedClassIndex)) {
            ClassService.updateSelectedClassIndex($scope.selectedClassIndex);
        }
    });
    
});