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
                                root.stats.forEach((chunk, index) => {
                                    if (chunk.hasOwnProperty('chunkDispName'))
                                        chunk.title = chunk.chunkDispName.replace(/: /g, '/');
                                    else {
                                        chunk.title = _.last(root.chunks[index].chunkKey.split('/'));
                                        chunk.chunk_name = root.chunkNames[index];
                                    }
                                    chunk.parallels.forEach(parallel => {
                                        parallel.title = parallel.bookName.replace(/: /g, '/');
                                    });
                                });
                                root.stats.running = false;
                                root.stats.haveResults = true;
                            });
                    });
            };

            // creates the basic request for both StatisticsLarge and Parallels/Large; if the source is an uploaded file,
            // get it from the server first
            function createRequest(sourceList, minThreshold, maxDistance) {
                var data = {
                    minthreshold: minThreshold,
                    maxdistance: maxDistance
                };
                var keys = _.isEmpty(sourceList) ? SelectClassService.testText.ids : sourceList;

                var [nonDictaKeys, dictaKeys] = _.partition(keys, key => key.startsWith('User/'));
                if (!_.isEmpty(dictaKeys))
                    data.chunkIds = dictaKeys;

                if (nonDictaKeys.length > 0) {
                    var textRequest = {
                        "keys": nonDictaKeys,
                        "chunkType": "LARGE"
                    };
                    // check if there is a cached result
                    if (root.chunks) {
                        data.chunks =
                            (_.isEmpty(sourceList)
                             ? root.chunks
                             : root.chunks.filter(chunk => _.includes(sourceList, chunk.chunkKey))
                            ).map(chunk => chunk.text);
                    }
                    else return APIService.call("TextFeatures/GetText", textRequest)
                        .then(response => {
                            root.chunks = response.data;
                            root.chunkNames = response.data.map(chunk => chunk.chunkKey);
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
                root.parallels = {
                    haveResults: false,
                    running: true
                }
                createRequest(sourceList, minThreshold, maxDistance)
                    .then(data => {
                        if (!_.isEmpty(filterList))
                            data.filterIds = filterList;
                        //debugger;
                        return APIService.callParallels('Parallels/Large', data)
                            .then(response => {
                                let parallels = [];
                                response.data.forEach(
                                    (result, index) => parallels[index] = result
                                );
                                root.parallels = parallels;
                                root.parallels.running = false;
                                root.parallels.haveResults = true;
                            });
                    });
            };

            root.resetParallels = function () {
                root.parallels = [];
            };

            return root;
        }
    }
});