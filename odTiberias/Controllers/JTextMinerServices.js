//http://stackoverflow.com/questions/14833326/how-to-set-focus-on-input-field
jTextMinerApp.factory('focus', function ($rootScope, $timeout) {
    return function (name) {
        $timeout(function () {
            $rootScope.$broadcast('focusOn', name);
        });
    }
});

jTextMinerApp.service('fileUpload', ['$http', 'InProgressService', '$location', 'BrowseClassService', function ($http, InProgressService, $location, BrowseClassService) {
    this.uploadFileToUrl = function (file, uploadUrl, argument_name, userLoginName) {
        var fd = new FormData();
        fd.append(argument_name, file);
        fd.append('userLogin', userLoginName);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        })
        .success(function (data) {
            //$scope.Browse_NumberOfFiles
            if (argument_name == 'zipFile')
                BrowseClassService.updateCountWordsForUploadedZipFile(data);
            else if (argument_name == 'txtFile')
                BrowseClassService.updateCountWordsForUploadedTxtFile(data);
        })
        .error(function () {
            InProgressService.updateIsReady(-1);
        });
    }
}]);


jTextMinerApp.factory("APIService", function ($resource) {
    var url = "http://ec2-52-58-251-124.eu-central-1.compute.amazonaws.com:80/WebServiceJTextMinerNewRoot4/api/JTextMinerAPI";
    //url = "http://localhost:8080/NewWebSite/api/JTextMinerAPI";

    return $resource(url + "/:crud/:secondParam",
        { crud: "@crud", secondParam: "@secondParam" },
        {
            "apiRun": { method: 'POST', isArray: false },
            "apiGetArray": { method: 'POST', isArray: true },
        }
    );
});


jTextMinerApp.factory("CAPIService", function ($resource) {
    var url = "http://www.dictaparallelsserver.com/api";
   
    return $resource(url + "/:crud/:secondParam",
        { crud: "@crud", secondParam: "@secondParam" },
        {
            "apiRun": { method: 'POST', isArray: true }
        }
    );
});

jTextMinerApp.factory('ExperimentService', function ($rootScope, ClassificationService, SegmentationService, FeatureService, APIService, $location, InProgressService, ClassService, SelectClassService) {
    var service = {};

    service.baseUrl = "http://ec2-52-58-251-124.eu-central-1.compute.amazonaws.com:80/WebServiceJTextMinerNewRoot4/api/JTextMinerAPI";
    //service.baseUrl = "http://localhost:8080/NewWebSite/api/JTextMinerAPI";

    service.user = 'user';
    service.updateUser = function (value) {
        this.user = value;
        $rootScope.$broadcast("userUpdated");
    }
    service.isNewExperiment = true;

    
    service.ExperimentMode = 'NewExperiment';
    service.updateExperimentModeValue = function (value) {
        this.ExperimentMode = value;
        $rootScope.$broadcast("valuesUpdated");
    }

    service.ExperimentName = '';
    service.updateExperimentName = function (value) {
        this.ExperimentName = value;
        $rootScope.$broadcast("valuesUpdated");
    }

    service.NewExperimentName = 'name';
    service.updateNewExperimentName = function (value) {
        this.NewExperimentName = value;
        this.updateExperimentName(value);
        $rootScope.$broadcast("valuesUpdated");
    }
    service.StoredExperimentName = '';
    service.updateStoredExperimentName = function (value) {
        this.StoredExperimentName = value;
        this.updateExperimentName(value);
        $rootScope.$broadcast("valuesUpdated");
    }
    service.ExperimentTypeModel = 'Classification';
    service.updateExperimentTypeModelValue = function (value) {
        this.ExperimentTypeModel = value;
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
    service.selectedAlgorithmTypeId = 0;
    service.selectedAlgorithmTypeName = 'Weka_SMO';
    service.selectedAlgorithmTypeAttributes = '-C 1.0 -L 0.0010 -P 1.0E-12 -N 0 -V -1 -W 1 -K \"weka.classifiers.functions.supportVector.PolyKernel -C 250007 -E 3.0\"';
    service.updateselectedAlgorithmTypeValue = function (id, name, attributes) {
        this.selectedAlgorithmTypeId = id;
        this.selectedAlgorithmTypeName = name;
        this.selectedAlgorithmTypeAttributes = attributes;
        $rootScope.$broadcast("selectedAlgorithmTypebroadcast");
    }


    // save and load exp
    service.UpdateData = function () {
        this.data = {};
        this.data.userLogin = this.user;
        this.data.expType = this.ExperimentTypeModel;
        this.data.expName = this.ExperimentName;
        this.data.selectedAlgorithmTypeId = this.selectedAlgorithmTypeId;
        this.data.selectedAlgorithmTypeName = this.selectedAlgorithmTypeName;
        this.data.selectedAlgorithmTypeAttributes = this.selectedAlgorithmTypeAttributes;
        this.data.classificationExperimentMode = ClassificationService.Classification_ExperimentType;
        this.data.classificationCrossValidationFolds = ClassificationService.Classification_CrossValidationFolds;
        this.data.corpusMaxId = ClassService.Corpus_maxId;

        this.data.featureSets = FeatureService.Feature_sets;
        this.data.corpusClasses = ClassService.Corpus_classes;

        this.data.featuresData = FeatureService.featuresData;

        this.data.selectTestTextKeys = SelectClassService.lastTestSetSelectedRootKeys;
        this.data.cvResultData = this.cvResultData;
        this.data.tsResultData = this.tsResultData;
    }

    service.SaveExperiment = function () {
        InProgressService.updateIsReady(0);
        this.UpdateData();
        APIService.apiRun({ crud: 'SaveClassification' }, this.data, function (response) {
            InProgressService.updateIsReady(1);
            var results = response;
        });
    };

    service.NewExperiment = function () {
        this.updateResultData([]);
        FeatureService.updateFeaturesData({});
        SegmentationService.SegmentationDefaultValues();

        this.data = {};
        this.data.userLogin = this.user;
        ClassService.Corpus_classes = [];

        /*
        // http://www.aspsnippets.com/Articles/AngularJS-Get-and-display-Current-Date-and-Time.aspx
        var date = new Date();
        $scope.formatedDate = $filter('date')(new Date(), 'dd.MM.yyyy HH-mm-ss');

        //ExperimentService.ExperimentName += ' ' + $scope.formatedDate;
        $scope.data.expName = ExperimentService.ExperimentName;
        */
        APIService.apiRun({ crud: 'CheckUserLogin' }, this.data, function (response) {
            $location.path('Login');
        });

        
    }
    // end save and load exp



    service.isShowTrianBible = false;
    service.isShowTestBible = false;
    service.updateIsShowTestBible = function (value) {
        this.isShowTestBible = value;
        $rootScope.$broadcast("valuesUpdated");
    }
    service.updateIsShowTrianBible = function (value) {
        this.isShowTrianBible = value;
        $rootScope.$broadcast("valuesUpdated");
    }

    // Results
    service.cvResultData = [];
    service.updateCvResultData = function (value) {
        this.cvResultData = value;
        $rootScope.$broadcast("cvResultDataUpdated");
    }
    service.tsResultData = [];
    service.updateTsResultData = function (value) {
        this.tsResultData = value;
        $rootScope.$broadcast("tsResultDataUpdated");
    }
    service.resultData = [];
    service.updateResultData = function (value) {
        this.resultData = value;
        $rootScope.$broadcast("valuesUpdated");
    }

    service.selectedTestFileIndex = 0;
    service.updateSelectedTestFileIndex = function (value) {
        this.selectedTestFileIndex = value;
        $rootScope.$broadcast("valuesUpdated");
    }


    


    return service;
});