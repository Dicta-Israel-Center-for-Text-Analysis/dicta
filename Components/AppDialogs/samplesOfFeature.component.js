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

            // FIXME: the server sometimes returns user-friendly names for features and sometimes returns internal names
            const fixme = {
                "Adjective clause": "@scAjCl",
                "Casus pendens": "@scCPen",
                "Defective clause atom": "@scDefc",
                "Ellipsis": "@scEllp",
                "Extraposition": "@scXPos",
                "Infinitive absolute clause": "@scInfA",
                "Infinitive construct clause": "@scInfC",
                "Macrosyntactic sign": "@scMSyn",
                "Nominal clause": "@scNmCl",
                "Participle clause": "@scPtcp",
                "Reopening": "@scReop",
                "Unknown": "@scUnkn",
                "Vocative clause": "@scVoct",
                "Wayyiqtol-X clause": "@scWayX",
                "Wayyiqtol-null clause": "@scWay0",
                "We-X-imperative clause": "@scWXIm",
                "We-X-qatal clause": "@scWXQt",
                "We-X-yiqtol clause": "@scWXYq",
                "We-imperative-X clause": "@scWImX",
                "We-imperative-null clause": "@scWIm0",
                "We-qatal-X clause": "@scWQtX",
                "We-qatal-null clause": "@scWQt0",
                "We-x-imperative-X clause": "@scWxIX",
                "We-x-imperative-null clause": "@scWxI0",
                "We-x-qatal-X clause": "@scWxQX",
                "We-x-qatal-null clause": "@scWxQ0",
                "We-x-yiqtol-X clause": "@scWxYX",
                "We-x-yiqtol-null clause": "@scWxY0",
                "We-yiqtol-X clause": "@scWYqX",
                "We-yiqtol-null clause": "@scWYq0",
                "X-imperative clause": "@scXImp",
                "X-qatal clause": "@scXQtl",
                "X-yiqtol clause": "@scXYqt",
                "Zero-imperative-X clause": "@scZImX",
                "Zero-imperative-null clause": "@scZIm0",
                "Zero-qatal-X clause": "@scZQtX",
                "Zero-qatal-null clause": "@scZQt0",
                "Zero-yiqtol-X clause": "@scZYqX",
                "Zero-yiqtol-null clause": "@scZYq0",
                "x-imperative-X clause": "@scxImX",
                "x-imperative-null clause": "@scxIm0",
                "x-qatal-X clause": "@scxQtX",
                "x-qatal-null clause": "@scxQt0",
                "x-yiqtol-X clause": "@scxYqX",
                "x-yiqtol-null clause": "@scxYq0"
            };

            if (fixme.hasOwnProperty(ctrl.featureName)) {
                ctrl.featureName = fixme[ctrl.featureName];
            }

            const featureSettings = ctrl.experiment.getFeatureSettings(
                ctrl.featureSet
                    ? ctrl.featureSet
                    : ctrl.experiment.findFeatureSet(ctrl.featureName));
            const keys = _.flatMap(ctrl.experiment.classes.Corpus_classes, corpusclass => corpusclass.selectedText)
                .concat(SelectClassService.testText ? SelectClassService.testText.keys : []);
            //remove prefixes that distinguish feature set types if the server is sending them
            const featureName = ctrl.featureName
                .replace(/@(ml|ms|so|sc|sp)\u200e?/g, '@');
            ctrl.inProgress = true;
            APIService.call('TextFeatures/FindFeature', {
                featureName,
                keys,
                featureSettings
            })
                .then(response => {
                    ctrl.examples = response.data;
                    ctrl.inProgress = false;
                    if (response.data.length === 0)
                        ctrl.error = 'No results found. The data sources on the server may be out of sync.';
                })
                .catch(err => ctrl.error = 'Server Failed.');
        }
    });