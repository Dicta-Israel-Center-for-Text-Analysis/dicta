jTextMinerApp.factory('SelectClassService', function (UserService, APIService, TreeService) {
    const service = {
        testText: null,
        testSetTitlesCommonPrefix: "",
        newTextFromCorpus,
        newTextFromUpload,
        summarizeText,
        setTestText
    };

    function newTextFromUpload(filename, chunkMode, chunkSize){
        return {
            mode: 'BrowseThisComputer',
            title: filename,
            filename,
            chunkMode,
            chunkSize,
            get constructedkeys() {
                return this.fileId
                    ? ["/UserUpload/" +
                    UserService.userToken + "/"
                    + this.fileId + "/chunkMode:" + this.chunkMode + "/maxChunk:" + this.chunkSize]
                    : [];
            },
            keys: [],
            ids: [],
            textInfo: {},
            runChunking() {
                return APIService.call('UserService/ChunkUploadedFolder', {
                    browse_ChunkMode: this.chunkMode,
                    browse_MinimumChunkSize: this.chunkSize,
                    browse_ClassName: "unused",
                    browse_FileName: this.filename,
                    userLogin: UserService.user
                })
                    .then(function (response) {
                        this.keys.push(response.data);
                        this.ids.push(response.data);
                    }.bind(this))
            }
        }
    }
    function summarizeText(text) {
        function bookChapterAndVerse(key) {
            let matches = /\/Tanakh\/[^/]*\/([^/]*)?(?:\/Chapter ([^/]*))?(?:\/Pasuk (.*))?/.exec(key);
            if (!matches) return _.drop(/Tanakh\/([^/]*)/.exec(key));
            matches.shift();
            return _.compact(matches);
        }

        if (!text) return;
        if (text.mode === 'BrowseThisComputer') return 'Uploaded Text';
        const sortedKeys = TreeService.treeSort(text.keys);
        let summaries = [];
        let lastSummary;
        let lastRangeStart;
        let lastParts = [];
        sortedKeys.forEach(key => {
            const parts = bookChapterAndVerse(key);
            let match = false;
            let range = false;
            if (parts.length === lastParts.length) {
                match = true;
                for(let i = 0; i < parts.length - 1; i++) {
                    if (parts[i] !== lastParts[i])
                        match = false;
                }
                if (+parts[parts.length - 1] === (+lastParts[parts.length -1]+1))
                    range = true;
            }
            lastParts = parts;
            if (match && parts.length > 1) {
                if (range) {
                    lastSummary = parts[0];
                    if (parts[1]) lastSummary += ' ' + (parts.length === 2 ? lastRangeStart + '-' : '') + parts[1];
                    if (parts[2]) lastSummary += ':' + lastRangeStart + '-' + parts[2];
                    summaries[summaries.length - 1] = lastSummary;
                }
                else {
                    lastRangeStart = parts[parts.length - 1];
                    summaries.push(parts[parts.length -1]);
                }
            }
            else {
                lastSummary = parts[0];
                if (parts[1]) lastSummary += ' ' + parts[1];
                if (parts[2]) lastSummary += ':' + parts[2];
                lastRangeStart = parts[parts.length - 1];
                summaries.push(lastSummary);
            }
        });
        return summaries.join(', ');
    }

    function newTextFromCorpus(keys, ids){
        return {
            mode: 'SelectOnlineCorpus',
            title: null,
            keys,
            ids,
            textInfo: {}
        }
    }

    function setTestText(text) {
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
        window.sessionStorage.setItem('selectedClass', JSON.stringify({ testText: service.testText, prefix: service.testSetTitlesCommonPrefix}));
    }
    const oldSelectedClassStr = window.sessionStorage.getItem('selectedClass');
    if (oldSelectedClassStr) {
        const oldSelectedClass = JSON.parse(oldSelectedClassStr);
        service.testText = oldSelectedClass.testText;
        service.testSetTitlesCommonPrefix = oldSelectedClass.prefix;
    }
    return service;
});