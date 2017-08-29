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
    const service = {
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
            return getSelectionList(SAVED_SELECTIONS);
        },
        get recentSelections() {
            return getSelectionList(RECENT_SELECTIONS);
        },
        saveSelection,
        addRecentSelection,
    };
    const SAVED_SELECTIONS = '$savedSelections';
    const RECENT_SELECTIONS = '$recentSelections';
    
    function saveSelection(selection) {
        addToSelectionList(selection, SAVED_SELECTIONS);
    }

    function addRecentSelection(selection) {
        addToSelectionList(selection, RECENT_SELECTIONS, 10);
    }

    function addToSelectionList(selection, listName, limit) {
        if (!service.hasOwnProperty(listName))
            service[listName] = get(listName, []);
        service[listName].unshift(selection);
        if (limit && service[listName].length > limit)
            service[listName].pop();
        store(listName, service[listName]);
    }

    function getSelectionList(listName) {
        if (!service.hasOwnProperty(listName))
            service[listName] = get(listName, []);
        return service[listName];
    }

    function store(name, object) {
        window.sessionStorage.setItem(name, JSON.stringify(object));
    }

    function get(name, defaultVal) {
        const stored = window.sessionStorage.getItem(name);
        if (stored === null)
            return defaultVal;
        return JSON.parse(stored);
    }

    function tryLogin (username, isBibleUser) {
        this.$isBibleUser = !!isBibleUser;
        APIService.call('UserService/Login', {
            username
        })
            .then(response => {
                if (response.data.success) {
                    service.$loginDeferral.resolve();
                    service.$userToken = response.data.data;
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
            service.$user = login;
            if (login !== 'testuser')
                $.cookie('userLogin', login);
            window.sessionStorage.setItem('userLoginData', JSON.stringify({
                $user: service.$user,
                $userToken: service.$userToken,
                $isBibleUser: service.$isBibleUser
            }));
        }
        else
            throw "Login error.";
    }

    function handleLoginAPIError(response) {
        service.$user = null;
    }

    const storedLoginData = window.sessionStorage.getItem('userLoginData');
    if (storedLoginData) {
        const parsedData = JSON.parse(storedLoginData);
        service.$user = parsedData.$user;
        service.$userToken = parsedData.$userToken;
        service.$isBibleUser = parsedData.$isBibleUser;
        service.$loginDeferral.resolve();
    }

    return service;
}]);