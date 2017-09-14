jTextMinerApp.factory('StateService', function() {
    const service = {
        registry: {},
        getOrCreate(key, func) {
            if (!service.registry.hasOwnProperty(key))
                service.registry[key] = func();
            return service.registry[key]
        }
    };
    return service;
});