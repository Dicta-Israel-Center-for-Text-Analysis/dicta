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

            // update text sets ctrl.text to a structure which has a list of large units with title, containing
            // small units with title if applicable and offsets within the large unit.
            // small units are created for uploads by splitting on periods. If there aren't periods, split every 25
            // words and set a flag to use full justification - justify: true
            function updateText() {
                if (ctrl.filterSource == null) return;
                ctrl.gettingText = true;
                // uploaded text is retrieved before the stats run, so just use it
                function calculateOffsets(units) {
                    let offset = 0;
                    units.forEach(function (unit) {
                        unit.offset = offset;
                        offset += unit.text.length;
                    });
                }

                if (ctrl.experiment.chunks) {
                    ctrl.text = ctrl.experiment.chunks.filter(chunk => !ctrl.filterSource
                    || chunk.chunkKey.endsWith(ctrl.filterSource.name)).map(function(chunk){
                        let units = [];
                        if (chunk.text.includes('.')) {
                            units = chunk.text
                                .split(/(\.)/)
                                .reduce((acc, cur) => {
                                    if (cur == '.')
                                        acc[acc.length - 1] += '.';
                                    else if (cur != '')
                                        acc.push(cur);
                                    return acc;
                                }, [''])
                                .filter(str => str != '')
                                .map(sentence => ({ text: sentence }));
                        }
                        else {
                            units = chunk.text
                                .split(' ')
                                .reduce((acc, cur) => {
                                    const lastSegment = acc[acc.length - 1];
                                    if (lastSegment.length == 25)
                                        acc.push([cur])
                                    else
                                        acc[acc.length -1].push(cur);
                                    return acc;
                                }, [[]])
                                .map(list => ({
                                    text: list.join(' '),
                                    justify: true
                                }));
                        }
                        calculateOffsets(units);
                        return {
                            name: chunk.chunkKey,
                            units: units
                        }
                    });
                    ctrl.gettingText = false;
                }
                else {
                    const requests = ctrl.filterSource ? [ctrl.filterSource.chunk_name] : SelectClassService.testText.ids;
                    APIService.callParallels("GetChunkText/Large",
                        requests)
                        .then(response => {
                            ctrl.text = requests.map(id => {
                                const baseName = response.data[id][0].name.replace(/: /g,'/');
                                return {
                                        name: baseName.substring(0, baseName.lastIndexOf('/')),
                                        units: response.data[id]
                                }
                            });
                            for (const text of ctrl.text) {
                                calculateOffsets(text.units);
                            }
                            ctrl.gettingText = false;
                        })
                }
            }
            $scope.$watch("$ctrl.filterSource", updateText);
            
            ctrl.getSectionTitle = function (index) {
                return ctrl.text[index].name;
            };
            ctrl.trimSourceName = function (name) {
                if (name.indexOf('/') > -1)
                    return name.substring(name.lastIndexOf('/')+1);
                if (name.indexOf(': ') > -1)
                    return name.substring(name.lastIndexOf(': ')+2);
                return name;
            };

            ctrl.fixTitle = function(title) {
                return title.replace(/ > /g,"/");
            };

            // return parallels that start in this small unit
            // if the text comes from the online corpus, then we have parallels joined
            // by the large unit, but if it comes from an upload, it's per unit
            ctrl.getParallels = function (largeIndex, smallIndex) {
                if (largeIndex == null) return null;
                // if there are no parallels yet, return
                if (!ctrl.experiment.parallels.hasOwnProperty('length'))
                    return null;
                const parallels = ctrl.experiment.parallels[largeIndex].data;
                const smallUnit = ctrl.text[largeIndex].units[smallIndex];
                return parallels.filter(parallel =>
                    (ctrl.filterParallel == null
                        || parallel.parallelTitle.indexOf(ctrl.filterParallel) == 0)
                    && smallUnit.offset <= parallel.baseStartChar
                    && smallUnit.offset + smallUnit.text.length > parallel.baseStartChar
                );
            };
            ctrl.sourceToHighlight = null;
            ctrl.sourceToHighlightSmall = null;
            ctrl.parallelToHighlight = null;
            ctrl.highlightMatch = function(sourceLarge, sourceSmall, parallel) {
                ctrl.sourceToHighlightLarge = sourceLarge;
                ctrl.sourceToHighlightSmall = sourceSmall;
                ctrl.parallelToHighlight = parallel;
            };
            ctrl.doHighlightingBase = function(smallUnit, largeIndex, smallIndex) {
                if (ctrl.parallelToHighlight == null || ctrl.sourceToHighlightLarge == null
                    || largeIndex != ctrl.sourceToHighlightLarge || smallIndex != ctrl.sourceToHighlightSmall)
                    return smallUnit.text;
                const correctedStart = ctrl.parallelToHighlight.baseStartChar - smallUnit.offset;
                var start = smallUnit.text.substr(0, correctedStart);
                var highlight = smallUnit.text.substr(correctedStart, ctrl.parallelToHighlight.baseTextLength);
                var end = smallUnit.text.substr(correctedStart + ctrl.parallelToHighlight.baseTextLength);
                return start + "<mark>" + highlight + "</mark>" + end;
            }
            ctrl.doHighlightingParallel = function(parallel) {
                const TRIMLENGTH = 300;
                var text = parallel.compMatchedText;
                var start = text.substr(0, parallel.compStartChar);
                if (start.length > TRIMLENGTH)
                        start = "... " + start.substr(start.indexOf(' ', start.length - TRIMLENGTH));
                var highlight = text.substr(parallel.compStartChar, parallel.compTextLength);
                var end = text.substr(+parallel.compStartChar + parallel.compTextLength);
                if (end.length > TRIMLENGTH)
                        end = end.substr(0, end.indexOf(' ', TRIMLENGTH)) + "...";
                return start + "<mark>" + highlight + "</mark>" + end;
            }
        }
}); 