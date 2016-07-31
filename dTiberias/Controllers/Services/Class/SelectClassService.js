﻿jTextMinerApp.factory('SelectClassService', function ($rootScope) {
    var service = {
        Select_NumberOfChapters: 0,
        Select_NumberOfWords: 0,
        Select_ChunkMode: 'DoNotChunk',
        Select_MinimumChunkSize: 250,
        Select_ChunkSize: 0,
        lastSelectedRootKeys: [],
        lastTestSetSelectedRootKeys: []
    };

    // broadcast any changes, except for lastTestSetSelectedRootKeys
    $rootScope.$watch('Select_NumberOfChapters', function () {
        $rootScope.$broadcast("Select_NumberOfChaptersUpdated");
    });
    $rootScope.$watch('Select_NumberOfWords', function () {
        $rootScope.$broadcast("Select_NumberOfWordsUpdated");
    });
    $rootScope.$watch('Select_ChunkMode', function () {
        $rootScope.$broadcast("Select_ChunkModeUpdated");
    });
    $rootScope.$watch('Select_MinimumChunkSize', function () {
        $rootScope.$broadcast("Select_MinimumChunkSizeUpdated");
    });
    $rootScope.$watch('Select_ChunkSize', function () {
        $rootScope.$broadcast("Select_ChunkSizeUpdated");
    });
    $rootScope.$on('lastSelectedRootKeys', function (event, data) {
        service.lastSelectedRootKeys = data;
        $rootScope.$broadcast("lastSelectedRootKeysUpdated");
    });
    
    return service;
});