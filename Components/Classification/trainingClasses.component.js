jTextMinerApp.component('trainingClasses', {
    templateUrl: 'Components/Classification/trainingClasses.component.html',
    bindings: {
        showDeleteButton: '<',
        classificationExperiment: '<'
    },
    controller: function (DialogService) {
        const ctrl = this;

        ctrl.deleteClass = function (index) {
            ctrl.classificationExperiment.deleteClass(index);
        }
        
        ctrl.updateClass = function (index) {
            DialogService.openDialog('chooseTextDialog', {
                startingText: ctrl.classificationExperiment.classes.Corpus_classes[index].text
            })
                .then((newSelection) =>
                    ctrl.classificationExperiment.updateClass(index, newSelection));
        }
    }
});