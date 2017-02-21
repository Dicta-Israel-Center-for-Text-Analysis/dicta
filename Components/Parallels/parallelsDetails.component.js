jTextMinerApp.component('parallelsDetails',
{
    bindings: {
        experiment: '<',
        filterSource: '<',
        filterParallel: '<'
    },
    templateUrl: 'Components/Parallels/parallelsDetails.component.html',
    controller:
        function($scope, SelectClassService, APIService) {
            var ctrl = this;
            ctrl.gettingText = false;
            function updateText() {
                if (ctrl.filterSource == null) return;
                ctrl.gettingText = true;
                APIService.callParallels("GetChunkText/Large",
                    ctrl.experiment.stats.filter(x => x.title.endsWith(ctrl.filterSource)).map(x => x.chunk_name))
                    .then(response => {
                        ctrl.text = response.data[Object.keys(response.data)[0]];
                        ctrl.gettingText = false;
                    })
            }
            $scope.$watch("$ctrl.filterSource", updateText);
            
            function getSectionTitleBase(index) {
                var baseTitle = ctrl.text[index].name.replace(/: /g, '/');
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
                var title = ctrl.text[index].name;
                return title.substring(title.lastIndexOf(': ')+2);
            };
            ctrl.fixTitle = function(title) {
                return title.replace(/ > /g,"/");
            };
            ctrl.getParallels = function (index) {
                if (index == null) return null;
                var parallelsInterim = ctrl.experiment.parallels.filter(result => result.chunkDispName.endsWith(ctrl.text[index].name));
                var parallels = parallelsInterim.length ? parallelsInterim[0].data : [];
                return parallels.filter(parallel => ctrl.filterParallel == null || parallel.parallelTitle.indexOf( ctrl.filterParallel) == 0);
            };
            ctrl.sourceToHighlight = null;
            ctrl.parallelToHighlight = null;
            ctrl.highlightMatch = function(source, parallel) {
                ctrl.sourceToHighlight = source;
                ctrl.parallelToHighlight = parallel;
            };
            ctrl.doHighlighting = function(chunk, index) {
                chunk = chunk.text;
                if (ctrl.parallelToHighlight == null || ctrl.sourceToHighlight == null || index != ctrl.sourceToHighlight)
                    return chunk;
                var start = chunk.substring(0, ctrl.parallelToHighlight.baseStartChar - 1);
                var endOffset = ctrl.parallelToHighlight.baseStartChar + ctrl.parallelToHighlight.baseTextLength;
                var highlight = chunk.substring(ctrl.parallelToHighlight.baseStartChar, endOffset);
                var end = chunk.substring(endOffset + 1);
                return start + "<mark>" + highlight + "</mark>" + end;
            }
        }
}); 