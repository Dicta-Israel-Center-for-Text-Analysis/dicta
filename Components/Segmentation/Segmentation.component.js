jTextMinerApp.component('segmentation',
    {
        templateUrl: 'Components/Segmentation/Segmentation.component.html',
        controller: ['$scope', 'SegmentationService', 'InProgressService', '$sce',
                function ($scope, SegmentationService, InProgressService, $sce) {
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
                window.scrollTo(0, $("#section" + index)[0].offsetTop - 100);
            }

            ctrl.RunExperiment = function () {
                ctrl.experiment.RunExperiment()
                    .then(function() {
                        ctrl.htmlSegmentation = $sce.trustAsHtml(ctrl.experiment.resultData.htmlSegmentation);
                    });
            }
        }]
    }
);