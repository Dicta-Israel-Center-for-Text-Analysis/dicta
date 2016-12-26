// create the controller and inject Angular's $scope
jTextMinerApp.component('saveAsDialog', {
    bindings: {
        onConfirm: '&',
        onCancel: '&',
        experiment: '='
    },
    templateUrl: 'Components/AppDialogs/saveAsDialog.component.html',
    controller: function ($scope, ngDialog) {
        var ctrl = this;
        ctrl.expName = ctrl.experiment.experimentName;
        ctrl.Save = function () {
            ctrl.experiment.updateExperimentName(ctrl.expName);
            ctrl.experiment.SaveExperiment();
            ctrl.onConfirm();
        }
    }
});