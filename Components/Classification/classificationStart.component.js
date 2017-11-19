jTextMinerApp.component('classificationStart',
{
    templateUrl: 'Components/Classification/classificationStart.component.html',
    controller: function(DialogService, $state) {
        const ctrl = this;
        ctrl.showWizard = function () {
            $state.go('classificationStart.wizard');
        };
    }
}); 