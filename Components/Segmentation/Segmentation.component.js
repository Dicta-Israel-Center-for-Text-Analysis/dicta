jTextMinerApp.component('segmentation',
    {
        templateUrl: 'Components/Segmentation/Segmentation.component.html',
        controller: ['$scope', 'SegmentationService', 'InProgressService', '$sce', '$timeout',
                function ($scope, SegmentationService, InProgressService, $sce, $timeout) {
            var ctrl = this;
            ctrl.tab = 1;
            ctrl.showInProcess = InProgressService.isReady != 1;
            ctrl.experiment = SegmentationService.newExperiment();

            $scope.$on('isReady_Updated', function () {
                ctrl.showInProcess = InProgressService.isReady != 1;
            });

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
                ctrl.experiment.RunExperiment()
                    .then(function() {
                        ctrl.htmlSegmentation = $sce.trustAsHtml(ctrl.experiment.resultData.htmlSegmentation);
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