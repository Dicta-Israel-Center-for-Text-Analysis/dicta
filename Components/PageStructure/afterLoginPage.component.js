jTextMinerApp.component('afterLoginPage',
{
    templateUrl: 'Components/PageStructure/afterLoginPage.component.html',
    controller: function ($scope, ExperimentService, $location, APIService, ClassificationService, ClassService, SelectClassService, UserService, ngDialog) {
        var ctrl = this;

        if (!UserService.isLoggedIn())
            $location.path('Login');

        $scope.isShow = false;
        ctrl.currentUser = UserService.user == "testuser" ? "Guest User" : UserService.user;

        $scope.LoadExperiment = function (fileName) {
            // ExperimentService.updateExperimentName(fileName);

            var data = {
                userLogin: UserService.user,
                expType: "Classification",
                expName: ExperimentService.experimentName
            };
            
            APIService.apiRun({crud: 'DownloadStoredExperiment'}, data, function (response) {
                $scope.UpdateData(response);
                $scope.GoToNextTab();

            });
        };

        $scope.fileNameList = [];
        $scope.searchedFileNameList = [];
        $scope.comparedFileNameList = [];

        var requestData = {
            userLogin: UserService.user,
            expType: "Classification"
        };

        // API removed
        // APIService.apiGetArray({crud: 'GetUploadStoredExperiments'}, requestData, function (response) {
        //     $scope.fileNameList = response;
        // });

        $scope.UpdateData = function (data) {
            // ExperimentService.updateExperimentName(data.expName);

            // ExperimentService.updateselectedAlgorithmTypeValue(data.selectedAlgorithmTypeId, data.selectedAlgorithmTypeName, data.selectedAlgorithmTypeAttributes);

            // ClassificationService.updateClassification_ExperimentTypeValue(data.classificationExperimentMode);
            // ClassificationService.updateClassification_CrossValidationFoldsValue(data.classificationCrossValidationFolds);

            //ClassService.Corpus_maxId = data.corpusMaxId;

            // ClassificationService.featureCollection.Feature_sets = data.featureSets;
            // ClassService.Corpus_classes = data.corpusClasses;

            // ClassificationService.featureCollection.updateFeaturesData(data.featuresData);

            SelectClassService.setTestSetRootKeys(data.selectTestTextKeys);

            // ExperimentService.updateCvResultData(data.cvResultData);
            // ExperimentService.updateTsResultData(data.tsResultData);
        };

        $scope.cancelClass = function () {
            $scope.showClassDialog = false;

        };

        $scope.saveClass = function (selectionData) {
            SelectClassService.setTestText(selectionData);

            $scope.GoToNextTab();
        };

        $scope.GoToNextTab = function () {
            $location.path('Tabs');
        };

        ctrl.showTextSelection = function(mode) {
            ngDialog.openConfirm({
                plain: true,
                scope: $scope,
                template: '<choose-text-dialog ' +
                'on-confirm="saveClass(selectionData);confirm()" ' +
                'on-cancel="cancelClass();confirm()" ' +
                'save-message="\'Select as test text\'"' +
                'starting-mode="\'' + mode + '\'">' +
                '</choose-text-dialog>'
            });
        }
}
});