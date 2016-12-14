describe('Service: JTextMinerApp.UserService', function () {

    // load the service's module
    beforeEach(module('JTextMinerApp'));

    // instantiate service
    var service;
    var httpBackend;

    //update the injection
    beforeEach(inject(function (_UserService_, $httpBackend) {
        service = _UserService_;
        $httpBackend.whenPOST(/.*CheckUserLogin.*/).respond({userLogin: 'eden'});
        httpBackend = $httpBackend;
    }));

    it('should default to logged out.', function () {
        expect(service.isLoggedIn()).toBe(false);
    });

    it('should succeed in logging in eden.', function () {
        httpBackend.expectPOST(/.*CheckUserLogin/);
        var loginPromise = service.tryLogin('eden');
        inject(function($rootScope) {$rootScope.$digest()});
        httpBackend.flush();
        expect(service.isLoggedIn()).toBe(true);
    });
});
