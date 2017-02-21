jTextMinerApp.component('parallelsControls',
{
    bindings: {
        experiment: '<'
    },
    templateUrl: 'Components/Parallels/parallelsControls.component.html',
    controller: ['ngDialog',
        function(ngDialog) {
            var ctrl = this;
            // start on basic tab
            ctrl.advancedSettings = 0;
            ctrl.experiment.minParallelLength=12;
            ctrl.experiment.maxParallelSkip=6;
            ctrl.runParallels = function () {
                ctrl.experiment.runStatistics(ctrl.experiment.minParallelLength, ctrl.experiment.maxParallelSkip, ctrl.libraryIds);
            }

            ctrl.chooseTexts = function() {
                ngDialog.openConfirm({
                    plain: true,
                    template: '<choose-text-dialog ' +
                    'on-confirm="ngDialogData.setLibrary(selectionData);confirm()" ' +
                    'on-cancel="confirm()" ' +
                    'save-message="\'Select texts to search for parallels\'"' +
                    '</choose-text-dialog>',
                    data: {
                        setLibrary: ctrl.setLibrary
                    }
                });
            }

            ctrl.setLibrary =function (selectionData) {
                ctrl.libraryIds = selectionData.ids;
            }
        }]
}); 