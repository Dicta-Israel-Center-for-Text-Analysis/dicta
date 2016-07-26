
jTextMinerApp.factory('ParallelsService', function ($rootScope) {
    var root = {};

    root.chunks = [];
    root.updateChunks = function (items) {
        this.chunks = items;
        $rootScope.$broadcast("ParallelsUpdates");
    }
    root.groupNames = [];
    root.updategroupNames = function (items) {
        this.groupNames = items;
        $rootScope.$broadcast("ParallelsUpdates");
    }
    root.groups = [];
    root.updategroups = function (items) {
        this.groups = items;
        $rootScope.$broadcast("ParallelsUpdates");
    }
    root.numOfParallelsInGroups = [];
    root.updatenumOfParallelsInGroups = function (items) {
        this.numOfParallelsInGroups = items;
        $rootScope.$broadcast("ParallelsUpdates");
    }
    root.numOfParallels = 0;
    root.updatenumOfParallels = function (val) {
        this.numOfParallels = val;
        $rootScope.$broadcast("ParallelsUpdates");
    }
    root.parrallelsPerChunk = [];
    root.updateparrallelsPerChunk = function (val) {
        this.parrallelsPerChunk = val;
        $rootScope.$broadcast("ParallelsUpdates");
    }

    return root;
});