jTextMinerApp.component('classification', {
    templateUrl: 'Components/Classification/classification.component.html',
    controller: function ($scope, ExperimentService, APIService, ClassificationService, ClassService, SaveClassInterface, SelectClassService, $sce, DialogService, $q, StateService) {
        var ctrl = this;
        ctrl.experiment = StateService.getOrCreate('classificationExperiment', () => ClassificationService.newExperiment());
        ctrl.showInProcess = false;
        $scope.countFilesPerClass = [];

        $scope.colors = ClassService.colors;
        $scope.indexOfColor = function (val) {
            var l = ctrl.experiment.classes.Corpus_classes.length;
            for (k = 0; k < l; k = k + 1) {
                if (angular.equals(ctrl.experiment.classes.Corpus_classes[k].title, val)) {
                    return "class-bg-color-" + k;
                }
            }
            return "Grey";
        };
        ctrl.indexOfClass = function (className) {
            return _.findIndex(ctrl.experiment.classes.Corpus_classes, classData => classData.title === className)
        };

        $scope.classNameToColor = ClassService.classNameToColor;

        // someone pressed the "Add Class" button, so show the dialog
        $scope.ContinueToAddClass = function (actionMode) {
            DialogService.openDialog('chooseTextDialog', {
                className: ctrl.experiment.classes.newClassName,
                saveMessage: 'Save Class',
                namingMessage: 'Name this class (optional)'
            })
                .then($scope.saveClass);
        };

        $scope.saveClass = function (selectionData) {
            ctrl.experiment.saveClass(selectionData);
        };

        $scope.classes = this.experiment.classes.Corpus_classes;

        ctrl.clearOldResults = function () {
            $scope.testSetChunks = [];
        };

        $scope.runClassification = function () {
            $scope.countFilesPerClass = [];
            $scope.testSetChunks = [];

            var classification = ctrl.experiment.runClassification();
            var getTexts = ctrl.experiment.getTextsWithFeatures();

            return $q.all([classification, getTexts])
                .then(afterClassification);
        };

        function afterClassification(response2) {
            $scope.testSetResults = response2;
            $scope.testSetChunks = [];
            for (var testFileIndex=0; testFileIndex < $scope.testSetResults.length; testFileIndex++) {
                setSelectedTestFile($scope.testSetResults[testFileIndex], testFileIndex);
            }
            ctrl.chunkBarData = $scope.testSetChunks.map(chunk => ({
                color: $scope.indexOfColor(chunk.classifiedAs),
                text: chunk.htmlText,
                title: chunk.title
            }))
        }
        // HACK!!!
        function workaround (response) {
            return ctrl.experiment.getTextsWithFeatures()
                .then(() => afterClassification(response));
        }
        ctrl.experiment.registerListener(workaround);


        $scope.testSetResults = ctrl.experiment.tsResultData.testSetResults;
        $scope.testSetChunks = $scope.testSetResults;

        $scope.numberOfAppearancesInDoc = function (item) {
            return (item.numberOfAppearancesInDoc > 0);
        };

        $scope.test_predicate = 'orderByClass';

        function cleanTitle(name){
            // there's not going to be anything left if this is the only key
            if (SelectClassService.testSetTitlesCommonPrefix == ""
                || name.length == SelectClassService.testSetTitlesCommonPrefix.length) {
                return name.substring(name.lastIndexOf('/') + 1);
            }
            else {
                return name.substring((SelectClassService.testSetTitlesCommonPrefix.length + 1));
            }
        }

        function prettyPrintMorphologyClassification(html) {
            function prettyPrintWord(word) {
                return '[' + prettyPrintMorphology(word) + ']';
            }
            if (/@[^ #]*#BASEFORM/.test(html)) {
                return html.replace(/(@[^ #]*#[A-Z_0-9#]*)/g, prettyPrintWord);
            }
            return html;
        }

        function setSelectedTestFile (item, index) {
            //item.htmlText = prettyPrintMorphologyClassification(results.htmlText);
            item.title = cleanTitle(ctrl.experiment.testTexts[index].chunkKey);//cleanTitle(item.name);
            $scope.testSetChunks[index] = item;

            if ($scope.testSetChunks.length == $scope.testSetResults.length)
            {
                var classCounts = {};
                $scope.countFilesPerClass = [];
                for (currentClass in $scope.classes) {
                    var l = 0;
                    for (testFile in $scope.testSetChunks) {
                        if (angular.equals($scope.testSetChunks[testFile].classifiedAs, $scope.classes[currentClass].title))
                            l = l + 1;
                    }
                    $scope.countFilesPerClass.push(l);
                }
            }
            generateHighlightedText(item, index);
        }

        function generateHighlightedText(item, index) {
            var text = ctrl.experiment.testTexts[index];
            var featuresList = ctrl.experiment.testTextsFeatures[index].features;
            var words = text.text.split(' ');
            var currentOffset = 0;
            var pieces = [];

            function hack(name) {
                if (ctrl.experiment.featureCollection.Feature_sets[0].tokenizerType == "SyntaxPhrase"
                    || ctrl.experiment.featureCollection.Feature_sets[0].tokenizerType == "SyntaxClause")
                    return prettyPrintMorphology(name);
                else
                    return name;
            }

            for (var word of words) {
                var wordFeatures = featuresList
                    .filter(feature => feature.textStart < currentOffset + word.length
                    && currentOffset <= feature.textStart + feature.textLength);
                var hoverText =
                    wordFeatures.map(feature => feature.name)
                        .join(' ');
                if (hoverText.length > 0) {
                    var colors = item.featureList
                        .filter(feature => wordFeatures
                            .some(wordFeature => hack(wordFeature.name) == feature.name))
                        .map(feature => feature.maxClassIndex);
                    pieces.push("<span "
                        + ( colors.length > 0 ? "class='highlight-feature-color-" + colors[0] + "' " : "")
                        + "title='" + prettyPrintMorphology(hoverText) + "'>"
                        + word
                        + "</span>")
                }
                else
                    pieces.push(word);
                currentOffset += word.length + 1;
            }
            var html = pieces.join(' ');
            item.htmlText = html;
        }

        $scope.tab = '1';

        $scope.updateAlgorithm = function (algorithmSettings) {
            ctrl.experiment.base.updateSelectedAlgorithmTypeValue(algorithmSettings.id, algorithmSettings.name, algorithmSettings.attributes)
        }

        // advanced  - algorithms
        $scope.OpenSelectAlgorithm = function () {
            ngDialog.openConfirm({
                template: '<algorithm-dialog ' +
                'on-confirm="confirm()" ' +
                'on-discard="closeThisDialog()" ' +
                'selected-algorithm="selectedAlgorithmType" ' +
                'on-algorithm-change="updateAlgorithm(newAlgorithm)">' +
                '</algorithm-dialog>',
                plain: true,
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        };
        $scope.algorithms = ExperimentService.ALGORITHMS;
        $scope.selectedAlgorithmType = ExperimentService.ALGORITHMS[ctrl.experiment.base.selectedAlgorithmTypeId];
        $scope.selectedAlgorithmTypeName = ctrl.experiment.base.selectedAlgorithmTypeName;

        // feature dialog

        $scope.$watch('$ctrl.experiment.featureCollection.featuresData', function () {
            // any changes to the featuresData means that the old results are no longer valid
            if (Object.keys(ctrl.experiment.featureCollection.featuresData).length == 0) {
                ctrl.clearOldResults();
            }
        });

        $scope.OpenSelectFeatureSet = function () {
            ngDialog.openConfirm({
                template: '<edit-feature-set-dialog ' +
                'feature-collection="ngDialogData.featureCollection" ' +
                'class-object="$ctrl.experiment.classes"' +
                'on-confirm="confirm()" ' +
                'on-discard="closeThisDialog(\'button\')"' +
                'run-extract="$ctrl.experiment.prepareClassification()"></edit-feature-set-dialog>',
                plain: true,
                className: 'ngdialog-theme-default override-background',
                data: { featureCollection: ctrl.experiment.featureCollection },
                closeByEscape: true,
                closeByDocument: true,
                scope: $scope
            }).then(function (value) {
                tiberias_tour_pause();
            }, function (reason) {
                tiberias_tour_pause();
            });
        };

        $scope.convertFeatureName = function (featureName) {
            var converted = featureName;
            if (converted.indexOf('_') > -1) {
                converted = prettyPrintMorphology(converted);
            }
            return converted;
        }

        $scope.SaveExperiment = function () {
            ngDialog.openConfirm({
                template: '<save-as-dialog on-confirm="confirm()" on-cancel="closeThisDialog(\'button\')"></save-as-dialog>',
                plain: true,
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        }

        $scope.showCrossvalidation = function () {
            ngDialog.openConfirm({
                template: '<crossvalidation-table-dialog crossvalidation-results="ngDialogData.cvResultData" on-confirm="confirm()"></crossvalidation-table-dialog>',
                plain: true,
                data: { cvResultData: ctrl.experiment.cvResultData },
                closeByEscape: true,
                closeByDocument: true,
                className: 'ngdialog-theme-default override-background'
            });
        };

        $scope.OpenViewAllFeatures = function () {
            ctrl.experiment.prepareClassification().then(
                function(){
                    ngDialog.openConfirm({
                        template: '<view-all-features-dialog ' +
                        'classes="ngDialogData.classes" ' +
                        'features="ngDialogData.features" ' +
                        'on-confirm="confirm()"></view-all-features-dialog>',
                        plain: true,
                        data: {
                            classes: ctrl.experiment.classes.Corpus_classes,
                            features: ctrl.experiment.featureCollection.featuresData.features
                                .reduce((a, b) => a.concat(b), [])
                        },
                        closeByEscape: true,
                        closeByDocument: true,
                        className: 'ngdialog-theme-default override-background'
                    })}
            );
        }
    }
});
