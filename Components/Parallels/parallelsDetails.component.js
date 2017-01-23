jTextMinerApp.component('parallelsDetails',
{
    bindings: {
        experiment: '<',
        filterGroup: '<'
    },
    templateUrl: 'Components/Parallels/parallelsDetails.component.html',
    controller:
        function(SelectClassService) {
            var ctrl = this;
            function getSectionTitleBase(index) {
                var baseTitle = ctrl.experiment.sourceForSmallUnits[index].substring(SelectClassService.testSetTitlesCommonPrefix.length + 1);
                return baseTitle.substring(0,baseTitle.lastIndexOf('/'));
            }
            ctrl.getSectionTitle = function (index) {
                var prev = null;
                if (index > 0)
                    prev = getSectionTitleBase(index - 1);
                var cur = getSectionTitleBase(index);
                return prev == cur ? "" : cur;
            };
            ctrl.getChunkTitle = function (index) {
                var title = ctrl.experiment.sourceForSmallUnits[index];
                return title.substring(title.lastIndexOf('/')+1);
            };
            ctrl.fixTitle = function(title) {
                return title.replace(/ > /g,"/");
            };
            ctrl.filter = function (parallels) {
                if (parallels == null) return null;
                return parallels.filter(parallel => ctrl.filterGroup == null || parallel.parallelTitle.indexOf( ctrl.filterGroup) == 0);
            };
            ctrl.sourceToHighlight = null;
            ctrl.parallelToHighlight = null;
            ctrl.highlightMatch = function(source, parallel) {
                ctrl.sourceToHighlight = source;
                ctrl.parallelToHighlight = parallel;
            };
            ctrl.doHighlighting = function(chunk, index) {
                if (ctrl.parallelToHighlight == null || ctrl.sourceToHighlight == null || index != ctrl.sourceToHighlight)
                    return chunk;
                return chunk.replace(ctrl.parallelToHighlight.chunkText, "<mark>" + ctrl.parallelToHighlight.chunkText + "</mark>");
            }
        }
}); 