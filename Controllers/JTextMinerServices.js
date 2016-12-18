//http://stackoverflow.com/questions/14833326/how-to-set-focus-on-input-field
jTextMinerApp.factory('focus', function ($rootScope, $timeout) {
    return function (name) {
        $timeout(function () {
            $rootScope.$broadcast('focusOn', name);
        });
    }
});

jTextMinerApp.service('fileUpload', ['APIService', 'InProgressService', 'BrowseClassService', function (APIService, InProgressService, BrowseClassService) {
    this.uploadFileToUrl = function (file, argument_name, userLoginName) {
        var fd = new FormData();
        fd.append(argument_name, file);
        fd.append('userLogin', userLoginName);
        var uploadUrl;
        switch(argument_name) {
            case 'zipFile':
                uploadUrl = "JTextMinerAPI/uploadZipFile"; break;
            case 'txtFile':
                uploadUrl = "JTextMinerAPI/uploadTxtFile"; break;
            default:
                throw "Unknown upload type.";
        }
        APIService.call(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        })
        .success(function (data) {
            switch(argument_name) {
                case 'zipFile':
                    BrowseClassService.updateCountWordsForUploadedZipFile(data); break;
                case 'txtFile':
                    BrowseClassService.updateCountWordsForUploadedTxtFile(data); break;
            }
        })
        .error(function () {
            InProgressService.updateIsReady(-1);
        });
    }
}]);
