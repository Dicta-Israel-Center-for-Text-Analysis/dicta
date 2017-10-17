jTextMinerApp.component('textWithFeatures', {
    bindings: {
        experiment: '<',
        testFile: '<',
        index: '<',
        classifiedClassIndex: '<',
        features: '<'
    },
    templateUrl: 'Components/Classification/textWithFeatures.component.html',
    controller: function ($scope, $sce, DialogService) {
        const ctrl = this;
        $scope.convert2TrustAsHtml = function (text) {
            return $sce.trustAsHtml(text);
        };

        ctrl.viewAdvanced = function () {
            DialogService.openDialog('textClassificationDataDialog', {
                experiment: ctrl.experiment,
                testFile: ctrl.testFile
            })
        }
    }
});