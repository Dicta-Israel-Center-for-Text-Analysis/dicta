jTextMinerApp.factory('AlertsService', function ($rootScope) {
    var root = {};

    root.alerts = [];
    //[
    //  { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
    //  { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
    //];
    root.updateAlerts = function (value) {
        this.alerts = value;
        $rootScope.$broadcast("alertsUpdated");
    }
    root.pushAlerts = function (value) {
        this.alerts.push(value);
        $rootScope.$broadcast("alertsUpdated");
    }
    root.deleteAlert = function (index) {
        this.alerts.splice(index, 1);
        $rootScope.$broadcast("alertsUpdated");
    }
    root.determineAlert = function (value) {
        this.alerts = [];
        this.pushAlerts(value);
    }

    return root;
});