jTextMinerApp.component('textClassificationDataDialog',
{
    bindings: {
        experiment: '<',
        testFile: '<',
        onConfirm: '&'
    },
    templateUrl: 'Components/Classification/textClassificationDataDialog.component.html',
    controller: function(DialogService) {
        const ctrl = this;
        
        ctrl.convertFeatureName = function (featureName) {
            let converted = featureName;
            if (converted.indexOf('_') > -1) {
                converted = prettyPrintMorphology(converted);
            }
            return converted;
        };

        ctrl.classes = ctrl.experiment.classes.Corpus_classes;

        ctrl.indexOfClass = function (name) {
            return ctrl.classes.map(classData => classData.title).indexOf(name)
        };

        ctrl.classIndexToColor = function (classNum) {
            return ["#634C9F", "#FFD933", "#4EB6A3", "#B65A4E"][classNum];
        }

        ctrl.classNameToColor = function (className) {
            return ctrl.classIndexToColor(ctrl.indexOfClass(className));
        }

        ctrl.showExamples = function (feature) {
            DialogService.openDialog('samplesOfFeature', {
                featureName: feature.name,
                experiment: ctrl.experiment
            })
        };
    }
}); 