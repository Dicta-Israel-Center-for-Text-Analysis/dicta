jTextMinerApp.factory('SaveClassInterface', function ($rootScope, BrowseClassService, SelectClassService, ClassService, ExperimentService, ClassificationService, UserService) {
    var classData = {
        testSetActionMode: 'SelectOnlineCorpus',
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
        select_RootKeys: SelectClassService.lastSelectedRootKeys,
        activeKey: '',
        userLogin: UserService.user,
        expType: ExperimentService.ExperimentTypeModel,
        expName: ExperimentService.ExperimentName
};
    ClassificationService.SaveClassInterfaceFixMe = classData;

    $rootScope.$on('ExperimentTestSetActionModeValuesUpdated', function () {
        classData.testSetActionMode = ClassService.ExperimentTestSetActionMode;
    });
    $rootScope.$on('ExperimentActionModeValuesUpdated', function () {
        classData.actionMode = ClassService.ExperimentActionMode;
    });
    $rootScope.$on('ClassNameUpdated', function () {
        classData.browse_ClassName = ClassService.ClassName;
        classData.select_ClassName = ClassService.ClassName;
    });

    $rootScope.$on('Browse_ChunkModeUpdated', function () {
        classData.browse_ChunkMode = BrowseClassService.Browse_ChunkMode;
    });
    $rootScope.$on('Browse_MinimumChunkSizeUpdated', function () {
        classData.browse_MinimumChunkSize = BrowseClassService.Browse_MinimumChunkSize;
    });
    $rootScope.$on('LastClassTotalNumberOfWordsUpdated', function () {
        classData.totalNumberOfWords = BrowseClassService.LastClassTotalNumberOfWords;
    });
    $rootScope.$on('Browse_FileNameUpdated', function () {
        classData.browse_FileName = BrowseClassService.Browse_FileName;
    });


    $rootScope.$on('Select_NumberOfChaptersUpdated', function () {
        classData.select_NumberOfChapters = SelectClassService.Select_NumberOfChapters;
    });
    $rootScope.$on('Select_NumberOfWordsUpdated', function () {
        classData.select_NumberOfWords = SelectClassService.Select_NumberOfWords;
    });
    $rootScope.$on('Select_ChunkModeUpdated', function () {
        classData.select_ChunkMode = SelectClassService.Select_ChunkMode;
    });
    $rootScope.$on('Select_MinimumChunkSizeUpdated', function () {
        classData.select_MinimumChunkSize = SelectClassService.Select_MinimumChunkSize;
    });
    $rootScope.$on('Select_ChunkSizeUpdated', function () {
        classData.select_ChunkSize = SelectClassService.Select_ChunkSize;
    });
    $rootScope.$on('lastSelectedRootKeysUpdated', function () {
        classData.select_RootKeys = SelectClassService.lastSelectedRootKeys;
    });
    

    $rootScope.$on('valuesUpdated', function () {
        classData.userLogin = UserService.user;
        classData.expType = ExperimentService.ExperimentTypeModel;
        classData.expName = ExperimentService.ExperimentName;
    });


    return classData;
});