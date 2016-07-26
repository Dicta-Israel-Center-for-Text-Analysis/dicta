jTextMinerApp.factory('BrowseClassService', function ($rootScope, InProgressService) {
    var service = {};

    // class dialog parameters
    service.countWordsForUploadedZipFile = [];
    service.updateCountWordsForUploadedZipFile = function (value) {
        this.countWordsForUploadedZipFile = value;
        InProgressService.updateIsReady(1);
        $rootScope.$broadcast("countWordsForUploadedZipFileUpdated");
    }
    // end class dialog parameters
    // txt class dialog parameters
    service.countWordsForUploadedTxtFile = [];
    service.updateCountWordsForUploadedTxtFile = function (value) {
        this.countWordsForUploadedTxtFile = value;
        InProgressService.updateIsReady(1);
        $rootScope.$broadcast("countWordsForUploadedTxtFileUpdated");
    }
    // end txt class dialog parameters

    service.Browse_DoNotChunk_ChunkSize = 0;
    service.updateBrowse_DoNotChunk_ChunkSize = function (value) {
        this.Browse_DoNotChunk_ChunkSize = value;
        $rootScope.$broadcast("Browse_DoNotChunk_ChunkSizeUpdated");
    }

    service.Browse_AppendAndChunk_ChunkSize = 0;
    service.updateBrowse_AppendAndChunk_ChunkSize = function (value) {
        this.Browse_AppendAndChunk_ChunkSize = value;
        $rootScope.$broadcast("Browse_AppendAndChunk_ChunkSizeUpdated");
    }
    
    service.Browse_ChunkBigFiles_ChunkSize = 0;
    service.updateBrowse_ChunkBigFiles_ChunkSize = function (value) {
        this.Browse_ChunkBigFiles_ChunkSize = value;
        $rootScope.$broadcast("Browse_ChunkBigFiles_ChunkSizeUpdated");
    }
    
    service.Browse_NumberOfFiles = service.countWordsForUploadedZipFile.length;
    service.updateBrowse_NumberOfFiles = function (value) {
        this.Browse_NumberOfFiles = value;
        $rootScope.$broadcast("Browse_NumberOfFilesUpdated");
    }
    
    service.Browse_NumberOfWords = 0;
    service.updateBrowse_NumberOfWords = function (value) {
        this.Browse_NumberOfWords = value;
        $rootScope.$broadcast("Browse_NumberOfWordsUpdated");
    }
    
    service.Browse_ChunkMode = 'DoNotChunk';
    service.updateBrowse_ChunkMode = function (value) {
        this.Browse_ChunkMode = value;
        $rootScope.$broadcast("Browse_ChunkModeUpdated");
    }
    
    service.zipFile = '';
    
    service.Browse_FileName = ''; // $scope.zipFile.name
    service.updateBrowse_FileName = function (value) {
        this.Browse_FileName = value;
        $rootScope.$broadcast("Browse_FileNameUpdated");
    }
    
    service.Browse_ChunkMode = 'DoNotChunk';
    service.updateBrowse_ChunkMode = function (value) {
        this.Browse_ChunkMode = value;
        $rootScope.$broadcast("Browse_ChunkModeUpdated");
    }
    
    service.Browse_MinimumChunkSize = 250;
    service.updateBrowse_MinimumChunkSize = function (value) {
        this.Browse_MinimumChunkSize = value;
        $rootScope.$broadcast("Browse_MinimumChunkSizeUpdated");
    }

    service.LastClassTotalNumberOfWords = 0;
    service.updateLastClassTotalNumberOfWordsValue = function (value) {
        this.LastClassTotalNumberOfWords = value;
        $rootScope.$broadcast("LastClassTotalNumberOfWordsValueUpdated");
    }
    

    return service;
});