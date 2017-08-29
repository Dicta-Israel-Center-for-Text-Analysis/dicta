/**
 * @ngdoc service
 * @name JTextMinerApp:UserService
 *
 * @description
 *
 *
 * */
angular.module('JTextMinerApp')
    .factory('UserService', ['APIService', '$q', function(APIService, $q)
{
    const Service = {
        $user: null,
        $loginDeferral: $q.defer(),
        tryLogin,
        logout() {
            this.$user = null;
            $.removeCookie('userLogin');
        },
        isLoggedIn() {
            return !_.isNil(this.$user);
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
        },
        get savedSelections() {
            return
        },
        get recentSelections() {

        },
        saveSelection,
        addRecentSelection
    };
    function saveSelection(selection) {

    }
    function addRecentSelection(selection) {

    }

    function tryLogin (username, isBibleUser) {
        this.$isBibleUser = !!isBibleUser;
        APIService.call('UserService/Login', {
            username
        })
            .then(response => {
                if (response.data.success) {
                    Service.$loginDeferral.resolve();
                    Service.$userToken = response.data.data;
                }
            });
        const triedLogin = APIService.call('JTextMinerAPI/CheckUserLogin', { userLogin: username })
            .then(handleLoginAPIResponse);
        triedLogin.catch(handleLoginAPIError);
        return triedLogin;
    }

    function handleLoginAPIResponse(response){
        const login = response.data.userLogin;
        if (login !== "") {
            Service.$user = login;
            if (login !== 'testuser')
                $.cookie('userLogin', login);
            window.sessionStorage.setItem('userLoginData', JSON.stringify({
                $user: Service.$user,
                $userToken: Service.$userToken,
                $isBibleUser: Service.$isBibleUser
            }));
        }
        else
            throw "Login error.";
    }

    function handleLoginAPIError(response) {
        Service.$user = null;
    }

    const storedLoginData = window.sessionStorage.getItem('userLoginData');
    if (storedLoginData) {
        const parsedData = JSON.parse(storedLoginData);
        Service.$user = parsedData.$user;
        Service.$userToken = parsedData.$userToken;
        Service.$isBibleUser = parsedData.$isBibleUser;
        Service.$loginDeferral.resolve();
    }

    return Service;
}]);