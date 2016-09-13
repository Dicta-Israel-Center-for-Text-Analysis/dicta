jTextMinerApp.factory('BrowseClassService', function ($rootScope, InProgressService) {
    var initialServiceValues = {
        countWordsForUploadedZipFile: [],
        countWordsForUploadedTxtFile: [],
        Browse_DoNotChunk_ChunkSize: 0,
        Browse_AppendAndChunk_ChunkSize: 0,
        Browse_ChunkBigFiles_ChunkSize: 0,
        Browse_NumberOfFiles: 0,
        Browse_NumberOfWords: 0,
        Browse_ChunkMode: 'DoNotChunk',
        zipFile: '',
        Browse_FileName: '', // $scope.zipFile.name
        Browse_MinimumChunkSize: 250,
        LastClassTotalNumberOfWords: 0
    };
    var service = angular.copy(initialServiceValues);

    // class dialog parameters
    service.updateCountWordsForUploadedZipFile = function (value) {
        this.countWordsForUploadedZipFile = value;
        InProgressService.updateIsReady(1);
        $rootScope.$broadcast("countWordsForUploadedZipFileUpdated");
    }
    // end class dialog parameters
    // txt class dialog parameters
    service.updateCountWordsForUploadedTxtFile = function (value) {
        this.countWordsForUploadedTxtFile = value;
        InProgressService.updateIsReady(1);
        $rootScope.$broadcast("countWordsForUploadedTxtFileUpdated");
    }
    // end txt class dialog parameters

    service.updateBrowse_DoNotChunk_ChunkSize = function (value) {
        this.Browse_DoNotChunk_ChunkSize = value;
        $rootScope.$broadcast("Browse_DoNotChunk_ChunkSizeUpdated");
    }

    service.updateBrowse_AppendAndChunk_ChunkSize = function (value) {
        this.Browse_AppendAndChunk_ChunkSize = value;
        $rootScope.$broadcast("Browse_AppendAndChunk_ChunkSizeUpdated");
    }
    
    service.updateBrowse_ChunkBigFiles_ChunkSize = function (value) {
        this.Browse_ChunkBigFiles_ChunkSize = value;
        $rootScope.$broadcast("Browse_ChunkBigFiles_ChunkSizeUpdated");
    }
    
    service.updateBrowse_NumberOfFiles = function (value) {
        this.Browse_NumberOfFiles = value;
        $rootScope.$broadcast("Browse_NumberOfFilesUpdated");
    }
    
    service.updateBrowse_NumberOfWords = function (value) {
        this.Browse_NumberOfWords = value;
        $rootScope.$broadcast("Browse_NumberOfWordsUpdated");
    }
    
    service.updateBrowse_ChunkMode = function (value) {
        this.Browse_ChunkMode = value;
        $rootScope.$broadcast("Browse_ChunkModeUpdated");
    }
    
    service.updateBrowse_FileName = function (value) {
        this.Browse_FileName = value;
        $rootScope.$broadcast("Browse_FileNameUpdated");
    }
    
    service.updateBrowse_MinimumChunkSize = function (value) {
        this.Browse_MinimumChunkSize = value;
        $rootScope.$broadcast("Browse_MinimumChunkSizeUpdated");
    }

    service.updateLastClassTotalNumberOfWordsValue = function (value) {
        this.LastClassTotalNumberOfWords = value;
        $rootScope.$broadcast("LastClassTotalNumberOfWordsValueUpdated");
    }
    
    service.reset = function () {
        var newCopy = angular.copy(initialServiceValues);
        // manual copy so that function properties aren't deleted
        for (var prop in newCopy)
        {
            service[prop] = newCopy[prop];
        }
    };

    $rootScope.$on('NewExperiment', service.reset);

    return service;
});