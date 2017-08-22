jTextMinerApp.component('classificationControls',
{
    templateUrl: 'Components/Classification/classificationControls.component.html',
    controller: ['StateService', 'ClassificationService', 'ngDialog', '$scope', 'SelectClassService',
        function(StateService, ClassificationService, ngDialog, $scope, SelectClassService) {
            const ctrl = this;
            ctrl.experiment = StateService.getOrCreate('classificationExperiment', () => ClassificationService.newExperiment());
            ctrl.defineClass = function () {
                ngDialog.openConfirm({
                    plain: true,
                    scope: $scope,
                    template: '<choose-text-dialog ' +
                    'on-confirm="$ctrl.saveClass(selectionData);confirm()" ' +
                    'on-cancel="$ctrl.cancelClass();confirm()" ' +
                    'save-message="\'ANALYZE\'"' + '>' +
                    '</choose-text-dialog>'
                });
            };
            ctrl.saveClass = function (selectionData) {
                const experiment = ctrl.experiment;
                selectionData.className = SelectClassService.summarizeText(selectionData);
                function addClass (classData) {
                    experiment.classes.isAllBible = experiment.classes.isAllBible && classData.bible;
                    experiment.featureCollection.updateFeaturesData({});
                    experiment.classes.Corpus_maxId += 1;
                    classData.id = experiment.classes.Corpus_maxId;
                    experiment.classes.Corpus_classes.push(classData);
                }
                experiment.trainSet[selectionData.className] = selectionData.keys;
                addClass({
                    title: selectionData.className,
                    selectedText: selectionData.keys, //results.selectedText,
                    chunkMode: 'By chapter',
                    chunkSize: '',
                    // numberOfChunks: results.numberOfChunks,
                    // totalNumberOfWords: results.totalNumberOfWords,
                    bible: true
                });
            };
            ctrl.cancelClass = function (stuff) {
            }
            ctrl.runExperiment = function () {
                ctrl.experiment.runClassification();
                // ctrl.experiment.getTextsWithFeatures();
            }
        }]
}); 