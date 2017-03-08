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
                if (ctrl.experiment.chunks) {
                    ctrl.text = ctrl.experiment.chunks.filter(chunk => chunk.chunkKey.endsWith(ctrl.filterSource.name));
                    ctrl.gettingText = false;
                }
                else
                    APIService.callParallels("GetChunkText/Large",
                        ctrl.filterSource ? [ctrl.filterSource.chunk_name] : SelectClassService.testText.ids)
                        .then(response => {
                            ctrl.text = response.data[Object.keys(response.data)[0]];
                            ctrl.gettingText = false;
                        })
            }
            $scope.$watch("$ctrl.filterSource", updateText);
            
            function getSectionTitleBase(index) {
                if (ctrl.text[index].hasOwnProperty('chunkKey'))
                    return "";
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
                if (ctrl.text[index].hasOwnProperty('chunkKey')) {
                    var key = ctrl.text[index].chunkKey;
                    return key.substring(key.lastIndexOf('/')+1);
                }
                var title = ctrl.text[index].name;
                return title.substring(title.lastIndexOf(': ')+2);
            };
            ctrl.fixTitle = function(title) {
                return title.replace(/ > /g,"/");
            };
            ctrl.getParallels = function (index) {
                if (index == null) return null;
                if (!ctrl.experiment.parallels.hasOwnProperty('length'))
                    return null;
                let parallelsInterim = [];
                if (ctrl.experiment.chunks)
                    parallelsInterim = [ctrl.experiment.parallels[index]];
                else
                    parallelsInterim = ctrl.experiment.parallels.filter(result => result.chunkDispName.endsWith(ctrl.text[index].name));
                var parallels = parallelsInterim.length ? parallelsInterim[0].data : [];
                return parallels.filter(parallel => ctrl.filterParallel == null || parallel.parallelTitle.indexOf( ctrl.filterParallel) == 0);
            };
            ctrl.sourceToHighlight = null;
            ctrl.parallelToHighlight = null;
            ctrl.highlightMatch = function(source, parallel) {
                ctrl.sourceToHighlight = source;
                ctrl.parallelToHighlight = parallel;
            };
            ctrl.doHighlightingBase = function(chunk, index) {
                if (ctrl.parallelToHighlight == null || ctrl.sourceToHighlight == null || index != ctrl.sourceToHighlight)
                    return chunk;
                var start = chunk.substring(0, ctrl.parallelToHighlight.baseStartChar - 1);
                var endOffset = ctrl.parallelToHighlight.baseStartChar + ctrl.parallelToHighlight.baseTextLength;
                var highlight = chunk.substring(ctrl.parallelToHighlight.baseStartChar, endOffset);
                var end = chunk.substring(endOffset + 1);
                return start + "<mark>" + highlight + "</mark>" + end;
            }
            ctrl.doHighlightingParallel = function(parallel) {
                var text = parallel.compMatchedText;
                var start = text.substring(0, parallel.compStartChar - 1);
                var endOffset = parallel.compStartChar + parallel.compTextLength;
                var highlight = text.substring(parallel.compStartChar, endOffset);
                var end = text.substring(endOffset + 1);
                return start + "<mark>" + highlight + "</mark>" + end;
            }
        }
}); 