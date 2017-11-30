jTextMinerApp.component('classificationResultSummary',
{
    bindings: {
        experiment: '<'
    },
    templateUrl: 'Components/Classification/classificationResultSummary.component.html',
    controller: function(DialogService) {
        const ctrl = this;

        ctrl.cache = null;
        ctrl.lastFeatures = null;
        ctrl.getHighlightedFeatures = function() {
            if (ctrl.lastFeatures === ctrl.experiment.featureCollection.featuresData.features)
                return ctrl.cache;
            ctrl.lastFeatures = ctrl.experiment.featureCollection.featuresData.features;
            const allFeatures =_.flatten(ctrl.experiment.featureCollection.featuresData.features);
            const activeFeatures = allFeatures.filter(feature => feature.selected);
            const topFeatures = _.groupBy(
                _.sortBy(activeFeatures, feature => feature.maxTTest),
                feature => feature.className
            );
            ctrl.cache = ctrl.experiment.classes.Corpus_classes.map(classData => ({
                title: classData.title,
                features: _.takeRight(topFeatures[classData.title], 5)
            }));
            return ctrl.cache;
        };

        ctrl.prettyPrint = function (name) {
            return prettyPrintMorphology(name);
        };

        ctrl.showFeatureExamples = function () {
            debugger;
        }
    }
}); 