﻿// create the controller and inject Angular's $scope
jTextMinerApp.component('saveAsDialog', {
    bindings: { onConfirm: '&', onCancel: '&' },
    templateUrl: 'Components/AppDialogs/saveAsDialog.component.html',
    controller: function ($scope, ngDialog, ExperimentService) {
        var ctrl = this;
        $scope.expName = ExperimentService.ExperimentName;
        $scope.Save = function () {
            ExperimentService.updateExperimentName($scope.expName);
            ExperimentService.SaveExperiment();
            ctrl.onConfirm();
        }
    }
});