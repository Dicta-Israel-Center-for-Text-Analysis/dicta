jTextMinerApp.directive('featureSets', function () {
    return {
        restrict: 'AE',
        scope: {
            showDeleteButton: '=showDeleteButton'
        },
        templateUrl: 'partials/templates/FeatureSetTemplate.html',
        controller: ['$scope', 'FeatureService', function ($scope, FeatureService) {
            $scope.Feature_sets = FeatureService.Feature_sets;
            $scope.deleteFeatureSet = function (index) {
                FeatureService.deleteFeatureSet(index);
            };
            $scope.editFeatureSet = function (index) {
                ngDialog.openConfirm({
                    template: 'partials/Dialogs/partial-EditFeatureSetDialog.html',
                    controller: 'EditFeatureSetDialogController',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    featureSet: FeatureService.Feature_sets[index]
                }).then(function (value) {
                    console.log('Modal promise resolved. Value: ', value);
                }, function (reason) {
                    console.log('Modal promise rejected. Reason: ', reason);
                });
            };
        }]
    };
});

jTextMinerApp.directive('featureTable', function () {
    return {
        restrict: 'AE',
        scope: {
            isSelectDisabled: '=isSelectDisabled'
        },
        templateUrl: 'partials/templates/FeatureTableTemplate.html',
        controller: ['$scope', 'FeatureService', function ($scope, FeatureService) {
            $scope.predicate = '-maxTTest';

            $scope.Feature_sets = FeatureService.Feature_sets;

            $scope.featuresData = FeatureService.featuresData;
            /*
            $scope.$watch('featuresData', function () {
                if (!angular.isUndefined($scope.featuresData)) {
                    FeatureService.updateFeaturesData($scope.featuresData);
                }
            });
            */
            $scope.$on('featuresDataUpdated', function () {
                $scope.featuresData = FeatureService.featuresData;
            });

            $scope.maxTTestFilter = function (item) {
                return (item.maxTTest >= 2.0);
            };

            $scope.isMoreDetails = false;
            $scope.moreDetails = function () {
                $scope.isMoreDetails = true;
            }
            $scope.fewerDetails = function () {
                $scope.isMoreDetails = false;
            }

            $scope.TotalNumberOfFeatures = FeatureService.totalNumberOfFeatures;
            $scope.updateTotalNumberOfFeatures = function(item)
            {
                FeatureService.updateTotalNumberOfFeatures(item);
            }

            $scope.$on('totalNumberOfFeaturesUpdated', function () {
                $scope.TotalNumberOfFeatures = FeatureService.totalNumberOfFeatures;
            });
        }]
    };
});
