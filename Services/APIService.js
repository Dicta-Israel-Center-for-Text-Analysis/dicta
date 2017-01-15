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
    var baseUrl = $location.protocol() + "://localhost:8080/NewWebSite/api";
    //baseUrl = $location.protocol() + "://dev.dicta.org.il/WebServiceJTextMinerDev/api";
    baseUrl = $location.protocol() + "://ec2-35-156-213-159.eu-central-1.compute.amazonaws.com/WebServiceJTextMinerNewRoot8/api";
    var url = baseUrl + "/JTextMinerAPI";

    var APIService = $resource(url + "/:crud/:secondParam",
        { crud: "@crud", secondParam: "@secondParam" },
        {
            "apiRun": { method: 'POST', isArray: false },
            "apiGetArray": { method: 'POST', isArray: true },
        }
    );
    APIService.call = function (endpoint, data, config) {
        return $http.post(baseUrl + "/" + endpoint, data, config);
    }
    APIService.callParallels = function (data) {
        return $http.post("http://www.dictaparallelsserver.com/api/parallels", data);
    }
    return APIService;
});