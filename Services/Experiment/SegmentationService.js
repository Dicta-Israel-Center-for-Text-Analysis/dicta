jTextMinerApp.factory('SegmentationService', function ($rootScope, FeatureCollectionFactory, ClassService, ExperimentService, UserService, SelectClassService, APIService) {
    var root = {
        newExperiment () {
            var segmentationExperiment = {
                Segmentation_ActionMode: 'SelectOnlineCorpus',
                Segmentation_ChunkBy: 'NumberOfSentence',
                Segmentation_SplitString: '',
                Segmentation_NumberOfSentencePerChunk: 30,
                Segmentation_SimilarityType: 'Cosine',
                Segmentation_NumberOfClusters: 2,
                Segmentation_CoreDocs: 80,
                Segmentation_NumberOfWordsInFeatureSet: 5,
                Segmentation_NumberOfSentencesLockedIn: 25,
                resultData: [],
                inProgress: false,
                base: ExperimentService.newExperiment()
            };
            // the default feature set for segmentation is different than for other experiments
            segmentationExperiment.featureCollection = FeatureCollectionFactory.newCollection();
            angular.extend(segmentationExperiment.featureCollection.Feature_sets[0],
                {
                    tokenized: true,
                    filterCount: 500,
                    normalizerType: "Binary"
                });

            segmentationExperiment.updateSegmentation_ActionModeValue = function () {
                segmentationExperiment.Segmentation_ActionMode = 'SelectOnlineCorpus'; // used to use ClassService.ExperimentTestSetActionMode, but it never changed;
                if (SelectClassService.testText.keys.every(
                    key => /^\/Dicta Corpus\/Tanakh\/(Torah|Prophets|Writings)/.test(key)
                ))
                    segmentationExperiment.Segmentation_ChunkBy = 'BibleChapter';
                else
                    segmentationExperiment.Segmentation_ChunkBy = 'NumberOfSentence';
            };

            segmentationExperiment.createRequest = function (data) {
                return angular.extend(data, {
                    // userLogin: UserService.user,
                    // expType: 'Segmentation',
                    // expName: 'Untitled',
                    featureSets: this.featureCollection.Feature_sets,
                    segmentationActionMode: this.Segmentation_ActionMode,
                    segmentationChunkBy: this.Segmentation_ChunkBy
                });
            }

            segmentationExperiment.createDataForExtract = function () {
                var dataExtract = segmentationExperiment.createRequest({
                    corpusClasses: [],
                    featuresData: {},
                    select_RootKeys: SelectClassService.testText.keys,
                });
                segmentationExperiment.inProgress = true;
                return dataExtract;
            };

            segmentationExperiment.createDataForRun = function () {
                var dataRun = segmentationExperiment.createRequest({
                    selectedAlgorithmTypeId: this.base.selectedAlgorithmTypeId,
                    selectedAlgorithmTypeName: this.base.selectedAlgorithmTypeName,
                    selectedAlgorithmTypeAttributes: this.base.selectedAlgorithmTypeAttributes,
                    featuresData: {},
                    segmentationSplitString: this.Segmentation_SplitString,
                    segmentationNumberOfSentencePerChunk: this.Segmentation_NumberOfSentencePerChunk,
                    segmentationSimilarityType: this.Segmentation_SimilarityType,
                    segmentationNumberOfClusters: this.Segmentation_NumberOfClusters,
                    segmentationCoreDocs: this.Segmentation_CoreDocs,
                    segmentationNumberOfWordsInFeatureSet: this.Segmentation_NumberOfWordsInFeatureSet,
                    segmentationNumberOfSentencesLockedIn: this.Segmentation_NumberOfSentencesLockedIn,
                });
                return dataRun;
            };

            segmentationExperiment.isAllBibleSegmentation = true;

            segmentationExperiment.RunExperiment = function () {
                SelectClassService.testText.keys.forEach(function (key) {
                    if (!(key.startsWith('/Dicta Corpus/Bible/') || key.startsWith('/Dicta Corpus/Tanakh/'))) {
                        segmentationExperiment.isAllBibleSegmentation = false;
                    }
                });
                segmentationExperiment.inProgress = true;

                segmentationExperiment.updateSegmentation_ActionModeValue();
                
                var tmp = segmentationExperiment.createDataForRun();
                tmp.extractData = segmentationExperiment.createDataForExtract();
                return APIService.call('JTextMinerAPI/RunSegmentation', tmp)
                    .then( function (response) {
                        segmentationExperiment.inProgress = false;
                        var results = response.data;
                        segmentationExperiment.resultData = results;
                        segmentationExperiment.featuresData = results.featuresData;
                        segmentationExperiment.featureCollection.updateFeaturesData(results.featuresData);
                    });
            };

            return segmentationExperiment;
        }
    };

    return root;
});