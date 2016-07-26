jTextMinerApp.factory('InProgressService', function ($rootScope) {
    var root = {};

    root.isReady = 1;
    root.updateIsReady = function (value) {
        this.isReady = value;
        $rootScope.$broadcast("isReady_Updated");
    }

    return root;
});