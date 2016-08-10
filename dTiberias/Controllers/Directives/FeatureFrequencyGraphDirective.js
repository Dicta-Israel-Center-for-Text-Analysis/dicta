jTextMinerApp.directive('featureFrequencyGraph', function ($timeout) {
    return {
        restrict: 'E',
        templateUrl: 'partials/templates/FeatureFrequencyGraphTemplate.html',
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
            // setup

            // there are two ways to call the graph, so make sure that either way,
            // classcolors and classaverages hold the points we want to graph
            if (!Array.isArray($scope.classcolors)) {
                $scope.classcolors = [];
            }
            if (!Array.isArray($scope.classaverages)) {
                $scope.classaverages = [];
            }
            else {
                // received all the classes, so use the default colors
                for (var i = 0; i < $scope.classaverages.length; i++) {
                    $scope.classcolors.push(ClassService.classIndexToColor(i));
                }
            }

            // classaverage is the average for class that this feature belongs to
            var classAverage;
            // otherAverage is the average for all other classes
            var otherAverage;

            // called with classAverage and otherAverage
            if ($scope.classaverage !== undefined) {
                $scope.classaverages.push($scope.classaverage);
                $scope.classcolors.push($scope.classcolor);
                // force conversion to numbers
                classAverage = +$scope.classaverage;
                otherAverage = +$scope.otheraverage;
            }
            else {
                // called with a list of averages
                var copyOfAverages = $scope.classaverages.slice();
                // sort numerically - see MDN
                copyOfAverages.sort(function(a, b) {
                    return a - b;
                });
                // the highest value is the class this feature belongs to
                classAverage = +(copyOfAverages.pop());
                var sum = copyOfAverages.reduce(function(previousValue, currentValue, currentIndex, array) {
                    return previousValue + (+currentValue);
                });
                otherAverage = sum / copyOfAverages.length;
            }
            // one std dev = 5% on this graph
            // a ttest of 2 means the means are 2 std dev apart, hence 10% apart
            var midpoint = (classAverage + otherAverage) / 2;
            // variables to hold the origin and the scale for the graph
            var stdDev = (classAverage - otherAverage) / $scope.ttest;
            var left = midpoint - 10*stdDev;


            function clamp(percent) {
                return (percent > 100) ? 100 : ((percent < 0) ? 0 : percent);
            }

            function convertFreqToPercent(frequency){
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