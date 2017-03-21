/**
 * @ngdoc service
 * @name JTextMinerApp:APIService
 *
 * @description
 *
 *
 * */
angular.module('JTextMinerApp')
        .factory("APIService", function ($resource, $http, $location) {
    function hostToUrlPrefix(host) {
        if (host.startsWith("localhost")) return "://localhost:8080/";
        if (host.startsWith("dev.dicta")) return "://dev.dicta.org.il/";
        return "://ec2-35-156-213-159.eu-central-1.compute.amazonaws.com/";
    }

    function hostToEndpoint(host) {
        if (host.startsWith("localhost")) return "NewWebSite";
        if (host.startsWith("dev.dicta")) return "WebServiceJTextMinerDev";
        return "WebServiceJTextMiner";
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
        return $http.post("http://www.dictaparallelsserver.com/api/" + endpoint, data);
    };
    return APIService;
});