jTextMinerApp.component('parallelsControls',
{
    bindings: {
        experiment: '<'
    },
    templateUrl: 'Components/Parallels/parallelsControls.component.html',
    controller: function(DialogService, TreeService, UserService) {
        const ctrl = this;
        // start on basic tab
        ctrl.advancedSettings = 0;
        ctrl.experiment.minParallelLength=12;
        ctrl.experiment.maxParallelSkip=6;

        ctrl.runParallels = function () {
            ctrl.experiment.runStatistics(ctrl.experiment.minParallelLength, ctrl.experiment.maxParallelSkip, ctrl.libraryIds);
        };

        ctrl.chooseTexts = function() {
            DialogService.openDialog('chooseTextDialog', {
                saveMessage: 'Select texts to search'
            })
            .then(ctrl.setLibrary);
        };

        ctrl.setLibrary =function (selectionData) {
            ctrl.libraryIds = selectionData.ids;
        }
    }
}); 