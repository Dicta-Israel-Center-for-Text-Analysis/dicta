// create the controller and inject Angular's $scope
jTextMinerApp.component('algorithmDialog', {
    bindings: {
        onConfirm: '&',
        selectedAlgorithm: '<',
        onDiscard: '&',
        onAlgorithmChange: '&'
    },
    templateUrl: "Components/Classification/algorithmDialog.component.html",
    controller: function ($scope, ExperimentService) {
        this.algorithms = ExperimentService.ALGORITHMS;
        this.updateAndClose = function () {
            this.onAlgorithmChange({newAlgorithm: this.selectedAlgorithm});
            this.onConfirm();
        }
    }
});