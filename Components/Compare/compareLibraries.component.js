jTextMinerApp.component('compareLibraries', {
        templateUrl: 'Components/Compare/compareLibraries.component.html',
        controller: ['$scope', 'InProgressService', 'SelectClassService', '$sce', 'ngDialog', 'ClassService', 'ClassificationService', 'APIService', 'SaveClassInterface', 'ExperimentService',
            function ($scope, InProgressService, SelectClassService, $sce, ngDialog, ClassService, ClassificationService, APIService, SaveClassInterface, ExperimentService) {
            var ctrl = this;
            ctrl.showInProcess = InProgressService.isReady != 1;
            $scope.$on('isReady_Updated', function () {
                ctrl.showInProcess = InProgressService.isReady != 1;
            });
            ctrl.experiment = ClassificationService.newExperiment();
            var selectionData = angular.extend({ className: 'First Text'}, SelectClassService.testText);

            ctrl.firstRun = true;
            ctrl.chooseText = function () {
                if (ctrl.firstRun) {
                    ctrl.firstRun = false;
                    ctrl.experiment.saveClass(selectionData);
                }
                ngDialog.openConfirm({
                        template: '<choose-text-dialog ' +
                        'on-confirm="confirm(); ngDialogData.saveClass(selectionData);" ' +
                        'on-cancel="closeThisDialog()" ' +
                        'naming-message="\'Name this text\'" ' +
                        'class-name="ngDialogData.className">' +
                        '</choose-text-dialog>',
                        plain: true,
                        data: {
                            className: ctrl.experiment.classes.newClassName,
                            saveClass: ctrl.saveClass
                        }
                    }
                );
            };

            ctrl.fixmeCounter = 1;
            ctrl.saveClass = function (selectionData) {
                if (ctrl.experiment.classes.Corpus_classes.length > 1)
                    ctrl.experiment.DeleteClass(1)
                    .then(() => ctrl.experiment.saveClass(selectionData));
                else
                    ctrl.experiment.saveClass(selectionData);
            };
            ctrl.showCrossvalidation = function () {
                ngDialog.openConfirm({
                    template: '<crossvalidation-table-dialog crossvalidation-results="ngDialogData.cvResultData" on-confirm="confirm()"></crossvalidation-table-dialog>',
                    plain: true,
                    data: { cvResultData: ctrl.experiment.cvResultData },
                    closeByEscape: true,
                    closeByDocument: true,
                    className: 'ngdialog-theme-default override-background'
                });
            };
            ctrl.chooseFeatures = function () {
                ngDialog.openConfirm({
                    template: '<edit-feature-set-dialog ' +
                    'on-confirm="confirm()" ' +
                    'on-discard="closeThisDialog()" ' +
                    'class-object="$ctrl.experiment.classes" ' +
                    'feature-collection="$ctrl.experiment.featureCollection" ' +
                    'feature-index="0"' +
                    'run-extract="$ctrl.runExtract()"></edit-feature-set-dialog>',
                    plain: true,
                    className: 'ngdialog-theme-default override-background',
                    scope: $scope,
                    closeByEscape: true,
                    closeByDocument: true,
                });
            }

            ctrl.runExtract = function () {
                ctrl.experiment.cvResultData.accuracy[0] = false;
                // need to return a promise
                return ctrl.experiment.prepareClassification();
            }

            ctrl.chooseAlgorithm = function () {
                ctrl.selectedAlgorithmType = ExperimentService.ALGORITHMS[ctrl.experiment.base.selectedAlgorithmTypeId];
                ngDialog.openConfirm({
                    template: '<algorithm-dialog ' +
                    'on-confirm="confirm()" ' +
                    'on-discard="closeThisDialog()" ' +
                    'selected-algorithm="$ctrl.selectedAlgorithmType" ' +
                    'on-algorithm-change="$ctrl.updateAlgorithm(newAlgorithm)">' +
                    '</algorithm-dialog>',
                    plain: true,
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });
            }

            ctrl.updateAlgorithm = function(algorithmSettings) {
                ctrl.experiment.base.updateSelectedAlgorithmTypeValue(algorithmSettings.id, algorithmSettings.name, algorithmSettings.attributes);
            }
        }]
    }
);