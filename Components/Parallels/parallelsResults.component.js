jTextMinerApp.component('parallelsResults',
{
    bindings: {
        experiment: '<'
    },
    templateUrl: 'Components/Parallels/parallelsResults.component.html',
    controller:
        function(SelectClassService) {
            const ctrl = this;
            // when the user clicks a specific "source"
            ctrl.selectedFilterSources = [];
            // if no source is selected, we automatically show some texts
            ctrl.actualFilterSources = [];
            // when the user selected a specific parallels text or group of texts
            ctrl.filterParallels = [];

            ctrl.showAll = false;
            ctrl.resultsLimit = 5;

            // when any change is made in the parallelsResults controls, update the details display
            ctrl.runDetails = function() {
                // given the existing selected sources, calculate the xmlIds to filter by, for use when calling
                // ParallelsLarge on the server
                function getParallelsByXmlId(sources) {
                    return _.uniq(
                        _.flatMap(sources, text => text.parallels)
                            .map(parallel => parallel.xmlId));
                }

                // always select something to show
                // if ctrl.filterSources is set, ctrl.actualFilterSources is already set to the same value
                if (_.isEmpty(ctrl.filterSources) && _.isEmpty(ctrl.filterParallels))
                    ctrl.actualFilterSources = ctrl.filterSourcesSplit[ctrl.filterSourcesSplitIndex];

                //
                ctrl.experiment.runParallels(
                    ctrl.experiment.minThreshold,
                    ctrl.experiment.maxDistance,
                    // if a particular source is selected, call with that, otherwise use null
                    // and it will default to using the whole selected text
                    ctrl.actualFilterSources.map(source => source.chunk_name),
                    ctrl.filterParallels
                        // if the parallels are filtered to a particular book, call with that book
                        ? ctrl.filterParallels.map(parallel => parallel.xmlId)
                        : _.isEmpty(ctrl.filterSources)
                            // if we don't even have a particular source, call with all the xmlIds in all the
                            // parallels that were found
                            ? getParallelsByXmlId(ctrl.experiment.stats)
                            // if not, then if we have a particular source, call only with the parallels to that
                            // source, so that the server doesn't have to search everything again
                            : getParallelsByXmlId(ctrl.filterSources)

                );
            };

            ctrl.countParallels = function(sources, parallelFilters) {
                let actualSources = _.isEmpty(sources) ? ctrl.experiment.stats : sources;
                let parallels = _.flatMap(actualSources, source => source.parallels);
                return _.sum(parallels
                            .filter(parallel => (_.isEmpty(parallelFilters) ? true : parallelFilters.some(
                                filter => parallel.title === filter.title || parallel.title.startsWith(filter.title + '/'))
                            ))
                            .map(parallel => parallel.count)
                         
                );
            };

            function updateFilteredCount() {
                ctrl.experiment.stats.forEach(
                    item => {
                        item.filteredCount = ctrl.countParallels([item], ctrl.filterParallels);
                    });
            }

            ctrl.setDetailSources = function(items, heading) {
                ctrl.filterSourcesHeading = heading;
                ctrl.actualFilterSources = ctrl.selectedFilterSources = items;
                updateFilteredCount();
                ctrl.runDetails();
            };
            ctrl.setDetailAllSources = function() {
                ctrl.actualFilterSources = ctrl.selectedFilterSources = [];
                updateFilteredCount();
                ctrl.runDetails();
            };

            ctrl.setDetailParallels = function(items, heading) {
                ctrl.filterParallels = items;
                ctrl.filterParallelsHeading = heading;
                updateFilteredCount();
                ctrl.runDetails();
            };
            ctrl.setDetailAllParallels = function() {
                ctrl.filterParallels = [];
                updateFilteredCount();
                ctrl.runDetails();
            };

            ctrl.totalParallels = function() {
                return _.sum(ctrl.experiment.stats.map(group => _.sum(group.parallels.map(parallel => parallel.count))));
            };

            function getSectionTitleBase(source) {
                if (source.startsWith('User'))
                    return source.substring(source.lastIndexOf('/') + 1);
                return source.substring(SelectClassService.testSetTitlesCommonPrefix.length + 1);
            }

            ctrl.lastStats = null;
            // this function returns the stats array, but annotates it with name, count, and filteredCount
            ctrl.getSections = function () {
                if (ctrl.experiment.stats === ctrl.lastStats && ctrl.filterParallels === ctrl.lastFilterParallels)
                    return ctrl.experiment.stats;
                ctrl.lastFilterParallels = ctrl.filterParallels;
                ctrl.experiment.stats.forEach(
                    function(source, index) {
                        source.name = getSectionTitleBase(ctrl.experiment.chunks
                            ? ctrl.experiment.chunks[index].chunkKey
                            : "/Dicta Corpus/" + source.title);
                        source.count = source.numParallels;
                    });
                updateFilteredCount();
                // run details on the first results
                // first split into pages of results
                ctrl.filterSourcesSplit = ctrl.experiment.stats.reduce((acc, cur) => {
                    const lastSegment = acc[acc.length - 1];
                    const parallelsSoFar = _.sum(lastSegment.map(source => source.count));
                    if (parallelsSoFar > 50 && parallelsSoFar + cur.count >= 100)
                        acc.push([cur]);
                    else
                        acc[acc.length - 1].push(cur);
                    return acc;
                }, [[]]);
                ctrl.filterSourcesSplitIndex = -1;
                // function to return next page of results
                ctrl.moreResults = function() {
                    ctrl.filterSourcesSplitIndex ++;
                    ctrl.actualFilterSources = ctrl.filterSourcesSplit[ctrl.filterSourcesSplitIndex];
                    ctrl.moreResultsAvailable = ctrl.filterSourcesSplit.length > ctrl.filterSourcesSplitIndex + 1;
                    ctrl.runDetails();
                };
                // run for the first time to retrieve the first page of results
                ctrl.moreResults();
                ctrl.lastStats = ctrl.experiment.stats;
                return ctrl.experiment.stats;
            };

            // angular requires a function used for binding to return the same object when nothing changed,
            // not just the same values
            ctrl.lastParallelsStats = null;
            ctrl.lastFilterSources = null;
            ctrl.lastParallels = null;
            ctrl.getParallels = function () {
                if (ctrl.experiment.stats == ctrl.lastParallelsStats && ctrl.selectedFilterSources === ctrl.lastFilterSources)
                    return ctrl.lastParallels;
                ctrl.lastParallelsStats = ctrl.experiment.stats;
                ctrl.lastFilterSources = ctrl.selectedFilterSources;
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
                let sortedParallelsList = Object.keys(summarizedParallels)
                    .map(key => summarizedParallels[key])
                    .sort((a, b) => a.sortOrder - b.sortOrder);
                const filteredParallels = _.flatMap(
                    _.isEmpty(ctrl.selectedFilterSources)
                        ? ctrl.experiment.stats
                        : ctrl.selectedFilterSources,
                    item => item.parallels);
                const groups = _.groupBy(filteredParallels, parallel => parallel.xmlId);
                sortedParallelsList.forEach(
                    parallel => parallel.filteredCount = _.sumBy(groups[parallel.xmlId], group => group.count)
                );
                ctrl.lastParallels = sortedParallelsList;
                return sortedParallelsList;
            };

            let cacheLengths = {};
            ctrl.cacheActualLengths = {};

            function calcLimitForResults() {
                return ctrl.showAll ? 1000000 : 5;
            }

            ctrl.max = function (a, b) {
                return a > b ? a : b;
            };

            ctrl.toggleShowAll = function () {
                ctrl.showAll = !ctrl.showAll;
                ctrl.resultsLimit = calcLimitForResults();
            };

            ctrl.onLengthChange = function(name, length, actualLength) {
                cacheLengths[name] = length;
                ctrl.cacheActualLengths[name] = actualLength;
            };
            
            ctrl.overflowResults = function () {
                return Object.keys(cacheLengths).some(name => cacheLengths[name] > 5)
            };

            ctrl.toTitles = function (list) {
                return list.map(item => item.title).join(', ');
            }
        }
}); 