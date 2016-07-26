

jTextMinerApp.directive('ttestSlider', function ($timeout) {
    return {
        restrict: 'AE',
        templateUrl: 'partials/templates/TTestSliderTemplate.html',
        scope: {
            featureId: '@',
            currentvalue: '@',
            classaverage: '@',
            otheraverage: '@',
            ttest: '@',
            classcolor: '@'
        },
        link: function ($scope, element, attrs) {
            $timeout(function () {
                //http://stackoverflow.com/questions/29620669/run-jquery-after-angular-is-done-rendering
                var slider = new Slider("#" + $scope.featureId, {});
            });
            
        },
        controller: ['$scope', 'ExperimentService', 'APIService', 'FeatureService', 'ClassService', 'InProgressService', function ($scope, ExperimentService, APIService, FeatureService, ClassService, InProgressService) {
            $scope.tTestScale = 4;
            $scope.boundClass = function (ttest) {
                if (ttest >= $scope.tTestScale)
                    return $scope.tTestScale;
                return $scope.tTestScale / 2 + ttest / 2;
            }
            $scope.boundOthers = function (ttest) {
                if (ttest >= $scope.tTestScale)
                    return 0;
                return $scope.tTestScale / 2 - ttest / 2;
            }
            $scope.boundCurrentValue = function (avg, other, val, ttest) {
                if (val <= 0 && other > 0)
                    return 0;

                var boundOthers = $scope.boundOthers(ttest);
                //var boundClass = $scope.boundClass(ttest);
                if (val == other)
                    return boundOthers;

                if (val <= other)
                {
                    if (ttest >= $scope.tTestScale)
                        return 0;
                    
                    return boundOthers * val / other;
                }
                else if (val >= avg)
                {
                    if (ttest >= $scope.tTestScale || val >= (avg + other))
                        return $scope.tTestScale;

                    var boundVal = $scope.tTestScale * val / (avg + other);

                    return boundVal;
                }
                else
                {
                    var newval = boundOthers + ttest*(val - other) / (avg - other);
                    return newval;
                }
                
                
            }
        }]
    };
});