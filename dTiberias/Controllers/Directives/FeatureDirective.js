jTextMinerApp.directive('featureSets', function (ngDialog) {
    return {
        restrict: 'AE',
        scope: {
            showDeleteButton: '=showDeleteButton',
            featureCollection: '='
        },
        templateUrl: 'partials/templates/FeatureSetTemplate.html',
        controller: ['$scope', function ($scope) {
            $scope.Feature_sets = $scope.featureCollection.Feature_sets;
            $scope.deleteFeatureSet = function (index) {
                $scope.featureCollection.deleteFeatureSet(index);
            };
            $scope.editFeatureSet = function (index) {
                var featuresData;
                if ($scope.featureCollection.featuresData.features !== undefined && $scope.featureCollection.featuresData.features.length > index)
                    featuresData = $scope.featureCollection.featuresData.features[index];
                ngDialog.openConfirm({
                    template: 'partials/Dialogs/partial-EditFeatureSetDialog.html',
                    controller: 'EditFeatureSetDialogController',
                    className: 'ngdialog-theme-default override-background',
                    scope: $scope,
                    data: {
                        featureCollection: $scope.featureCollection,
                        featureSet: $scope.featureCollection.Feature_sets[index],
                        featuresData: featuresData
                    }
                }).then(function (value) {
                    console.log('Modal promise resolved. Value: ', value);
                }, function (reason) {
                    console.log('Modal promise rejected. Reason: ', reason);
                });
            };
        }]
    };
});

jTextMinerApp.directive('featureTable', function (ClassService) {
    return {
        restrict: 'AE',
        scope: {
            isSelectDisabled: '=isSelectDisabled',
            features: '='
        },
        templateUrl: 'partials/templates/FeatureTableTemplate.html',
        controller: ['$scope', function ($scope) {
            $scope.predicate = '-maxTTest';

            $scope.maxTTestFilter = function (item) {
                return (item.maxTTest >= 2.0);
            };

            $scope.sortKey = '-maxTTest';
            $scope.sortReverse = false;
            $scope.sortClick = function (field){
                if ($scope.sortKey==field) {
                    $scope.sortReverse = !$scope.sortReverse;
                }
                else {
                    $scope.sortKey = field;
                    $scope.sortReverse = false;
                }
            }
            $scope.arrowClass = function (field) {
                if ($scope.sortKey == field) {
                    if ($scope.sortReverse)
                        return "fa fa-caret-up";
                    else
                        return "fa fa-caret-down";
                }
                return "";
            }

            $scope.classNameToBgStyle = function (name) {
                return { "background-color": ClassService.classNameToColor(name) };
            };


            /* currently unused
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
            */
        }]
    };
});
