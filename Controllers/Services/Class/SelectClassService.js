jTextMinerApp.factory('SelectClassService', function () {
    var service = {
        // unused; left for compatibility with save API
        Select_NumberOfChapters: 0,
        Select_NumberOfWords: 0,
        Select_ChunkMode: 'DoNotChunk',
        Select_MinimumChunkSize: 250,
        Select_ChunkSize: 0,

        lastSelectedRootKeys: [],
        lastTestSetSelectedRootKeys: [],
        testSetTitlesCommonPrefix: ""
    };

    service.setTestSetRootKeys = function(rootKeys) {
        service.lastTestSetSelectedRootKeys = rootKeys;
        // update testSetTitlesCommonPrefix
        var keyCopy = rootKeys.slice();             // copy the list of keys
        var oneKey = keyCopy.shift() || "";         // take the first key or if there isn't any, use ""
        var commonKeySegments = oneKey.split('/');  // split on '/' into an array, and use this as an initial guess
        commonKeySegments.splice(commonKeySegments.length - 1);  // except for the last segment
        for (var keyIndex = 0; keyIndex < keyCopy.length; keyIndex++) { // loop over all keys, and shrink the prefix if needed
            var keySegments = keyCopy[keyIndex].split('/');      // split the key we're looking at
            for (var i = 0; i < commonKeySegments.length; i++) { // for each common key segment
                if (i == keySegments.length                      // if this key doesn't have a segment at this position
                    || commonKeySegments[i] != keySegments[i]) { // or if the segment at this position doesn't match,
                                                                 // we've gone too far.
                    commonKeySegments.splice(i);                 // so trim the list of common segments here
                    break;                                       // and check the next key
                }
            }
        }
        service.testSetTitlesCommonPrefix = commonKeySegments.join('/');
    }
    return service;
});