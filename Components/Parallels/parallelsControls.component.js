jTextMinerApp.component('parallelsControls',
{
    bindings: {
        experiment: '<'
    },
    templateUrl: 'Components/Parallels/parallelsControls.component.html',
    controller: [
        function() {
            var ctrl = this;
            // start on basic tab
            ctrl.advancedSettings = 0;
            ctrl.experiment.minParallelLength=12;
            ctrl.experiment.maxParallelSkip=6;
            ctrl.runParallels = function () {
                ctrl.experiment.runParallels(ctrl.experiment.minParallelLength, ctrl.experiment.maxParallelSkip);
            }
        }]
}); 