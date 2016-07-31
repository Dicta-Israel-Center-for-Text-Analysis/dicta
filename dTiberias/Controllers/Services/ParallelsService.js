
jTextMinerApp.factory('ParallelsService', function ($rootScope, APIService, CAPIService, SaveClassInterface, InProgressService) {
    var root = {
        smallUnits: [],
        sourceForSmallUnits: [],
        chunks: [],
        source: [],
        groupNames: [],
        groups: [],
        numOfParallelsInGroups: [],
        numOfParallels: 0,
        parrallelsPerChunk: [],
        haveResults: false
    };

    // functions for broadcasting updates
    root.updateSmallUnits = function (items) {
        this.smallUnits = items;
        $rootScope.$broadcast("ParallelsUpdates");
    };
    root.updateSourceForSmallUnits = function (items) {
        this.sourceForSmallUnits = items;
        $rootScope.$broadcast("ParallelsUpdates");
    };
    root.updateChunks = function (items) {
        this.chunks = items;
        $rootScope.$broadcast("ParallelsUpdates");
    };
    root.updateSource = function (items) {
        this.source = items;
        $rootScope.$broadcast("ParallelsUpdates");
    };
    root.updategroupNames = function (items) {
        this.groupNames = items;
        $rootScope.$broadcast("ParallelsUpdates");
    };
    root.updategroups = function (items) {
        this.groups = items;
        $rootScope.$broadcast("ParallelsUpdates");
    };
    root.updatenumOfParallelsInGroups = function (items) {
        this.numOfParallelsInGroups = items;
        $rootScope.$broadcast("ParallelsUpdates");
    };
    root.updatenumOfParallels = function (val) {
        this.numOfParallels = val;
        $rootScope.$broadcast("ParallelsUpdates");
    };
    root.updateparrallelsPerChunk = function (val) {
        this.parrallelsPerChunk = val;
        $rootScope.$broadcast("ParallelsUpdates");
    };

    root.runParallels = function (minThreshold, maxDistance) {
        InProgressService.updateIsReady(0);

        APIService.apiRun({ crud: 'UnknownTestClassAsSmallUnits' }, SaveClassInterface, function (response2) {
            var source = response2.source;
            var data = {
                chunks: response2.chunks,
                minthreshold: minThreshold,
                maxdistance: maxDistance

            };
            root.updateSmallUnits(response2.chunks);
            root.updateSourceForSmallUnits(response2.source);
            var parallelsPerChunk = [];
            for (var i = 0; i < root.smallUnits.length; i = i + 1) {
                parallelsPerChunk.push(
                    {
                        name: "Chunk " + i,
                        parallels: []
                    }
                );
            }
            CAPIService.apiRun({ crud: 'parallels' }, data, function (response3) {
                var results = response3;
                var groupNames = [];
                var groups = [];
                var numOfParallelsInGroups = [];
                var numOfParallels = 0;
                for (var k = 0; k < results.length; k = k + 1) {
                    var currentChunk = results[k];
                    for (var j = 0; j < currentChunk.data.length; j = j + 1) {
                        var currentData = currentChunk.data[j];
                        var paths = currentData.compName.split(":");
                        var group = (paths[0] + " > " + paths[1]);
                        var title = paths[0];
                        var path = paths[0];
                        for (i = 1; i < paths.length; i = i + 1) {
                            title += " > " + paths[i];
                            path += "/" + paths[i].trim();
                        }

                        if (source[k] === path)
                            continue; // do  not add parallel of the same chunk

                        numOfParallels += 1;

                        if (groupNames.indexOf(group) < 0) {
                            groupNames.push(group);
                            groups.push({
                                name: group,
                                numOfParallels: 1,
                                parallels: []
                            });
                        }
                        else {
                            groups[groupNames.indexOf(group)].numOfParallels += 1;
                        }

                        groups[groupNames.indexOf(group)].parallels.push({
                            chunkIndex: k,
                            chunkText: currentData.baseMatchedText,
                            parallelText: currentData.compMatchedText,
                            parallelTitle: title,
                            parallelPath: path
                            //startCharacterIndex: currentData.baseStartChar,
                            //length: currentData.baseTextLength
                        });

                        parallelsPerChunk[k].parallels.push(
                            {
                                chunkIndex: k,
                                chunkText: currentData.baseMatchedText,
                                parallelText: currentData.compMatchedText,
                                parallelTitle: title,
                                parallelPath: path
                            }
                        );

                    }
                }

                root.updategroupNames(groupNames);
                root.updategroups(groups);
                root.updatenumOfParallelsInGroups(numOfParallelsInGroups);
                root.updatenumOfParallels(numOfParallels);
                root.updateparrallelsPerChunk(parallelsPerChunk);
                root.haveResults = true;

                InProgressService.updateIsReady(1);
            }, function (errorResponse) {InProgressService.setError(errorResponse.statusText);});
        }, function (errorResponse) {InProgressService.setError(errorResponse.statusText);});

    };
    
    return root;
});