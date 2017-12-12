jTextMinerApp.component('samplesOfFeature',
    {
        bindings: {
            featureSet: '<',
            featureName: '<',
            experiment: '<',
            onConfirm: '&'
        },
        templateUrl: 'Components/AppDialogs/samplesOfFeature.component.html',
        controller: function (APIService, SelectClassService) {
            const ctrl = this;
            ctrl.displayName = prettyPrintMorphology(ctrl.featureName);
            ctrl.trim = function (key) {
                return key.replace('/Dicta Corpus/Tanakh/','');
            };

            const featureSettings = ctrl.experiment.getFeatureSettings(ctrl.featureSet);
            const keys = _.flatMap(ctrl.experiment.classes.Corpus_classes, corpusclass => corpusclass.selectedText)
                .concat(SelectClassService.testText ? SelectClassService.testText.keys : []);
            //remove prefixes that distinguish feature set types if the server is sending them
            const featureName = ctrl.featureName
                .replace(/@(ml|ms|so|sc|sp)/g, '@');
            APIService.call('TextFeatures/FindFeature', {
                featureName,
                keys,
                featureSettings
            }).then(response => {
                ctrl.examples = response.data;
            })
        }
    });