jTextMinerApp.component('classificationAdjustments',
{
    bindings: {
        experiment: '<'
    },
    templateUrl: 'Components/Classification/classificationAdjustments.component.html',
    controller: function(DialogService) {
        const ctrl = this;
        ctrl.removeFeatures = function () {
            DialogService.openDialog('editFeatureSetDialog', { experiment: ctrl.experiment })
        }
    }
}); 