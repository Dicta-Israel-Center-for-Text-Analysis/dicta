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

    function getAPIUrl(endpoint) {
        const baseUrl = $location.protocol()
            // + "://localhost:8080/"
            // + "://dev.dicta.org.il/"
            + "://ec2-35-156-213-159.eu-central-1.compute.amazonaws.com/"
            + (endpoint.startsWith("JTextMinerAPI")
                // ? "NewWebSite" : "DictaDatabaseServer"
                // ? "WebServiceJTextMinerDev" : "DictaDatabaseServer"
                ? "WebServiceJTextMiner" : "DictaDatabaseServer"
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