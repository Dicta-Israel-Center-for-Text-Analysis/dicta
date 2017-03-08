jTextMinerApp.factory('ParallelsService', function (APIService, SelectClassService, SaveClassInterface, $q) {
    return {
        newInstance() {
            var root = {
                smallUnits: [],
                sourceForSmallUnits: [],
                groupNames: [],
                groups: [],
                numOfParallelsInGroups: [],
                numOfParallels: 0,
                parallelsPerChunk: [],
                stats: {
                    haveResults: false,
                    running: false
                },
                parallels: {
                    haveResults: false,
                    running: false
                }
            };

            root.runStatistics = function (minThreshold, maxDistance, filterList) {
                root.stats.running = true;
                root.minThreshold = minThreshold;
                root.maxDistance = maxDistance;
                createRequest(false, minThreshold, maxDistance)
                    .then(data => {
                        if (filterList)
                            data.filterIds = filterList;
                        return APIService.callParallels('Parallels/StatisticsLarge', data)
                            .then(function (response) {
                                root.stats = response.data;
                                root.stats.forEach(chunk => {
                                    if (chunk.hasOwnProperty('chunkDispName'))
                                        chunk.title = chunk.chunkDispName.replace(/: /g, '/');
                                    chunk.parallels.forEach(parallel => {
                                        parallel.title = parallel.bookName.replace(/: /g, '/');
                                    });
                                });
                                root.stats.running = false;
                                root.stats.haveResults = true;
                            });
                    });
            };

            function createRequest(sourceList, minThreshold, maxDistance) {
                var data = {
                    chunkIds: sourceList ? sourceList : SelectClassService.testText.ids,
                    minthreshold: minThreshold,
                    maxdistance: maxDistance
                };
                var nonDictaKeys = SelectClassService.testText.keys.filter(key => !key.startsWith('/Dicta Corpus/'));
                if (nonDictaKeys.length > 0) {

                    var textRequest = {
                        "keys": nonDictaKeys.map( textKey =>(
                                {
                                    "keyType": "USER_UPLOAD",
                                    "key": textKey
                                })
                        ),
                        "chunkType": "LARGE"
                    };
                    if (root.chunks) {
                        data.chunks = root.chunks.map(chunk => chunk.text);
                    }
                    else return APIService.call("TextFeatures/GetText", textRequest)
                        .then(response => {
                            root.chunks = response.data;
                            return response.data.map(chunk => chunk.text)
                        })
                        .then(chunks => {
                            data.chunks = chunks;
                            return data;
                        });
                }
                return $q.resolve(data);
            }

            root.runParallels = function (minThreshold, maxDistance, sourceList, filterList) {
                root.parallels.running = true;
                createRequest(sourceList, minThreshold, maxDistance)
                    .then(data => {
                        if (filterList)
                            data.filterIds = filterList;
                        //debugger;
                        return APIService.callParallels('Parallels/Large', data)
                            .then(response => {
                                root.parallels = response.data;
                                root.parallels.running = false;
                                root.parallels.haveResults = true;
                            });
                    });
            };

            return root;
        }
    }
});