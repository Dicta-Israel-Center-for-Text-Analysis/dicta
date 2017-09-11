jTextMinerApp.component('textWithFeatures', {
    bindings: {
        testFile: '<',
        index: '<',
        classifiedClassIndex: '<',
        features: '<'
    },
    templateUrl: 'Components/Classification/textWithFeatures.component.html',
    controller: ['$scope', '$sce', function ($scope, $sce) {
        $scope.convert2TrustAsHtml = function (text) {
            return $sce.trustAsHtml(text);
        };
    }]
});