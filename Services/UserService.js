/**
 * @ngdoc service
 * @name JTextMinerApp:UserService
 *
 * @description
 *
 *
 * */
angular.module('JTextMinerApp')
    .factory('UserService', ['APIService', function(APIService){

    var Service = {
        $user: null,
        tryLogin (username) {
            var triedLogin = APIService.call('CheckUserLogin', { userLogin: username })
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
        }
    };

    function handleLoginAPIResponse(response){
        var login = response.data.userLogin;
        if (login != "") {
            Service.$user = login;
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
