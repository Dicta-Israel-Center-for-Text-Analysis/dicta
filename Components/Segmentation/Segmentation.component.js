jTextMinerApp.component('segmentation',
    {
        templateUrl: 'Components/Segmentation/Segmentation.component.html',
        controller: ['$scope', 'SegmentationService', '$sce', '$timeout',
                function ($scope, SegmentationService, $sce, $timeout) {
            var ctrl = this;
            ctrl.tab = 1;
            ctrl.showInProcess = false;
            ctrl.experiment = SegmentationService.newExperiment();

            ctrl.createSegment = function (segment) {
                return $sce.trustAsHtml(segment);
            }

            ctrl.createThumbnail = function (chunk) {
                if (chunk == null)
                    return "";
                var dotsNail = "";
                for (i = 0; i < chunk.length / 40; i = i + 1) {
                    dotsNail += ". ";
                }
                return $sce.trustAsHtml(dotsNail);
            }

            ctrl.scrollTo = function (index) {
                window.scrollTo(0, $("#segmentationSection" + index)[0].offsetTop - 100);
            }

            ctrl.RunExperiment = function () {
                ctrl.showInProcess = true;
                ctrl.experiment.RunExperiment()
                    .then(function() {
                        ctrl.htmlSegmentation = $sce.trustAsHtml(ctrl.experiment.resultData.htmlSegmentation);
                        ctrl.showInProcess = false;
                    });
            }

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