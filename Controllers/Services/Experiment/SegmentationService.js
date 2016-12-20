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
                experiment: ExperimentService.newExperiment()
            };
            // the default feature set for segmentation is different than for other experiments
            segmentationExperiment.featureCollection = FeatureCollectionFactory.newCollection();
            segmentationExperiment.featureCollection.Feature_sets[0].vocalized = true;
            segmentationExperiment.featureCollection.Feature_sets[0].tokenized = true;

            segmentationExperiment.updateSegmentation_ActionModeValue = function () {
                segmentationExperiment.Segmentation_ActionMode = ClassService.ExperimentTestSetActionMode;
                if (angular.equals(segmentationExperiment.Segmentation_ActionMode, 'SelectOnlineCorpus'))
                    segmentationExperiment.Segmentation_ChunkBy = 'BibleChapter';
                else
                    segmentationExperiment.Segmentation_ChunkBy = 'NumberOfSentence';
            };

            segmentationExperiment.createDataForExtract = function () {
                segmentationExperiment.updateSegmentation_ActionModeValue();
                var dataExtract = {
                    userLogin: UserService.user,
                    expType: 'Segmentation',
                    expName: 'name',
                    featureSets: this.featureCollection.Feature_sets,
                    corpusClasses: ClassService.Corpus_classes,
                    featuresData: {},
                    segmentationActionMode: this.Segmentation_ActionMode,
                    segmentationChunkBy: this.Segmentation_ChunkBy,
                    select_RootKeys: SelectClassService.lastTestSetSelectedRootKeys,
                };
                InProgressService.updateIsReady(0);
                return dataExtract;
            };

            segmentationExperiment.createDataForRun = function () {
                var dataRun = {
                    userLogin: UserService.user,
                    expType: 'Segmentation',
                    expName: 'name',
                    selectedAlgorithmTypeId: this.experiment.selectedAlgorithmTypeId,
                    selectedAlgorithmTypeName: this.experiment.selectedAlgorithmTypeName,
                    selectedAlgorithmTypeAttributes: this.experiment.selectedAlgorithmTypeAttributes,
                    featureSets: this.featureCollection.Feature_sets,
                    featuresData: this.featureCollection.featuresData,
                    segmentationActionMode: this.Segmentation_ActionMode,
                    segmentationChunkBy: this.Segmentation_ChunkBy,
                    segmentationSplitString: this.Segmentation_SplitString,
                    segmentationNumberOfSentencePerChunk: this.Segmentation_NumberOfSentencePerChunk,
                    segmentationSimilarityType: this.Segmentation_SimilarityType,
                    segmentationNumberOfClusters: this.Segmentation_NumberOfClusters,
                    segmentationCoreDocs: this.Segmentation_CoreDocs,
                    segmentationNumberOfWordsInFeatureSet: this.Segmentation_NumberOfWordsInFeatureSet,
                    segmentationNumberOfSentencesLockedIn: this.Segmentation_NumberOfSentencesLockedIn,
                };
                return dataRun;
            };

            segmentationExperiment.isAllBibleSegmentation = true;

            segmentationExperiment.RunExperiment = function () {
                SelectClassService.lastTestSetSelectedRootKeys.forEach(function (key) {
                    if (!key.startsWith('/Dicta Corpus/Bible/')) {
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