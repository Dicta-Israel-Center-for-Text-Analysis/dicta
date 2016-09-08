jTextMinerApp.factory('SelectClassService', function ($rootScope) {
    var service = {
        Select_NumberOfChapters: 0,
        Select_NumberOfWords: 0,
        Select_ChunkMode: 'DoNotChunk',
        Select_MinimumChunkSize: 250,
        Select_ChunkSize: 0,
        lastSelectedRootKeys: [],
        lastTestSetSelectedRootKeys: [],
        testSetTitlesCommonPrefix: ""
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

    service.setTestSetRootKeys = function(rootKeys) {
        service.lastTestSetSelectedRootKeys = rootKeys;
        var keyCopy = rootKeys.slice();             // copy the list of keys
        var oneKey = keyCopy.shift() || "";         // take the first key or if there isn't any, use ""
        var commonKeySegments = oneKey.split('/');  // split on '/' into an array
        for (var keyIndex = 0; keyIndex < keyCopy.length; keyIndex++) { // check each key to see how much it has in common with the others
            var keySegments = keyCopy[keyIndex].split('/');             // split the key we're looking at
            for (var i = 0; i < commonKeySegments.length; i++) {                                // for each common key segment
                if (i == keySegments.length || commonKeySegments[i] != keySegments[i]) {        // if the key we're looking at doesn't have a segment at this position or if the segment at this position doesn't match, we've gone too far
                    commonKeySegments.splice(i);                                                // so trim the list of common segments here
                    break;                                                                      // and check the next key
                }
            }
        }
        service.testSetTitlesCommonPrefix = commonKeySegments.join('/');
    }
    return service;
});