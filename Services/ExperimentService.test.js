describe('Service: JTextMinerApp.ExperimentService', function () {

    // load the service's module
    beforeEach(module('JTextMinerApp'));

    // instantiate service
    var service;
    var httpBackend;

    //update the injection
    beforeEach(inject(function (_ExperimentService_, $httpBackend) {
        service = _ExperimentService_;
        httpBackend = $httpBackend;
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });


    it('should set a newExperiment()\'s name to "Untitled"', function () {
        expect(service.newExperiment().experimentName).toBe('Untitled');
    });

    it('should set a newExperiment()\'s algorithm to "Weka_SMO"', function () {
        expect(service.newExperiment().selectedAlgorithmTypeName).toBe('Weka_SMO');
    });

    it('should have a function resetServer that calls the NewExperiment API and checks for userLogin', function () {
        httpBackend.expectPOST(/JTextMinerAPI\/NewExperiment/).respond({userLogin: 'eden'});
        var success = false;
        service.resetServer()
            .then(function() {success = true})
            .catch(function() {success = false});
        httpBackend.flush();
        expect(success).toBe(true);
    });

});
