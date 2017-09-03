jTextMinerApp.component('trainingClasses', {
    templateUrl: 'Components/Classification/trainingClasses.component.html',
    bindings: {
        showDeleteButton: '<',
        classificationExperiment: '<'
    },
    controller: function () {
        const ctrl = this;

        ctrl.deleteClass = function (index) {
            ctrl.classificationExperiment.deleteClass(index);
        }
    }
});