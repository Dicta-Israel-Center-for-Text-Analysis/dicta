/**
 * @ngdoc service
 * @name JTextMinerApp:ExperimentService
 *
 * @description factory method NewExperiment returns an object that runs a single experiment
 *
 * */
angular.module('JTextMinerApp')
    .factory('ExperimentService', function($rootScope, ClassificationService, SegmentationService, APIService, $location, InProgressService, ClassService, SelectClassService, UserService) {
        var service = {
            ExperimentName: 'Untitled',
            StoredExperimentName: '',
            selectedAlgorithmTypeId: 0,
            selectedAlgorithmTypeName: 'Weka_SMO',
            selectedAlgorithmTypeAttributes: '-C 1.0 -L 0.0010 -P 1.0E-12 -N 0 -V -1 -W 1 -K \"weka.classifiers.functions.supportVector.PolyKernel -C 250007 -E 3.0\"',
            cvResultData: [],
            tsResultData: [],
            resultData: [],

            NewExperiment() {
            }
        };

        //FIXME: circular dependency
        ClassificationService.ExperimentServiceFixMe = service;

        service.updateExperimentName = function (value) {
            this.ExperimentName = value;
            $rootScope.$broadcast("valuesUpdated");
        }

        service.updateStoredExperimentName = function (value) {
            this.StoredExperimentName = value;
            this.updateExperimentName(value);
            $rootScope.$broadcast("valuesUpdated");
        }

        service.algorithms = [
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
        service.updateselectedAlgorithmTypeValue = function (id, name, attributes) {
            this.selectedAlgorithmTypeId = id;
            this.selectedAlgorithmTypeName = name;
            this.selectedAlgorithmTypeAttributes = attributes;
            $rootScope.$broadcast("selectedAlgorithmTypebroadcast");
        }

        // save and load exp
        service.createSaveRequest = function () {
            var saveRequest = {
                userLogin: UserService.user,
                expType: 'Classification',
                expName: this.ExperimentName,
                selectedAlgorithmTypeId: this.selectedAlgorithmTypeId,
                selectedAlgorithmTypeName: this.selectedAlgorithmTypeName,
                selectedAlgorithmTypeAttributes: this.selectedAlgorithmTypeAttributes,
                classificationExperimentMode: ClassificationService.Classification_ExperimentType,
                classificationCrossValidationFolds: ClassificationService.Classification_CrossValidationFolds,
                corpusMaxId: ClassService.Corpus_maxId,
                featureSets: ClassificationService.featureCollection.Feature_sets,
                corpusClasses: ClassService.Corpus_classes,
                featuresData: ClassificationService.featureCollection.featuresData,
                selectTestTextKeys: SelectClassService.lastTestSetSelectedRootKeys
            };
            // copy so we can modify it
            saveRequest.cvResultData = angular.copy(this.cvResultData);
            // the server can't handle this yet
            delete saveRequest.cvResultData.classificationList;
            // same thing
            saveRequest.tsResultData = angular.copy(this.tsResultData);
            delete saveRequest.tsResultData.classificationList;
            return saveRequest;
        }

        service.SaveExperiment = function () {
            InProgressService.updateIsReady(0);
            APIService.apiRun({ crud: 'SaveClassification' }, this.createSaveRequest(), function (response) {
                InProgressService.updateIsReady(1);
                var results = response;
            });
        };

        service.NewExperiment = function () {
            this.updateResultData([]);
            ClassificationService.featureCollection.updateFeaturesData({});
            SegmentationService.SegmentationDefaultValues();

            this.data = {};
            this.data.userLogin = UserService.user;
            ClassService.Corpus_classes = [];

            APIService.apiRun({ crud: 'CheckUserLogin' }, this.data, function (response) {
                $location.path('Login');
            });
        }
        // end save and load exp

        // Results
        service.updateCvResultData = function (value) {
            this.cvResultData = value;
            $rootScope.$broadcast("cvResultDataUpdated");
        }
        service.updateTsResultData = function (value) {
            this.tsResultData = value;
            $rootScope.$broadcast("tsResultDataUpdated");
        }
        service.updateResultData = function (value) {
            this.resultData = value;
            $rootScope.$broadcast("valuesUpdated");
        }

        return service;
});

