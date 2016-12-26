jTextMinerApp.component('afterLoginPage',
{
    templateUrl: 'Components/PageStructure/afterLoginPage.component.html',
    controller: function ($scope, ExperimentService, $location, APIService, InProgressService, ClassificationService, ClassService, SelectClassService, UserService) {

        if (!UserService.isLoggedIn())
            $location.path('Login');

        $scope.isShow = false;
        $scope.currentUser = UserService.user;

        $scope.LoadExperiment = function (fileName) {
            ExperimentService.updateExperimentName(fileName);

            var data = {
                userLogin: UserService.user,
                expType: "Classification",
                expName: ExperimentService.ExperimentName
            };
            
            APIService.apiRun({crud: 'DownloadStoredExperiment'}, data, function (response) {
                InProgressService.updateIsReady(1);
                $scope.UpdateData(response);
                $scope.GoToNextTab();

            });
        };

        $scope.StartNewExperiment = function (actionMode) {
            $scope.showClassDialog = true;

            ClassService.updateExperimentActionMode(actionMode);
        };

        $scope.fileNameList = [];
        $scope.searchedFileNameList = [];
        $scope.comparedFileNameList = [];

        var requestData = {
            userLogin: UserService.user,
            expType: "Classification"
        };

        APIService.apiGetArray({crud: 'GetUploadStoredExperiments'}, requestData, function (response) {
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
        };

        $scope.cancelClass = function () {
            $scope.showClassDialog = false;

        };

        $scope.saveClass = function () {
            SelectClassService.setTestSetRootKeys(SelectClassService.lastSelectedRootKeys);

            ExperimentService.resetServer()
                .then(
                    () => $scope.GoToNextTab()
                );
        };

        $scope.GoToNextTab = function () {

            InProgressService.updateIsReady(0);
            $location.path('Tabs');
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