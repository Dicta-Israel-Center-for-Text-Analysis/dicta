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

            Array.prototype.sum = function sum() {
                var t = this.reduce((count, item) => (+item) + count, 0);
                return t;
            }

            ctrl.run = function() {
                if (ctrl.filterSource == null) return;
                var sourceObjects = ctrl.experiment.stats.filter(x => x.title.endsWith(ctrl.filterSource));
                ctrl.experiment.runParallels(
                    ctrl.experiment.minThreshold,
                    ctrl.experiment.maxDistance,
                    ctrl.filterSource ? sourceObjects.map(x => x.chunk_name) : null,
                    ctrl.filterParallel ? ctrl.filterParallel : sourceObjects[0].parallels.map(obj => obj.xmlId)
                );
                return true;
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
                return ctrl.experiment.stats
                    .filter(chunk => source == null ? true : SelectClassService.testSetTitlesCommonPrefix + "/" + source == "/Dicta Corpus/" + chunk.title)
                    .map(
                    group => group.parallels
                        .filter(parallel => parallelFilter == null ? true : parallel.title == parallelFilter)
                        .map(parallel => parallel.count)
                        .sum()
                ).sum();
            };

            ctrl.totalParallels = function() {
                return ctrl.experiment.stats.map(group => group.parallels.map(parallel => parallel.count).sum()).sum();
            };
            function getSectionTitleBase(source) {
                var baseTitle = source.substring(SelectClassService.testSetTitlesCommonPrefix.length + 1);
                return baseTitle;
            }
            ctrl.lastStats = null;
            ctrl.lastSections = null;
            ctrl.getSections = function () {
                if (ctrl.experiment.stats == ctrl.lastStats)
                    return ctrl.lastSections;
                var baseSections = ctrl.experiment.stats.map(
                    source => ({
                        name: getSectionTitleBase("/Dicta Corpus/" + source.title),
                        parallels: source.parallels.map(text => text.count).sum()
                    }));
                ctrl.lastStats = ctrl.experiment.stats;
                ctrl.lastSections = baseSections;
                return baseSections;
            };

            ctrl.lastParallelsStats = null;
            ctrl.lastParallels = null;
            ctrl.getParallels = function () {
                if (ctrl.experiment.stats == ctrl.lastParallelsStats)
                    return ctrl.lastParallels;
                ctrl.lastParallelsStats = ctrl.experiment.stats;
                var baseParallels = ctrl.experiment.stats
                    // collect and flatten the parallels into an array
                    .map(text => text.parallels)
                    .reduce((a, b) => a.concat(b), [])
                    // sum by book
                    .reduce((obj, parallel) => {
                        if (!(parallel.title in obj)) {
                            obj[parallel.title] = {
                                count: +parallel.count,
                                sortOrder: parallel.sortOrder,
                                xmlId: parallel.xmlId
                            }
                        }
                        else
                            obj[parallel.title].count += +parallel.count;
                        return obj;
                    }, {});
                var parallelsList = Object.keys(baseParallels)
                    .map(key => ({name: key, parallels: baseParallels[key].count, sortOrder: baseParallels[key].sortOrder}))
                    .sort((a, b) => a.sortOrder - b.sortOrder);
                ctrl.lastParallels = parallelsList;
                return parallelsList;
            };
            // ctrl.oldSections = [];
            // ctrl.oldParallels = [];
            // ctrl.getSections = function() {
            //     if (ctrl.experiment.parallelsPerChunk == ctrl.oldParallels)
            //         return ctrl.oldSections;
            //     ctrl.oldParallels = ctrl.experiment.parallelsPerChunk;
            //     var sections = [];
            //     var lastName = null;
            //     for (var i = 0; i < ctrl.experiment.sourceForSmallUnits.length; i++) {
            //         var name = getSectionTitleBase(ctrl.experiment.sourceForSmallUnits[i]);
            //         if (name != lastName) {
            //             sections.push({name: name, parallels: ctrl.experiment.parallelsPerChunk[i].parallels.length});
            //             lastName = name;
            //         }
            //         else {
            //             sections[sections.length - 1].parallels += ctrl.experiment.parallelsPerChunk[i].parallels.length;
            //         }
            //     }
            //     ctrl.oldSections = sections;
            //     return sections;
            // }
        }
}); 