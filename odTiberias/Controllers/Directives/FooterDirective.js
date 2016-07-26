jTextMinerApp.directive('footerPage', function () {
    return {
        restrict: 'AE',
        templateUrl: 'partials/templates/FooterTemplate.html',
        controller: ['$scope', function ($scope) {
            $scope.isShow = false;

        }]
    };
});