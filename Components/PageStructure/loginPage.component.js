﻿
jTextMinerApp.component('loginPage',
{
    templateUrl:'Components/PageStructure/loginPage.component.html',
    controller: function ($scope, ngDialog, UserService, ExperimentService, $location, APIService, AlertsService, InProgressService, $filter, ClassificationService, ClassService, SelectClassService, SaveClassInterface) {
        $scope.currentUser = UserService.user;
        $scope.showSignUp = false; //$scope.currentUser === 'user';
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

        $scope.LoadExperiment4 = function (fileName) {
            alert(fileName);
        }
        $scope.LoadExperiment3 = function (fileNameIndex, event) {
            alert(event.currentTarget);
        }
        $scope.LoadExperiment2 = function (fileName) {
            $scope.LoadPreviousResults = fileName;
            $scope.LoadExperiment();
        }

        $scope.LoadExperiment = function () {
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
                AlertsService.determineAlert({ msg: 'Please give a name for new experiment.', type: 'danger' });
            else {
                if (($scope.ExperimentMode == 'UploadStoredExperiment' && $scope.LoadPreviousResults.length == 0)) {
                    AlertsService.determineAlert({ msg: 'Please choose stored experiment', type: 'danger' });
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

                        APIService.apiRun({ crud: 'NewExperiment' }, $scope.data, function (response) {
                            InProgressService.updateIsReady(1);

                            if (response.userLogin.length != 0) {
                                AlertsService.determineAlert({ msg: 'NewExperiment', type: 'success' });
                                //$location.path($scope.ExperimentTypeModel);
                                $location.path('FirstTab');
                            }
                            else
                                AlertsService.determineAlert({ msg: 'There is such exp name', type: 'success' });
                        });
                    }
                    else {
                        ExperimentService.updateStoredExperimentName($scope.LoadPreviousResults);

                        $scope.data = {};
                        $scope.data.userLogin = UserService.user;
                        $scope.data.expType = ExperimentService.ExperimentTypeModel;
                        $scope.data.expName = ExperimentService.ExperimentName;

                        APIService.apiRun({ crud: 'DownloadStoredExperiment' }, $scope.data, function (response) {
                            InProgressService.updateIsReady(1);
                            AlertsService.determineAlert({ msg: 'DownloadStoredExperiment', type: 'success' });
                            $scope.UpdateData(response);
                            ClassificationService.featureCollection.updateTotalNumberOfFeatures(null);
                            $scope.UpdateExtractFeaturesData();
                            APIService.apiRun({ crud: 'Extract' }, $scope.data, function (response) {
                                var results = response;
                                //$location.path($scope.ExperimentTypeModel);
                                $location.path('FirstTab');
                            });

                        });
                    }

                }
            }
        }

        $scope.fileNameList = [];
        $scope.searchedFileNameList = [];
        $scope.comparedFileNameList = [];

        $scope.data = {};
        $scope.data.userLogin = UserService.user;
        $scope.data.expType = ExperimentService.ExperimentTypeModel;
        APIService.apiGetArray({ crud: 'GetUploadStoredExperiments' }, $scope.data, function (response) {
            $scope.fileNameList = response;
            AlertsService.determineAlert({ msg: 'Getting file\'s names is successed', type: 'success' });
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

        $scope.LoginDlg = function () {
            ngDialog.openConfirm({
                template: '<login-dialog on-confirm="confirm()" on-cancel="closeThisDialog()"></login-dialog>',
                plain: true,
                className: 'ngdialog-theme-default',
                closeByEscape: true,
                closeByDocument: true,
                scope: $scope
            }).then(function (value) {
                // successful login
                $location.path('AfterLogin');
            }, function (reason) {
                console.log('Modal promise rejected. Reason: ', reason);
            });
        }


        var cookieUsername = $.cookie('userLogin');
        if (cookieUsername != null) {
            UserService.tryLogin(cookieUsername)
                .then(function () {
                    $location.path('AfterLogin');
                });
        }

    }
}
);

