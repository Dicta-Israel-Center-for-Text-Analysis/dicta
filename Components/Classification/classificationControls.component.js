jTextMinerApp.component('classificationControls',
{
    templateUrl: 'Components/Classification/classificationControls.component.html',
    controller:
        function(StateService, ClassificationService, DialogService, $scope, SelectClassService) {
            const ctrl = this;
            ctrl.experiment = StateService.getOrCreate('classificationExperiment', () => ClassificationService.newExperiment());
            ctrl.defineClass = function () {
                DialogService.openDialog('chooseTextDialog', { saveMessage: 'ANALYZE' })
                    .then(ctrl.saveClass)
                    .catch(ctrl.cancelClass);
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
        }
}); 