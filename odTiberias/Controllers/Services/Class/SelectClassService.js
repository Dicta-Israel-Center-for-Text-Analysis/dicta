jTextMinerApp.factory('SelectClassService', function ($rootScope) {
    var service = {};
    
    service.Select_NumberOfChapters = 0;
    $rootScope.$watch('Select_NumberOfChapters', function () {
        $rootScope.$broadcast("Select_NumberOfChaptersUpdated");
    });
    service.Select_NumberOfWords = 0;
    $rootScope.$watch('Select_NumberOfWords', function () {
        $rootScope.$broadcast("Select_NumberOfWordsUpdated");
    });
    service.Select_ChunkMode = 'DoNotChunk';
    $rootScope.$watch('Select_ChunkMode', function () {
        $rootScope.$broadcast("Select_ChunkModeUpdated");
    });
    service.Select_MinimumChunkSize = 250;
    $rootScope.$watch('Select_MinimumChunkSize', function () {
        $rootScope.$broadcast("Select_MinimumChunkSizeUpdated");
    });
    service.Select_ChunkSize = 0;
    $rootScope.$watch('Select_ChunkSize', function () {
        $rootScope.$broadcast("Select_ChunkSizeUpdated");
    });

    service.lastSelectedRootKeys = [];
    $rootScope.$on('lastSelectedRootKeys', function (event, data) {
        service.lastSelectedRootKeys = data;
        $rootScope.$broadcast("lastSelectedRootKeysUpdated");
    });

    service.lastTestSetSelectedRootKeys = [];
    
    return service;
});