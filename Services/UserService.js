/**
 * @ngdoc service
 * @name JTextMinerApp:UserService
 *
 * @description
 *
 *
 * */
angular.module('JTextMinerApp')
    .factory('UserService', ['APIService', '$q', '$timeout', function(APIService, $q, $timeout)
{
    const service = {
        $fixmeUser: 'testuser',
        $user: firebase.auth().currentUser,
        $loginDeferral: $q.defer(),
        storage: {},
        tryLogin,
        logout() {
            firebase.auth().signOut().then (() => {service.storage = {}});
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
        saveTextSelection,
        addRecentSelection,
    };
    firebase.auth().onAuthStateChanged(function(user) {
        $timeout(
            () => {
                if (user) {
                    // merge the storage with the user's account
                    // saved data is simply added
                    const saved = get(SAVED_SELECTIONS, []);
                    if (saved.length > 0)
                        saved.needsMerge = true;
                    loadFromFirebase(SAVED_SELECTIONS);
                    // recent needs to be sorted by date, but for now, we'll assume that this session is more recent
                    const recent = get(RECENT_SELECTIONS, []);
                    if (recent.length > 0) {
                        service.storage[RECENT_SELECTIONS].needsMerge = true;
                        service.storage[RECENT_SELECTIONS].limit = 10;
                    }
                    loadFromFirebase(RECENT_SELECTIONS);
                    // session storage is cleared
                    window.sessionStorage.removeItem(SAVED_SELECTIONS);
                    window.sessionStorage.removeItem(RECENT_SELECTIONS);
                }
                service.$user = user;
            }
        )
    });
    const SAVED_SELECTIONS = '_savedSelections';
    const RECENT_SELECTIONS = '_recentSelections';

    function saveTextSelection(text, type) {
        saveSelection({
            title: text.title,
            subtitle: text.subtitle || null,
            type: type,
            time: Date.now(),
            text: text
        });
    }

    function saveSelection(selection) {
        addToSelectionList(selection, SAVED_SELECTIONS);
    }

    function addRecentSelection(selection) {
        addToSelectionList(selection, RECENT_SELECTIONS, 10);
    }

    function addToSelectionList(selection, listName, limit) {
        const currentList = get(listName, []);
        // only one item for a given title allowed
        const updatedList = currentList.filter(item => item.title !== selection.title);
        updatedList.unshift(selection);
        if (limit && updatedList.length > limit)
            updatedList.pop();
        store(listName, updatedList);
    }

    function getSelectionList(listName) {
        return get(listName, []);
    }

    function firebaseUserRef(key) {
        return firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/" + key);
    }

    function store(name, object) {
        service.storage[name] = object;
        if (service.$user) {
            const ref = firebaseUserRef(name);
            ref.set(object);
        }
        else
            window.sessionStorage.setItem(name, JSON.stringify(object));
    }

    function loadFromFirebase(name) {
        const ref = firebaseUserRef(name);
        ref.off();
        ref.on('value', function (data) {
            $timeout(
                () => {
                    if (data.val()) {
                        if (service.storage[name].needsMerge) {
                            const original = service.storage[name];
                            service.storage[name] = data.val();
                            original.forEach(obj => addToSelectionList(obj, name, original.limit));
                            store(name, service.storage[name]);
                        }
                        else if (!_.isEqual(service.storage[name], data.val()))
                            service.storage[name] = data.val()
                    }
                }
            );
        });
    }

    function get(name, defaultVal) {
        if (service.storage[name])
            return service.storage[name];
        if (service.$user) {
            service.storage[name] = defaultVal;
            // the login event should start filling in the data as it arrives
            // any bindings must be to the storage object and not to the list object itself
            return service.storage[name];
        }
        else {
            const stored = window.sessionStorage.getItem(name);
            if (stored === null)
                service.storage[name] = defaultVal;
            else
                service.storage[name] = JSON.parse(stored);
            return service.storage[name];
        }
    }

    function tryLogin (username) {
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
            // service.$user = login;
            if (login !== 'testuser')
                $.cookie('userLogin', login);
            window.sessionStorage.setItem('userLoginData', JSON.stringify({
                $user: 'testuser',
                $userToken: service.$userToken
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
//      service.$user = parsedData.$user;
        service.$userToken = parsedData.$userToken;
        service.$loginDeferral.resolve();
    }

    return service;
}]);