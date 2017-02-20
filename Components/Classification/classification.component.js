jTextMinerApp.component('classification', {
    templateUrl: 'Components/Classification/classification.component.html',
    controller: ['$scope', 'ExperimentService', 'APIService', 'ClassificationService', 'InProgressService', 'ClassService', 'SaveClassInterface', 'SelectClassService', '$sce', 'ngDialog', '$q', function ($scope, ExperimentService, APIService, ClassificationService, InProgressService, ClassService, SaveClassInterface, SelectClassService, $sce, ngDialog, $q) {
        var ctrl = this;
        ctrl.experiment = ClassificationService.newExperiment();
        $scope.showInProcess = InProgressService.isReady != 1;
        $scope.$on('isReady_Updated', function () {
            $scope.showInProcess = InProgressService.isReady != 1;
        });
        $scope.countFilesPerClass = [];

        $scope.colors = ClassService.colors;
        $scope.indexOfColor = function (val) {
            var l = $scope.classes.length;
            for (k = 0; k < l; k = k + 1) {
                if (angular.equals($scope.classes[k].title, val)) {
                    return $scope.colors[k];
                }
            }
            return "Grey";
        }

        $scope.classNameToColor = ClassService.classNameToColor;

        // someone pressed the "Add Class" button, so show the dialog
        $scope.ContinueToAddClass = function (actionMode) {
            ngDialog.openConfirm({
                template: '<choose-text-dialog ' +
                'on-confirm="confirm(); ngDialogData.saveClass(selectionData);" ' +
                'on-cancel="closeThisDialog()" ' +
                'class-name="ngDialogData.className"' +
                'save-message="\'Save Class\'"' +
                'naming-message="\'Name this class (optional)\'">' +
                '</choose-text-dialog>',
                plain: true,
                className: 'ngdialog-theme-default',
                data: {
                    className: ctrl.experiment.classes.newClassName,
                    saveClass: $scope.saveClass
                }
            });
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
                .then(function (response2) {
                    $scope.testSetResults = response2[0];
                    $scope.testSetChunks = [];
                    for (var testFileIndex=0; testFileIndex < $scope.testSetResults.length; testFileIndex++) {
                        setSelectedTestFile($scope.testSetResults[testFileIndex], testFileIndex);
                    }
                });
        };

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

            InProgressService.updateIsReady(0);

                InProgressService.updateIsReady(1);
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
                        .map(feature => ClassService.classIndexToColor(feature.maxClassIndex));
                    pieces.push("<span "
                        + ( colors.length > 0 ? "style='font-weight: bold; color: " + colors[0] + "'" : "")
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

        $scope.createThumbnail = function (chunk) {
            if (chunk == null)
                return "";
            var dotsNail = "";
            for (i = 0; i < chunk.length / 200; i = i + 1) {
                dotsNail += ". ";
            }
            return $sce.trustAsHtml(dotsNail);
        };

        $scope.scrollTo = function (index) {
            window.scrollTo(0, $("#section" + index)[0].offsetTop - 100);
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
    }]
});
