jTextMinerApp.directive('ttestSlider', function ($timeout) {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/TTestSliderTemplate.html',
        scope: {
            featureId: '@',
            classaverages: '=?',
            currentvalue: '@?',
            classaverage: '@?',
            otheraverage: '@?',
            ttest: '@',
            classcolors: '=?',
            classcolor: '@?'
        },
        controller: ['$scope', 'ExperimentService', 'APIService', 'FeatureService', 'ClassService', 'InProgressService', function ($scope, ExperimentService, APIService, FeatureService, ClassService, InProgressService) {
            if (!Array.isArray($scope.classaverages)) {
                $scope.classaverages = [];
                $scope.classcolors = [];
            }

            if ($scope.classaverage !== undefined) {
                $scope.classaverages.push($scope.classaverage);
                $scope.classcolors.push($scope.classcolor);
            }

            function clamp(percent) {
                return (percent > 100) ? 100 : ((percent < 0) ? 0 : percent);
            }

            function convertFreqToPercent(frequency){
                // force conversion to numbers
                var classAverage = +$scope.classaverage;
                var otherAverage = +$scope.otheraverage;
                // one std dev = 5%
                // a ttest of 2 means the means are 2 std dev apart, hence 10% apart
                var midpoint = (classAverage + otherAverage) / 2;
                var stdDev = (classAverage - otherAverage) / $scope.ttest;
                var left = midpoint - 10*stdDev;
                var percent = (frequency - left)/stdDev*5;
                return clamp(percent);
            }
            $scope.otherDot =       {
                left: "calc(" + convertFreqToPercent($scope.otheraverage) + "% - 10px"
            };
            $scope.otherDotLabel =  {
                left: "calc(" + convertFreqToPercent($scope.otheraverage) + "% - 20px"
            };
            $scope.classDot = function (index) {
                return {
                    left: "calc(" + convertFreqToPercent($scope.classaverages[index]) + "% - 10px",
                    "background-color": $scope.classcolors[index]
                }
            };
            $scope.classDotLabel = function(index) {
                return {
                    left: "calc(" + convertFreqToPercent($scope.classaverages[index]) + "% - 20px",
                    color: $scope.classcolors[index]
                };
            };
            $scope.currentMark =    {left: "calc(" + convertFreqToPercent($scope.currentvalue) + "% - 5px"};
            $scope.currentMarkLabel ={left: "calc(" + convertFreqToPercent($scope.currentvalue) + "% - 20px"};
        }]
    };
});