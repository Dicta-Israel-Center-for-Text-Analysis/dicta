//http://stackoverflow.com/questions/14833326/how-to-set-focus-on-input-field
jTextMinerApp.factory('focus', function ($rootScope, $timeout) {
    return function (name) {
        $timeout(function () {
            $rootScope.$broadcast('focusOn', name);
        });
    }
});

jTextMinerApp.service('fileUpload', ['APIService', 'InProgressService', 'UserService', function (APIService, InProgressService, UserService) {
    this.upload = function(file) {
        var fd = new FormData();
        fd.append('uploadFile', file);
        fd.append('userToken', UserService.userToken);
        return APIService.call("UserService/UploadFile", fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        })
            .then (response => response.data.data);
    };
    
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
        return APIService.call(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        })
        .then(function (response) {
            // this is an array of word counts
            return response.data;
        })
        .catch(function () {
            InProgressService.updateIsReady(-1);
        });
    }
}]);
