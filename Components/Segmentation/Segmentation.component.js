jTextMinerApp.component('segmentation',
    {
        templateUrl: 'Components/Segmentation/Segmentation.component.html',
        controller: ['$scope', 'SegmentationService', '$sce', '$timeout', 'StateService',
                function ($scope, SegmentationService, $sce, $timeout, StateService) {
            var ctrl = this;
            ctrl.tab = 1;
            ctrl.showInProcess = false;
            ctrl.experiment = StateService.getOrCreate('segmentation', SegmentationService.newExperiment);
            ctrl.experiment.addListener(afterSegmentation);

            ctrl.createSegment = function (segment) {
                return $sce.trustAsHtml(segment);
            }

            ctrl.getChunks = function () {
            }

            ctrl.scrollTo = function (index) {
                window.scrollTo(0, $("#segmentationSection" + index)[0].offsetTop - 100);
            }

            ctrl.RunExperiment = function () {
                ctrl.showInProcess = true;
                ctrl.experiment.RunExperiment()
                    .then(afterSegmentation);
            };

            function afterSegmentation() {
                ctrl.showInProcess = false;
                ctrl.chunkBarData = ctrl.experiment.resultData.segments.map(chunk => ({
                    color: 'class-bg-color-' + chunk[0].classIndex,
                    text: chunk.map(s => s.text).join(),
                    title: chunk[0].prefix
                }))
            }

            if (ctrl.experiment.resultData.segments)
                afterSegmentation();

            ctrl.getTopFeatures = function (classData) {
                return _.take(
                    ctrl.experiment.featuresData.features[0]
                        .filter(feature => feature.className === classData)
                        .sort((featureA, featureB) => featureB.maxTTest - featureA.maxTTest)
                    , 5)
            }

            $timeout(() => {
                // http://seiyria.com/bootstrap-slider/
                var slider;
                slider = new Slider('#NumberOfSentencesLockedInId', {
                    min: 10,
                    max: 90,
                    scale: 'logarithmic',
                    value: 25,
                    step: 1
                });
                $("#NumberOfSentencesLockedInId").on("slide", function (slideEvt) {
                    ctrl.experiment.Segmentation_NumberOfSentencesLockedIn = slideEvt.value;
                });
            });
        }]
    }
);