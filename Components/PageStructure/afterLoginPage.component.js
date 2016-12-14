
jTextMinerApp.component('afterLoginPage',
{
    templateUrl: 'Components/PageStructure/afterLoginPage.component.html',
    controller: function ($scope, ngDialog, ExperimentService, $location, APIService, focus, AlertsService, InProgressService, $filter, ClassificationService, ClassService, SelectClassService, SaveClassInterface, ParallelsService, UserService) {

        if (!UserService.isLoggedIn())
            $location.path('Login');

        $scope.isShow = false;
        ExperimentService.updateExperimentTypeModelValue("Classification");
        $scope.currentUser = UserService.user;
        if (ExperimentService.isNewExperiment)
            ExperimentService.isNewExperiment = false;

        $scope.ExperimentTypeModel = ExperimentService.ExperimentTypeModel;
        $scope.$watch('ExperimentTypeModel', function () {
            ExperimentService.updateExperimentTypeModelValue($scope.ExperimentTypeModel);
        });

        $scope.$on('valuesUpdated', function () {
            $scope.ExperimentTypeModel = ExperimentService.ExperimentTypeModel;
        });

        $scope.ExperimentMode = ExperimentService.ExperimentMode;
        $scope.$watch('ExperimentMode', function () {
            ExperimentService.updateExperimentModeValue($scope.ExperimentMode);
        });

        $scope.NewExperimentName = ExperimentService.NewExperimentName;
        $scope.LoadPreviousResults = '';

        $scope.LoadExperiment = function (fileName) {
            $scope.LoadPreviousResults = fileName;
            $scope.ExperimentMode = 'UploadStoredExperiment';
            $scope.Next();
        }


        $scope.StartNewExperiment = function (actionMode) {
            $scope.ExperimentMode = 'NewExperiment';

            $scope.showClassDialog = true;

            ClassService.updateClassName('class ' + ClassService.Corpus_maxId);

            ClassService.updateExperimentActionMode(actionMode);
            //$scope.Next();
        }

        $scope.Next = function () {
            if ($scope.ExperimentMode == 'NewExperiment' && $scope.NewExperimentName.length == 0)
                AlertsService.determineAlert({msg: 'Please give a name for new experiment.', type: 'danger'});
            else {
                if (($scope.ExperimentMode == 'UploadStoredExperiment' && $scope.LoadPreviousResults.length == 0)) {
                    AlertsService.determineAlert({msg: 'Please choose stored experiment', type: 'danger'});
                }
                else {
                    InProgressService.updateIsReady(0);

                    if ($scope.ExperimentMode == 'NewExperiment') {
                        ExperimentService.updateNewExperimentName($scope.NewExperimentName);

                        $scope.data = {};
                        $scope.data.userLogin = UserService.user;
                        $scope.data.expType = ExperimentService.ExperimentTypeModel;

                        // http://www.aspsnippets.com/Articles/AngularJS-Get-and-display-Current-Date-and-Time.aspx
                        var date = new Date();
                        $scope.formatedDate = $filter('date')(new Date(), 'dd.MM.yyyy HH-mm-ss');

                        //ExperimentService.ExperimentName += ' ' + $scope.formatedDate;
                        $scope.data.expName = ExperimentService.ExperimentName;


                        APIService.apiRun({crud: 'NewExperiment'}, $scope.data, function (response) {
                            InProgressService.updateIsReady(1);

                            if (response.userLogin.length != 0) {
                                AlertsService.determineAlert({msg: 'NewExperiment', type: 'success'});
                                //$location.path($scope.ExperimentTypeModel);
                                $scope.GoToNextTab();
                            }
                            else
                                AlertsService.determineAlert({msg: 'There is such exp name', type: 'success'});
                        });

                    }
                    else {
                        ExperimentService.updateStoredExperimentName($scope.LoadPreviousResults);

                        $scope.data = {};
                        $scope.data.userLogin = UserService.user;
                        $scope.data.expType = ExperimentService.ExperimentTypeModel;
                        $scope.data.expName = ExperimentService.ExperimentName;

                        APIService.apiRun({crud: 'DownloadStoredExperiment'}, $scope.data, function (response) {
                            InProgressService.updateIsReady(1);
                            AlertsService.determineAlert({msg: 'DownloadStoredExperiment', type: 'success'});
                            $scope.UpdateData(response);
                            $scope.GoToNextTab();

                        });
                    }

                }
            }
        }


        focus('focusMe');


        $scope.fileNameList = [];
        $scope.searchedFileNameList = [];
        $scope.comparedFileNameList = [];

        $scope.data = {};
        $scope.data.userLogin = UserService.user;

        $scope.data.expType = ExperimentService.ExperimentTypeModel;
        APIService.apiGetArray({crud: 'GetUploadStoredExperiments'}, $scope.data, function (response) {
            $scope.fileNameList = response;
            AlertsService.determineAlert({msg: 'Getting file\'s names is successed', type: 'success'});
        });


        $scope.UpdateData = function (data) {
            //ExperimentService.updateExperimentModeValue();
            ExperimentService.updateExperimentTypeModelValue(data.expType);
            ExperimentService.updateExperimentName(data.expName);

            ExperimentService.updateselectedAlgorithmTypeValue(data.selectedAlgorithmTypeId, data.selectedAlgorithmTypeName, data.selectedAlgorithmTypeAttributes);

            ClassificationService.updateClassification_ExperimentTypeValue(data.classificationExperimentMode);
            ClassificationService.updateClassification_CrossValidationFoldsValue(data.classificationCrossValidationFolds);

            ClassService.Corpus_maxId = data.corpusMaxId;

            ClassificationService.featureCollection.Feature_sets = data.featureSets;
            ClassService.Corpus_classes = data.corpusClasses;

            ClassificationService.featureCollection.updateFeaturesData(data.featuresData);

            SelectClassService.setTestSetRootKeys(data.selectTestTextKeys);

            ExperimentService.updateCvResultData(data.cvResultData);
            ExperimentService.updateTsResultData(data.tsResultData);


        }
        $scope.UpdateExtractFeaturesData = function () {
            $scope.data = {};
            $scope.data.userLogin = UserService.user;
            $scope.data.expType = ExperimentService.ExperimentTypeModel;


            $scope.data.expName = ExperimentService.ExperimentName;

            $scope.data.featureSets = ClassificationService.featureCollection.Feature_sets;
            $scope.data.corpusClasses = ClassService.Corpus_classes;

            $scope.data.featuresData = ClassificationService.featureCollection.featuresData;

        }

        $scope.cancelClass = function () {
            $scope.showClassDialog = false;

        }


        $scope.saveClass = function () {
            SelectClassService.setTestSetRootKeys(SelectClassService.lastSelectedRootKeys);
            $scope.Next();

        }


        $scope.GoToNextTab = function () {

            InProgressService.updateIsReady(0);
            $scope.data = {};
            //UnknownTestClass
            var classData = SaveClassInterface; // {};
            ClassService.updateExperimentTestSetActionMode(classData.actionMode);
            InProgressService.updateIsReady(0);
            if (angular.equals(classData.actionMode, 'SelectOnlineCorpus')) {
                classData.select_RootKeys = SelectClassService.lastTestSetSelectedRootKeys;
            }
            classData.expType = 'Classification';
            APIService.apiRun({crud: 'UnknownTestClassAsChunks'}, classData, function (response) {
                ParallelsService.updateChunks(response.chunks);
                ParallelsService.updateSource(response.source);
                InProgressService.updateIsReady(1);
                $location.path('Tabs');
            });

        };
        $scope.showInProcess = InProgressService.isReady != 1;
        $scope.$on('isReady_Updated', function () {
            $scope.showInProcess = InProgressService.isReady != 1;
        });
}
});