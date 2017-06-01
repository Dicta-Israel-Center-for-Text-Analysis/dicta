jTextMinerApp.component('parallelsDetails',
{
    bindings: {
        experiment: '<',
        filterSources: '<',
        filterParallels: '<',
        // function to call which will update the filters and parallels
        // this component will re-render the results
        moreResultsAvailable: '<',
        moreResults: '&'
    },
    templateUrl: 'Components/Parallels/parallelsDetails.component.html',
    controller:
        function($scope, SelectClassService, APIService, $timeout, $sce) {
            var ctrl = this;
            ctrl.gettingText = false;
            ctrl.offsetToAlignSource = 0;

            // experiment.chunks is set only for uploaded texts
            // this function crudely splits the text into "small units",
            // and also constructs the results object that the details UI uses
            function convertChunksToTextObj() {
                const filteredChunks = ctrl.experiment.chunks.filter(chunk =>
                    ctrl.filterSources.some(source => chunk.chunkKey.endsWith(source.name)));
                return filteredChunks.map(
                        function (chunk) {
                            let units = [];
                            // split by periods
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
                                    .map(sentence => ({text: sentence}));
                            }
                            else {
                                // split every 25 words
                                units = chunk.text
                                    .split(' ')
                                    .reduce((acc, cur) => {
                                        const lastSegment = acc[acc.length - 1];
                                        if (lastSegment.length == 25)
                                            acc.push([cur]);
                                        else
                                            acc[acc.length - 1].push(cur);
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
            }

            function calculateOffsets(units) {
                let offset = 0;
                units.forEach(function (unit) {
                    unit.offset = offset;
                    offset += unit.text.length;
                });
            }

            // update text sets ctrl.text to a structure which has a list of large units with title, containing
            // small units with title if applicable and offsets within the large unit.
            // small units are created for uploads by splitting on periods. If there aren't periods, split every 25
            // words and set a flag to use full justification - justify: true
            function updateText() {
                if (ctrl.filterSources == null) return;
                if (_.isEqual(ctrl.filterSources, ctrl.lastRequest)) return;
                ctrl.lastRequest = ctrl.filterSources;
                ctrl.gettingText = true;

                // uploaded text is retrieved before the stats run, so just use it
                if (ctrl.experiment.chunks) {
                    ctrl.text = convertChunksToTextObj();
                    ctrl.gettingText = false;
                }
                else {
                    const requests = ctrl.filterSources
                        ? ctrl.filterSources.map(source => source.chunk_name)
                        : SelectClassService.testText.ids;
                    APIService.callParallels("GetChunkText/Large",
                        requests)
                        .then(response => {
                            // convert response into our "text" object, which has a name for the whole large unit
                            // and units for the individual units
                            // map from the request object which does maintain order to the results which are an
                            // object keyed by the request and don't maintain order
                            ctrl.text = requests.map(id => {
                                // take the first name of the small units to create the large unit name,
                                // since all the small units share the same large unit name
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
            $scope.$watchCollection("$ctrl.filterSources", updateText);
            $scope.$watch("$ctrl.filterSources", updateText);
            
            ctrl.getSectionTitle = function (index) {
                return ctrl.text[index].name;
            };
            ctrl.trimSourceName = function (name) {
                if (_.isNil(name)) return;
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
                if (_.isEmpty(ctrl.experiment.parallels) || !ctrl.experiment.parallels.haveResults)
                    return null;
                const parallelsResult = ctrl.experiment.parallels[largeIndex];
                if (_.isNil(parallelsResult)) return [];
                const parallels = parallelsResult.data;
                const smallUnit = ctrl.text[largeIndex].units[smallIndex];
                return parallels.filter(parallel =>
                    (_.isEmpty(ctrl.filterParallels)
                        || ctrl.filterParallels.some(filterParallel => parallel.compName.replace(/: /g, '/').startsWith(filterParallel.title)))
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
                $timeout(function () {
                    const source = document.getElementById('highlightedSource');
                    const parallel = document.getElementById('highlightedParallel');
                    if (_.isNil(source) || _.isNil(parallel)) return;
                    const proposed = _.floor(_.max([0, parallel.getBoundingClientRect().top
                                                     - source.getBoundingClientRect().top
                                                     + ctrl.offsetToAlignSource]));
                    if (Math.abs(ctrl.offsetToAlignSource - proposed) > 10)
                        ctrl.offsetToAlignSource = proposed;
                });
                return $sce.trustAsHtml(start + "<mark id='highlightedSource'>" + highlight + "</mark>" + end);
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
                return $sce.trustAsHtml(start + "<mark"
                        + (ctrl.parallelToHighlight === parallel ?" id='highlightedParallel'" : '')
                        + ">" + highlight + "</mark>" + end);
            }
        }
}); 