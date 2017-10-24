/**
 * @ngdoc service
 * @name JTextMinerApp:APIService
 *
 * @description
 *
 *
 * */
angular.module('JTextMinerApp')
        .factory("APIService", function ($resource, $http, $location, $q) {
    function hostToUrlPrefix(host) {
        if (host.startsWith("localhost")) return "://localhost:8080/";
        if (host.startsWith("dev.dicta")) return "://dev.dicta.org.il/";
        return "://ec2-35-156-213-159.eu-central-1.compute.amazonaws.com/";
    }

    function hostToEndpoint(host) {
        //if (host.startsWith("localhost")) return "DictaComputeServer";
        //if (host.startsWith("dev.dicta")) return "DictaComputeServer";
        return "DictaComputeServer";
    }
    function getAPIUrl(endpoint) {
        const baseUrl = $location.protocol()
            + hostToUrlPrefix($location.host())
            + (endpoint.startsWith("JTextMinerAPI")
                ? hostToEndpoint($location.host()) : "DictaDatabaseServer"
            ) + "/api/";
        return baseUrl + endpoint;
    }

    var APIService = $resource(getAPIUrl("JTextMinerAPI") + "/:crud/:secondParam",
        { crud: "@crud", secondParam: "@secondParam" },
        {
            "apiRun": { method: 'POST', isArray: false },
            "apiGetArray": { method: 'POST', isArray: true },
        }
    );
    APIService.call = function (endpoint, data, config) {
        return $http.post(getAPIUrl(endpoint), data, config);
    };
    APIService.callParallels = function (endpoint, data) {
        const storageKey = endpoint + ":" + JSON.stringify(data);
        const cache = window.sessionStorage.getItem(storageKey);
        if (cache)
            return $q.resolve(JSON.parse(cache));
        return $http.post("http://www.dictaparallelsserver.com/api/" + endpoint, data)
                    .then(function(result) {
                        try {
                            window.sessionStorage.setItem(storageKey, JSON.stringify(result));
                        }
                        // there might not be sufficient storage space
                        catch (e) {}
                        return result;
                    });
    };
    APIService.search = function (data, config) {
        let server = 'dev.dicta.org.il';
        if ($location.host().startsWith('server'))
            server = $location.host();
        return $http.post($location.protocol() + "://" + server + "/essearch/", data, config);
    };

    return APIService;
});