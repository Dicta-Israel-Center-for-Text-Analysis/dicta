jTextMinerApp.component('parallelsResults',
{
    bindings: {
        experiment: '<'
    },
    templateUrl: 'Components/Parallels/parallelsResults.component.html',
    controller:
        function(SelectClassService) {
            var ctrl = this;
            ctrl.filterSource = null;
            ctrl.filterParallel = null;

            Object.defineProperties(Array.prototype, {
                sum: {
                    value: function sum() {
                        return this.reduce((count, item) => (+item) + count, 0);
                    }
                }
            });

            ctrl.run = function() {
                if (ctrl.filterSource || ctrl.totalParallels() < 50)
                    ctrl.experiment.runParallels(
                        ctrl.experiment.minThreshold,
                        ctrl.experiment.maxDistance,
                        // if a particular source is selected, call with that, otherwise use null
                        // and it will default to using the whole selected text
                        ctrl.filterSource ? [ctrl.filterSource.chunk_name] : null,
                        ctrl.filterParallel
                            // if the parallels are filtered to a particular book, call with that book
                            ? [ctrl.filterParallel.xmlId]
                            : ctrl.filterSource
                                // if not, then if we have a particular source, call only with the parallels to that
                                // source, so that the server doesn't have to search everything again
                                ? ctrl.filterSource.parallels.map(obj => obj.xmlId)
                                // if we don't even have a particular source, call with all the xmlIds in all the
                                // parallels that were found
                                : ctrl.experiment.stats
                                    .reduce((acc, cur) => acc.concat(cur.parallels),[])
                                    .map(obj => obj.xmlId)
                    );
            };

            ctrl.setDetailSource = function(group) {
                ctrl.filterSource = group;
                ctrl.run();
            };
            ctrl.setDetailParallel = function(group) {
                ctrl.filterParallel = group;
                ctrl.run();
            };

            ctrl.setDetailAllSources = function() {
                ctrl.filterSource = null;
                ctrl.run();
            };
            ctrl.setDetailAllParallels = function() {
                ctrl.filterParallel = null;
                ctrl.run();
            };

            ctrl.countParallels = function(source, parallelFilter) {
                return (source == null ? ctrl.experiment.stats : [source])
                    .map(
                    group => group.parallels
                        .filter(parallel => parallelFilter == null
                            ? true
                            : parallel.title == parallelFilter || parallel.title.startsWith(parallelFilter + '/'))
                        .map(parallel => parallel.count)
                        .sum()
                ).sum();
            };

            ctrl.totalParallels = function() {
                return ctrl.experiment.stats.map(group => group.parallels.map(parallel => parallel.count).sum()).sum();
            };

            function getSectionTitleBase(source) {
                if (source.startsWith('/User'))
                    return source.substring(source.lastIndexOf('/') + 1);
                var baseTitle = source.substring(SelectClassService.testSetTitlesCommonPrefix.length + 1);
                return baseTitle;
            }

            ctrl.lastStats = null;
            // this function returns a one to one mapping, so that the index in this array is the same as
            // the index in the stats array
            ctrl.getSections = function () {
                if (ctrl.experiment.stats == ctrl.lastStats)
                    return ctrl.experiment.stats;
                ctrl.experiment.stats.forEach(
                    function(source, index) {
                        source.name = getSectionTitleBase(ctrl.experiment.chunks
                            ? ctrl.experiment.chunks[index].chunkKey
                            : "/Dicta Corpus/" + source.title)
                        source.count = source.numParallels;
                    });
                ctrl.lastStats = ctrl.experiment.stats;
                return ctrl.experiment.stats;
            };

            // angular requires a function used for binding to return the same object when nothing changed,
            // not just the same values
            ctrl.lastParallelsStats = null;
            ctrl.lastParallels = null;
            ctrl.getParallels = function () {
                if (ctrl.experiment.stats == ctrl.lastParallelsStats)
                    return ctrl.lastParallels;
                ctrl.lastParallelsStats = ctrl.experiment.stats;
                var summarizedParallels = ctrl.experiment.stats
                    // collect and flatten the parallels into an array
                    .map(text => text.parallels)
                    .reduce((a, b) => a.concat(b), [])
                    // sum by book
                    .reduce((obj, parallel) => {
                        if (!(parallel.title in obj)) {
                            obj[parallel.title] = {
                                title: parallel.title,
                                count: +parallel.count,
                                sortOrder: parallel.sortOrder,
                                xmlId: parallel.xmlId
                            }
                        }
                        else
                            obj[parallel.title].count += +parallel.count;
                        return obj;
                    }, {});
                var sortedParallelsList = Object.keys(summarizedParallels)
                    .map(key => summarizedParallels[key])
                    .sort((a, b) => a.sortOrder - b.sortOrder);
                ctrl.lastParallels = sortedParallelsList;
                return sortedParallelsList;
            };

            let cacheInputs = [];
            let cacheOutputs = [];
            ctrl.parallelExpand = [];
            ctrl.groupList = function (list, cacheNum) {
                if (cacheInputs[cacheNum] === list)
                    return cacheOutputs[cacheNum];
                let groups = [];
                if (list.length < 10) {
                    groups = [{
                        heading: '',
                        sublist: list
                    }]
                }
                else {
                list.forEach(function(item) {
                    var parts = item.title.split(/(\/[^\/]*)\//, 2);
                    var heading = parts[0];
                    if (parts[1])
                        heading += parts[1];
                    if (groups.length > 0 && groups[groups.length - 1].heading === heading) {
                        groups[groups.length - 1].sublist.push(item);
                        groups[groups.length - 1].count += item.count;
                    }
                    else {
                        groups.push({
                            heading,
                            count: item.count,
                            sublist: [item]
                        })
                        ctrl.parallelExpand[heading] = false;
                    }
                });
                }
                cacheInputs[cacheNum] = list;
                cacheOutputs[cacheNum] = groups;
                return groups;
            }
        }
}); 