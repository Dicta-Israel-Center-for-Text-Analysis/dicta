jTextMinerApp.factory('SelectClassService', function () {
    var service = {
        newTextFromCorpus(keys){
            return {
                mode: 'SelectOnlineCorpus',
                keys,
                textInfo: {}
            }
        },
        newTextFromUpload(filename, chunkMode, chunkSize){
            return {
                mode: 'BrowseThisComputer',
                filename,
                chunkMode,
                chunkSize,
                keys: [],
                textInfo: {}
            }
        },
        testText: null,
        testSetTitlesCommonPrefix: ""
    };

    service.setTestText = function(text) {
        service.testText = text;
        if (text.mode != 'SelectOnlineCorpus') return;
        var rootKeys = text.keys;
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