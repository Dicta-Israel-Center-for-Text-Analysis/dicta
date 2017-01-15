
jTextMinerApp.factory('ParallelsService', function ($rootScope, APIService, SelectClassService, SaveClassInterface, InProgressService) {
    var root = {
        smallUnits: [],
        sourceForSmallUnits: [],
        groupNames: [],
        groups: [],
        numOfParallelsInGroups: [],
        numOfParallels: 0,
        parallelsPerChunk: [],
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
    root.updateparallelsPerChunk = function (val) {
        this.parallelsPerChunk = val;
        $rootScope.$broadcast("ParallelsUpdates");
    };

    root.runParallels = function (minThreshold, maxDistance) {
        InProgressService.updateIsReady(0);
        root.haveResults = false;

        var source;
        APIService.call('JTextMinerAPI/UnknownTestClassAsSmallUnits', SaveClassInterface.getInstance({
            text: SelectClassService.testText
        }))
            .then(function (response) {
                source = response.data.source;
                var data = {
                    chunks: response.data.chunks,
                    minthreshold: minThreshold,
                    maxdistance: maxDistance

                };
                root.updateSmallUnits(response.data.chunks);
                root.updateSourceForSmallUnits(response.data.source);

                return data;
            })
            .then(data => APIService.callParallels(data))
            .then(function (response3) {
                var results = response3.data;
                var groupNameDict = {};
                var groups = [];
                var numOfParallelsInGroups = [];
                var numOfParallels = 0;


                // helper for insertSorted that returns true if item1 sorts before item2
                function parallelsSortCompare(item1, item2) {
                    if (item1.sortOrder == item2.sortOrder)
                        return item1.compStartChar < item2.compStartChar;
                    else
                        return item1.sortOrder < item2.sortOrder;
                }

                // takes a list of objects that have a sortOrder property and a compStartChar property,
                // and inserts a new item in the right place according to its sortOrder property and if equal, by its compStartChar property
                function insertSorted(list, itemToInsert) {
                    for (var i = 0; i < list.length; i++) {
                        if (parallelsSortCompare(itemToInsert, list[i])) {
                            list.splice(i, 0, itemToInsert);
                            return;
                        }
                    }
                    // if we haven't returned from the function, it must belong at the end
                    list.push(itemToInsert);
                }

                var trimmedSources = source.map(function(oneSource){return oneSource.replace(/^\/Dicta Corpus\//,'')});

                var parallelsPerChunk = root.smallUnits.map(
                    (unit, index) => ({
                        name: "Chunk " + index,
                        parallels: []
                    })
                );

                for (var k = 0; k < results.length; k = k + 1) {
                    var currentChunk = results[k];
                    for (var j = 0; j < currentChunk.data.length; j = j + 1) {
                        var currentData = currentChunk.data[j];
                        var paths = currentData.compName.split(": ");
                        var group = (paths[0] + " > " + paths[1]);
                        var title = paths.join(" > ");
                        var path = paths.join("/");

                        if (trimmedSources[k] === path)
                            continue; // do  not add parallel of the same chunk

                        numOfParallels += 1;

                        // creates a list of groups, e.g. "Bible > Prophets"
                        // we sort based on whichever member of the group we first see, since any sortOrder we get will still give the same order for the groups
                        if (!groupNameDict.hasOwnProperty(group)) {
                            var newGroup = {
                                name: group,
                                numOfParallels: 1,
                                parallels: [],
                                sortOrder: currentData.sortOrder
                            };
                            groupNameDict[group] = newGroup;
                            insertSorted(groups, newGroup);
                        }
                        else {
                            groupNameDict[group].numOfParallels += 1;
                        }

                        insertSorted(groupNameDict[group].parallels,
                            {
                                chunkIndex: k,
                                chunkText: currentData.baseMatchedText,
                                parallelText: currentData.compMatchedText,
                                parallelTitle: title,
                                parallelPath: path,
                                sortOrder: currentData.sortOrder,
                                compStartChar: currentData.compStartChar
                                //startCharacterIndex: currentData.baseStartChar,
                                //length: currentData.baseTextLength
                            });

                        insertSorted(parallelsPerChunk[k].parallels,
                            {
                                chunkIndex: k,
                                chunkText: currentData.baseMatchedText,
                                parallelText: currentData.compMatchedText,
                                parallelTitle: title,
                                parallelPath: path,
                                sortOrder: currentData.sortOrder,
                                compStartChar: currentData.compStartChar
                            }
                        );

                    }
                }

                root.updategroupNames(groups.map(function(item){ return item.name }));
                root.updategroups(groups);
                root.updatenumOfParallelsInGroups(numOfParallelsInGroups);
                root.updatenumOfParallels(numOfParallels);
                root.updateparallelsPerChunk(parallelsPerChunk);
                root.haveResults = true;

                InProgressService.updateIsReady(1);
            })
            .catch(function (errorResponse) {
                InProgressService.setError(errorResponse.statusText);
            });
        };

    return root;
});