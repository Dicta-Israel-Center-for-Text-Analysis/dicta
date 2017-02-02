jTextMinerApp.factory('SegmentationService', function ($rootScope, FeatureCollectionFactory, ClassService, ExperimentService, UserService, SelectClassService, InProgressService, APIService) {
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
                base: ExperimentService.newExperiment()
            };
            // the default feature set for segmentation is different than for other experiments
            segmentationExperiment.featureCollection = FeatureCollectionFactory.newCollection();
            segmentationExperiment.featureCollection.Feature_sets[0].vocalized = true;
            segmentationExperiment.featureCollection.Feature_sets[0].tokenized = true;

            segmentationExperiment.updateSegmentation_ActionModeValue = function () {
                segmentationExperiment.Segmentation_ActionMode = 'SelectOnlineCorpus'; // used to use ClassService.ExperimentTestSetActionMode, but it never changed;
                if (angular.equals(segmentationExperiment.Segmentation_ActionMode, 'SelectOnlineCorpus'))
                    segmentationExperiment.Segmentation_ChunkBy = 'BibleChapter';
                else
                    segmentationExperiment.Segmentation_ChunkBy = 'NumberOfSentence';
            };

            segmentationExperiment.createRequest = function (data) {
                return angular.extend(data, {
                    userLogin: UserService.user,
                    expType: 'Segmentation',
                    expName: 'name',
                    featureSets: this.featureCollection.Feature_sets,
                    segmentationActionMode: this.Segmentation_ActionMode,
                    segmentationChunkBy: this.Segmentation_ChunkBy
                });
            }

            segmentationExperiment.createDataForExtract = function () {
                segmentationExperiment.updateSegmentation_ActionModeValue();
                var dataExtract = segmentationExperiment.createRequest({
                    corpusClasses: [],
                    featuresData: {},
                    select_RootKeys: SelectClassService.testText.keys,
                });
                InProgressService.updateIsReady(0);
                return dataExtract;
            };

            segmentationExperiment.createDataForRun = function () {
                var dataRun = segmentationExperiment.createRequest({
                    selectedAlgorithmTypeId: this.base.selectedAlgorithmTypeId,
                    selectedAlgorithmTypeName: this.base.selectedAlgorithmTypeName,
                    selectedAlgorithmTypeAttributes: this.base.selectedAlgorithmTypeAttributes,
                    featuresData: this.featureCollection.featuresData,
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
                InProgressService.updateIsReady(0);

                return APIService.call('JTextMinerAPI/ExtractFeaturesSegmentation', segmentationExperiment.createDataForExtract())
                    .then(function () {
                        InProgressService.updateIsReady(0);
                        return APIService.call('JTextMinerAPI/RunSegmentation', segmentationExperiment.createDataForRun())
                    })
                    .then( function (response) {
                        InProgressService.updateIsReady(1);
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