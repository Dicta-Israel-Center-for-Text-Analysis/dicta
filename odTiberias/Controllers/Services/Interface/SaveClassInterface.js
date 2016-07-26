jTextMinerApp.factory('SaveClassInterface', function ($rootScope, BrowseClassService, SelectClassService, ClassService, ExperimentService) {
    var classData = {};

    classData.actionMode = ClassService.ExperimentActionMode;
    $rootScope.$on('ExperimentActionModeValuesUpdated', function () {
        classData.actionMode = ClassService.ExperimentActionMode;
    });
    classData.browse_ClassName = ClassService.ClassName;
    classData.select_ClassName = ClassService.ClassName;
    $rootScope.$on('ClassNameUpdated', function () {
        classData.browse_ClassName = ClassService.ClassName;
        classData.select_ClassName = ClassService.ClassName;
    });

    classData.browse_ChunkMode = BrowseClassService.Browse_ChunkMode;
    $rootScope.$on('Browse_ChunkModeUpdated', function () {
        classData.browse_ChunkMode = BrowseClassService.Browse_ChunkMode;
    });
    classData.browse_MinimumChunkSize = BrowseClassService.Browse_MinimumChunkSize;
    $rootScope.$on('Browse_MinimumChunkSizeUpdated', function () {
        classData.browse_MinimumChunkSize = BrowseClassService.Browse_MinimumChunkSize;
    });
    classData.totalNumberOfWords = BrowseClassService.LastClassTotalNumberOfWords;
    $rootScope.$on('LastClassTotalNumberOfWordsUpdated', function () {
        classData.totalNumberOfWords = BrowseClassService.LastClassTotalNumberOfWords;
    });
    classData.browse_FileName = BrowseClassService.Browse_FileName;
    $rootScope.$on('Browse_FileNameUpdated', function () {
        classData.browse_FileName = BrowseClassService.Browse_FileName;
    });


    classData.select_NumberOfChapters = SelectClassService.Select_NumberOfChapters;
    $rootScope.$on('Select_NumberOfChaptersUpdated', function () {
        classData.select_NumberOfChapters = SelectClassService.Select_NumberOfChapters;
    });
    classData.select_NumberOfWords = SelectClassService.Select_NumberOfWords;
    $rootScope.$on('Select_NumberOfWordsUpdated', function () {
        classData.select_NumberOfWords = SelectClassService.Select_NumberOfWords;
    });
    classData.select_ChunkMode = SelectClassService.Select_ChunkMode;
    $rootScope.$on('Select_ChunkModeUpdated', function () {
        classData.select_ChunkMode = SelectClassService.Select_ChunkMode;
    });
    classData.select_MinimumChunkSize = SelectClassService.Select_MinimumChunkSize;
    $rootScope.$on('Select_MinimumChunkSizeUpdated', function () {
        classData.select_MinimumChunkSize = SelectClassService.Select_MinimumChunkSize;
    });
    classData.select_ChunkSize = SelectClassService.Select_ChunkSize;
    $rootScope.$on('Select_ChunkSizeUpdated', function () {
        classData.select_ChunkSize = SelectClassService.Select_ChunkSize;
    });
    classData.select_RootKeys = SelectClassService.lastSelectedRootKeys;
    $rootScope.$on('lastSelectedRootKeysUpdated', function () {
        classData.select_RootKeys = SelectClassService.lastSelectedRootKeys;
    });
    classData.activeKey = '';
    

    classData.userLogin = ExperimentService.user;
    classData.expType = ExperimentService.ExperimentTypeModel;
    classData.expName = ExperimentService.ExperimentName;
    $rootScope.$on('valuesUpdated', function () {
        classData.userLogin = ExperimentService.user;
        classData.expType = ExperimentService.ExperimentTypeModel;
        classData.expName = ExperimentService.ExperimentName;
    });


    return classData;
});