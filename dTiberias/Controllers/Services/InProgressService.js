jTextMinerApp.factory('InProgressService', function ($rootScope) {
    var root = {};

    root.isReady = 1;
    root.errorData = { error: false, errorText: "" };
    root.updateIsReady = function (value) {
        this.isReady = value;
        $rootScope.$broadcast("isReady_Updated");
    }

    root.setError = function (errorText) {
        root.updateIsReady(1);
        root.errorData.error = true;
        root.errorData.errorText = errorText == "" ? "Unknown Server Error" : errorText;
    }

    return root;
});