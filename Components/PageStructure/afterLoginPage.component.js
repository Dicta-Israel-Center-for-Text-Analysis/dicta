jTextMinerApp.component('afterLoginPage',
{
    templateUrl: 'Components/PageStructure/afterLoginPage.component.html',
    controller: function ($scope, ngDialog, ExperimentService, $location, APIService, focus, InProgressService, $filter, ClassificationService, ClassService, SelectClassService, SaveClassInterface, ParallelsService, UserService) {

        if (!UserService.isLoggedIn())
            $location.path('Login');

        $scope.isShow = false;
        $scope.currentUser = UserService.user;

        $scope.LoadPreviousResults = '';

        $scope.LoadExperiment = function (fileName) {
            $scope.LoadPreviousResults = fileName;

            ExperimentService.updateExperimentName($scope.LoadPreviousResults);

            $scope.data = {};
            $scope.data.userLogin = UserService.user;
            $scope.data.expType = "Classification";
            $scope.data.expName = ExperimentService.ExperimentName;

            APIService.apiRun({crud: 'DownloadStoredExperiment'}, $scope.data, function (response) {
                InProgressService.updateIsReady(1);
                $scope.UpdateData(response);
                $scope.GoToNextTab();

            });
        }

        $scope.StartNewExperiment = function (actionMode) {
            $scope.showClassDialog = true;

            ClassService.updateExperimentActionMode(actionMode);
        }

        $scope.fileNameList = [];
        $scope.searchedFileNameList = [];
        $scope.comparedFileNameList = [];

        $scope.data = {};
        $scope.data.userLogin = UserService.user;

        $scope.data.expType = "Classification";
        APIService.apiGetArray({crud: 'GetUploadStoredExperiments'}, $scope.data, function (response) {
            $scope.fileNameList = response;
        });

        $scope.UpdateData = function (data) {
            // ExperimentService.updateExperimentName(data.expName);

            // ExperimentService.updateselectedAlgorithmTypeValue(data.selectedAlgorithmTypeId, data.selectedAlgorithmTypeName, data.selectedAlgorithmTypeAttributes);

            // ClassificationService.updateClassification_ExperimentTypeValue(data.classificationExperimentMode);
            // ClassificationService.updateClassification_CrossValidationFoldsValue(data.classificationCrossValidationFolds);

            ClassService.Corpus_maxId = data.corpusMaxId;

            // ClassificationService.featureCollection.Feature_sets = data.featureSets;
            ClassService.Corpus_classes = data.corpusClasses;

            // ClassificationService.featureCollection.updateFeaturesData(data.featuresData);

            SelectClassService.setTestSetRootKeys(data.selectTestTextKeys);

            // ExperimentService.updateCvResultData(data.cvResultData);
            // ExperimentService.updateTsResultData(data.tsResultData);


        }

        $scope.cancelClass = function () {
            $scope.showClassDialog = false;

        }

        $scope.saveClass = function () {
            SelectClassService.setTestSetRootKeys(SelectClassService.lastSelectedRootKeys);

            $scope.data = {};
            $scope.data.userLogin = UserService.user;
            $scope.data.expType = 'Classification';

            $scope.data.expName = ExperimentService.ExperimentName;

            APIService.apiRun({crud: 'NewExperiment'}, $scope.data, function (response) {
                InProgressService.updateIsReady(1);

                if (response.userLogin.length != 0) {
                    $scope.GoToNextTab();
                }
            });
        };


        $scope.GoToNextTab = function () {

            InProgressService.updateIsReady(0);
            //UnknownTestClass
            var classData = SaveClassInterface.getInstance();

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

        $scope.ActionMode = ClassService.ExperimentActionMode;
        $scope.$on('ExperimentActionModeValuesUpdated', function () {
            $scope.ActionMode = ClassService.ExperimentActionMode;
        });
}
});