jTextMinerApp.factory('SaveClassInterface', function (UserService) {
    var classData = {
        getInstance(settings){
            return {
                // most of these are unused, but are needed for API calls
                testSetActionMode: settings['testSet'] ? settings.text.mode : 'SelectOnlineCorpus',
                actionMode: settings.text.mode,
                browse_ClassName: settings.className,
                select_ClassName: settings.className,
                browse_ChunkMode: settings.text.mode == 'BrowseThisComputer' ? settings.text.chunkMode : 'DoNotChunk',
                browse_MinimumChunkSize: settings.text.mode == 'BrowseThisComputer' ? settings.text.chunkSize : 250,
                totalNumberOfWords: 0,
                browse_FileName: settings.text.mode == 'BrowseThisComputer' ? settings.text.filename : '',
                // compatibility: unused members
                select_NumberOfChapters: 0,
                select_NumberOfWords: 0,
                select_ChunkMode: 'DoNotChunk',
                select_MinimumChunkSize: 250,
                select_ChunkSize: 0,
                select_RootKeys: settings.text.mode == 'SelectOnlineCorpus' ? settings.text.keys : [],
                activeKey: '',
                userLogin: UserService.user,
                expType: settings.expType ? settings.expType : 'Classification',
                expName: settings.experimentName
            }
        }
    };
    return classData;
});