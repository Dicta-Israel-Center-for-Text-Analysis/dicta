/**
 * @ngdoc service
 * @name JTextMinerApp:UserService
 *
 * @description
 *
 *
 * */
angular.module('JTextMinerApp')
    .factory('UserService', ['APIService', '$q', function(APIService, $q){

    var Service = {
        $user: null,
        $loginDeferral: $q.defer(),
        tryLogin (username, isBibleUser) {
            this.$isBibleUser = true == isBibleUser;
            APIService.call('UserService/Login', {
                username
            })
                .then(response => {
                    if (response.data.success) {
                        Service.$loginDeferral.resolve();
                        Service.$userToken = response.data.data;
                    }
                });
            var triedLogin = APIService.call('JTextMinerAPI/CheckUserLogin', { userLogin: username })
                .then(handleLoginAPIResponse);
            triedLogin.catch(handleLoginAPIError);
            return triedLogin;
        },
        logout() {
            this.$user = null;
            $.removeCookie('userLogin');
        },
        isLoggedIn() {
            return this.$user != null;
        },
        get user() {
            return this.$user;
        },
        get userToken() {
            return this.$userToken;
        },
        get isBibleUser() {
            return this.$isBibleUser;
        },
        get loginPromise() {
            return this.$loginDeferral.promise;
        }
    };

    function handleLoginAPIResponse(response){
        var login = response.data.userLogin;
        if (login != "") {
            Service.$user = login;
            if (login != 'testuser')
                $.cookie('userLogin', login);
        }
        else
            throw "Login error.";
    }

    function handleLoginAPIError(response) {
        Service.$user = null;
    }

    return Service;
}]);
