jTextMinerApp.factory('SaveClassInterface', function ($rootScope, BrowseClassService, SelectClassService, ClassService, ExperimentService, UserService) {
    var classData = {
        getInstance() {
            return {
                // most of these are unused, but are needed for API calls
                testSetActionMode: ClassService.ExperimentTestSetActionMode,
                actionMode: ClassService.ExperimentActionMode,
                browse_ClassName: ClassService.ClassName,
                select_ClassName: ClassService.ClassName,
                browse_ChunkMode: BrowseClassService.Browse_ChunkMode,
                browse_MinimumChunkSize: BrowseClassService.Browse_MinimumChunkSize,
                totalNumberOfWords: BrowseClassService.LastClassTotalNumberOfWords,
                browse_FileName: BrowseClassService.Browse_FileName,
                select_NumberOfChapters: SelectClassService.Select_NumberOfChapters,
                select_NumberOfWords: SelectClassService.Select_NumberOfWords,
                select_ChunkMode: SelectClassService.Select_ChunkMode,
                select_MinimumChunkSize: SelectClassService.Select_MinimumChunkSize,
                select_ChunkSize: SelectClassService.Select_ChunkSize,
                select_RootKeys: SelectClassService.lastTestSetSelectedRootKeys,
                activeKey: '',
                userLogin: UserService.user,
                expType: 'Classification',
                expName: ExperimentService.newExperiment().experimentName
            }
        }
    };
    return classData;
});