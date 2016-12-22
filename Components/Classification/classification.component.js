jTextMinerApp.component('classification', {
    templateUrl: 'Components/Classification/classification.component.html',
    controller: ['$scope', '$rootScope', 'ExperimentService', 'APIService', 'ClassificationService', 'InProgressService', 'ClassService', 'SaveClassInterface', 'SelectClassService', '$sce', 'ngDialog', 'BrowseClassService', 'UserService', function ($scope, $rootScope, ExperimentService, APIService, ClassificationService, InProgressService, ClassService, SaveClassInterface, SelectClassService, $sce, ngDialog, BrowseClassService, UserService) {
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

            $rootScope.$broadcast('lastSelectedRootKeys', []);

            ClassService.ClassName = 'Class ' + ClassService.Corpus_maxId;

            ngDialog.openConfirm({
                template: '<add-class-dialog ' +
                'on-confirm="confirm(); ngDialogData.saveClass();" ' +
                'on-cancel="closeThisDialog()" ' +
                'class-object="ngDialogData.classObject">' +
                '</add-class-dialog>',
                plain: true,
                className: 'ngdialog-theme-default',
                data: {
                    classObject: ClassService,
                    saveClass: $scope.saveClass
                }
            });

            ClassService.updateExperimentActionMode(actionMode);
            //$scope.Next();
        };

        $scope.fixmeCounter = 1;
        $scope.saveClass = function () {
            // workaround for server bug - force names to be sorted correctly
            var prefix = $scope.fixmeCounter++; //"ABCDEFGHIJKLMNOPQRSTUVWXYZ".substr($scope.fixmeCounter++, 1);
            ClassService.ClassName = prefix + " - " + ClassService.ClassName;
            var classData = SaveClassInterface.getInstance();

            if (angular.equals(classData.actionMode, 'BrowseThisComputer')) {
                classData.totalNumberOfWords = BrowseClassService.LastClassTotalNumberOfWords;
                InProgressService.updateIsReady(0);
                APIService.apiRun({ crud: 'TrainClass' }, classData, function (response) {
                    InProgressService.updateIsReady(1);
                    var results = response;
                    $scope.addClass(results.browse_ClassName, results.selectedText, results.browse_ChunkMode, results.browse_MinimumChunkSize, results.numberOfChunks, results.totalNumberOfWords, false);

                });
            }
            else if (angular.equals(classData.actionMode, 'SelectOnlineCorpus')) {
                InProgressService.updateIsReady(0);
                classData.select_RootKeys = SelectClassService.lastSelectedRootKeys;
                APIService.apiRun({ crud: 'TrainClass' }, classData, function (response) {
                    InProgressService.updateIsReady(1);
                    var results = response;
                    $scope.addClass(results.select_ClassName, results.selectedText, 'By chapter', '', results.numberOfChunks, results.totalNumberOfWords, true);

                });
            }
        };

        $scope.classes = ClassService.Corpus_classes;
        $scope.$on('Corpus_classesValueUpdated', function () {
            $scope.classes = ClassService.Corpus_classes;
        });

        ctrl.clearOldResults = function () {
            $scope.testSetChunks = [];
        };

        $scope.addClass = function (newItemName, text, mode, size, number, total, is_Bible) {
            ClassService.updateIsAllBibleValue(ClassService.isAllBible && is_Bible);
            ctrl.experiment.featureCollection.updateFeaturesData({});
            ClassService.Corpus_maxId += 1;
            ClassService.pushCorpus_classes({
                id: ClassService.Corpus_maxId,
                title: newItemName,
                selectedText: text,
                chunkMode: mode,
                chunkSize: size,
                numberOfChunks: number,
                totalNumberOfWords: total,
                bible: is_Bible
            });
        };

        $scope.runClassification = function () {
            $scope.countFilesPerClass = [];
            $scope.testSetChunks = [];

            ctrl.experiment.runClassification()
                .then(function (response2) {
                    $scope.testSetResults = response2;
                    $scope.testSetChunks = [];
                    for (var testFileIndex in $scope.testSetResults) {
                        $scope.setSelectedTestFile($scope.testSetResults[testFileIndex], testFileIndex);
                    }
                });
        };

        function updateTestSetChunks() {
            $scope.testSetResults = ctrl.experiment.base.tsResultData.testSetResults;
            $scope.testSetChunks = [];
            for (testFileIndex in $scope.testSetResults) {
                $scope.testSetChunks.push($scope.testSetResults[testFileIndex]);
            }
            if ($scope.testSetChunks.length > 0) {
                $scope.data = {};
                $scope.data.userLogin = UserService.user;
                $scope.data.index = 0;
                $scope.currentIndex = 0;
                APIService.apiRun({ crud: 'TestFileData' }, $scope.data, function (response) {
                    InProgressService.updateIsReady(1);
                    var results = response;
                    $scope.legend = $sce.trustAsHtml(results.legend);
                });
            }
        }
        updateTestSetChunks();

        $scope.numberOfAppearancesInDoc = function (item) {
            return (item.numberOfAppearancesInDoc > 0);
        };


        $scope.test_predicate = 'orderByClass';

        $scope.testSetChunks = [];
        for (testFileIndex in $scope.testSetResults) {
            $scope.testSetChunks.push($scope.testSetResults[testFileIndex]);
        }
        if ($scope.testSetChunks.length > 0) {
            $scope.data = {};
            $scope.data.userLogin = UserService.user;
            $scope.data.index = 0;
            $scope.currentIndex = 0;
            APIService.apiRun({ crud: 'TestFileData' }, $scope.data, function (response) {
                InProgressService.updateIsReady(1);
                var results = response;
                $scope.legend = $sce.trustAsHtml(results.legend);
            });
        }

        function cleanTitle(name){
            var trimmed = name.replace(/.rtf$/,'');
            // there's not going to be anything left if this is the only key
            if (trimmed.length == SelectClassService.testSetTitlesCommonPrefix.length) {
                return trimmed.substring(trimmed.lastIndexOf('_') + 1);
            }
            else {
                return trimmed.substring((SelectClassService.testSetTitlesCommonPrefix.length + 1));
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

        $scope.setSelectedTestFile = function (item, index) {

            InProgressService.updateIsReady(0);

            $scope.data = {};
            $scope.data.userLogin = UserService.user;
            $scope.data.index = item.index;
            $scope.currentIndex = item.index;
            var featureTypeMap = {
                "Word":"WORDS",
                "Letter":"LETTERS",
                "Morphology":"MORPHOLOGY",
                "SyntaxClause":"SYNTAX_CLAUSE_TYPES",
                "SyntaxPhrase":"SYNTAX_PHRASE_SEQUENCES"
            };
            var nGramMap = {
                "Unigram": 1,
                "Bigram": 2,
                "Trigram": 3
            };

            var filter = function() {
                var featureSet = ctrl.experiment.featureCollection.Feature_sets[0];
                if (featureSet.tokenizerType == "Word" || featureSet.tokenizerType == "Letter") {
                    return "TEXT_ONLY";
                }
                if (featureSet.tokenizerType == "Morphology") {
                    return featureSet.includeLexeme ? "" : "(?<=@)[^#]+";
                }
                if (featureSet.tokenizerType == "SyntaxPhrase" && featureSet.spoOnly) {
                    return "SUBJECT_PREDICATE_OBJECT";
                }
                return "";
                // filter = featureSet.
                //     includeLexeme: false,
                //     spoOnly: false,
                //     vocalized: true,
                //     sinDot: false,
                //     tokenized: false,
                //     includeNumber: false,
                //     includePunctuation: false
            }();
            var featuresRequest = {
                "key":
                {
                    "keyType": "DICTA_CORPUS",
                    "key": item.name.replace(/.rtf$/,'').replace(/_/g,'/')
                }
                ,
                "chunkType": "LARGE",
                "featureSettings": {
                    "type": featureTypeMap[ctrl.experiment.featureCollection.Feature_sets[0].tokenizerType],
                    "filter": filter,
                    "nGram": nGramMap[ctrl.experiment.featureCollection.Feature_sets[0].featureType]
                }
            };
            var textRequest = {
                "keys": [
                    {
                        "keyType": "DICTA_CORPUS",
                        "key": item.name.replace(/.rtf$/,'').replace(/_/g,'/')
                    }
                ],
                "chunkType": "LARGE"
            };
            var featuresList;
            APIService.apiRun({ crud: 'TestFileData' }, $scope.data, function (response) {
                InProgressService.updateIsReady(1);
                var results = response;
                //item.htmlText = prettyPrintMorphologyClassification(results.htmlText);
                item.featureList = results.features;
                item.title = cleanTitle(item.name);
                $scope.testSetChunks[index] = item;
                $scope.legend = $sce.trustAsHtml(results.legend);

                if ($scope.testSetChunks.length == $scope.testSetResults.length)
                {
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
            }).$promise.then(
                x =>
                    APIService.call("TextFeatures/ListFeatures", featuresRequest)
                        .then(function(response) {
                            featuresList = response.data[0].features;
                        })
                        .then(() =>
                            APIService.call("TextFeatures/GetText", textRequest)
                                .then(function(response) {
                                    var words = response.data[0].text.split(' ');
                                    var currentOffset = 0;
                                    var pieces = [];
                                    function hack(name) {
                                        if (ctrl.experiment.featureCollection.Feature_sets[0].tokenizerType == "SyntaxPhrase"
                                            || ctrl.experiment.featureCollection.Feature_sets[0].tokenizerType == "SyntaxClause")
                                            return prettyPrintMorphology(name);
                                        else
                                            return name;
                                    }
                                    for (var word of words){
                                        var wordFeatures = featuresList
                                            .filter(feature => feature.textStart < currentOffset + word.length
                                            && currentOffset <= feature.textStart + feature.textLength );
                                        var hoverText =
                                            wordFeatures.map(feature => feature.name)
                                                .join(' ');
                                        if (hoverText.length > 0) {
                                            var blah = false;
                                            var colors = item.featureList
                                                .filter(feature => wordFeatures
                                                    .some(wordFeature => hack(wordFeature.name) == feature.name))
                                                .map(feature => ClassService.classIndexToColor(feature.maxClassIndex));
                                            if (colors.length > 0) blah = true;
                                            pieces.push("<span " + ( blah ? "style='font-weight: bold; color: "+ colors[0] +"'" :"")+"title='"+ prettyPrintMorphology(hoverText) +"'>" + word +"</span>")
                                        }
                                        else
                                            pieces.push(word);
                                        currentOffset += word.length + 1;
                                    }
                                    var html = pieces.join(' ');
                                    item.htmlText = html;
                                })));

        };
        $scope.tab = '1';

        $scope.updateAlgorithm = function (algorithmSettings) {
            ctrl.experiment.updateselectedAlgorithmTypeValue(algorithmSettings.id, algorithmSettings.name, algorithmSettings.attributes)
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
                className: 'ngdialog-theme-plain',
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
                data: { cvResultData: ctrl.experiment.base.cvResultData },
                closeByEscape: true,
                closeByDocument: true,
                className: 'ngdialog-theme-default override-background'
            });
        };

        $scope.OpenViewAllFeatures = function () {
            ctrl.experiment.prepareClassification().then(
                function(){
                    ngDialog.openConfirm({
                        template: '<view-all-features-dialog features="ngDialogData.features" on-confirm="confirm()"></view-all-features-dialog>',
                        plain: true,
                        data: {
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
