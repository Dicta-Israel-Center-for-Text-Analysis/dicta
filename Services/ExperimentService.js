/**
 * @ngdoc service
 * @name JTextMinerApp:ExperimentService
 *
 * @description factory method NewExperiment returns an object that runs a single experiment
 *
 * */
angular.module('JTextMinerApp')
    .factory('ExperimentService', function($rootScope) {

    var algorithms = [
        { id: 0, name: 'Weka_SMO', attributes: '-C 1.0 -L 0.0010 -P 1.0E-12 -N 0 -V -1 -W 1 -K \"weka.classifiers.functions.supportVector.PolyKernel -C 250007 -E 3.0\"' },
        { id: 1, name: 'Weka_BayesianLogisticRegression', attributes: '-D -Tl 5.0E-5 -S 0.5 -H 1 -V 0.27 -R R:0.01-316,3.16 -P 2 -F 10 -I 200 -N' },
        { id: 2, name: 'Weka_NaiveBayesMultinomial', attributes: '' },
        { id: 3, name: 'Weka_NaiveBayes', attributes: '' },
        { id: 4, name: 'Weka_SVM', attributes: '-S 0 -K 2 -D 3 -G 0.0 -R 0.0 -N 0.5 -M 40.0 -C 1 -E 0.001 -P 0.1 -seed 1' },
        { id: 5, name: 'Weka_NNge', attributes: '-G 5 -I 2' },
        { id: 6, name: 'Weka_J48graft', attributes: '-C 0.5 -M 2' },
        { id: 7, name: 'Weka_Ridor', attributes: '-F 3 -S 1 -N 2.0' },
        { id: 8, name: 'Weka_KStar', attributes: '-B 20 -M a' },
        { id: 9, name: 'Weka_RandomForest', attributes: '-I 10 -K 0 -S 1' },
        { id: 10, name: 'Weka_Winnow', attributes: '-I 1 -A 2.0 -B 0.5 -H -1.0 -W 2.0 -S 1' },
        { id: 11, name: 'Weka_AttributeSelectedClassifier', attributes: '-E \"weka.attributeSelection.InfoGainAttributeEval\" -S \"weka.attributeSelection.Ranker -T -1.7976931348623157E308 -N -1\" -W weka.classifiers.functions.SMO -- -C 1.0 -L 0.001 -P 1.0E-12 -N 0 -V -1 -W 1 -K \"weka.classifiers.functions.supportVector.PolyKernel -C 250007 -E 1.0\"' },
        { id: 12, name: 'SVM_Light', attributes: '' }
    ];

    var service = {
        ALGORITHMS: algorithms,
        newExperiment() {
            // ClassificationService.featureCollection.updateFeaturesData({});
            // SegmentationService.SegmentationDefaultValues();
            //
            // ClassService.Corpus_classes = [];

            return {
                experimentGUID: null,
                experimentName: 'Untitled',
                selectedAlgorithmTypeId: 0,
                selectedAlgorithmTypeName: algorithms[0].name,
                selectedAlgorithmTypeAttributes: algorithms[0].attributes,
                updateExperimentName(value) {
                    this.experimentName = value;
                    $rootScope.$broadcast("valuesUpdated");
                },
                updateSelectedAlgorithmTypeValue (id, name, attributes) {
                    this.selectedAlgorithmTypeId = id;
                    this.selectedAlgorithmTypeName = name;
                    this.selectedAlgorithmTypeAttributes = attributes;
                }
            }
        }
    };

    return service;
});

