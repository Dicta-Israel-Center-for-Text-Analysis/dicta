jTextMinerApp.component('classificationControls',
{
    templateUrl: 'Components/Classification/classificationControls.component.html',
    controller:
        function(StateService, ClassificationService, DialogService, $scope, SelectClassService) {
            const ctrl = this;
            ctrl.experiment = StateService.getOrCreate('classificationExperiment', () => ClassificationService.newExperiment());
            ctrl.defineClass = function () {
                DialogService.openDialog('chooseTextDialog', { saveMessage: 'ANALYZE' })
                    .then(ctrl.saveClass)
                    .catch(ctrl.cancelClass);
            };
            ctrl.saveClass = function (selectionData) {
                ctrl.experiment.addClass(selectionData);
            };
            ctrl.cancelClass = function (stuff) {
            };
            ctrl.runExperiment = function () {
                ctrl.experiment.runClassification();
                // ctrl.experiment.getTextsWithFeatures();
            }
        }
}); 