jTextMinerApp.component('parallelsResults',
{
    bindings: {
        experiment: '<'
    },
    templateUrl: 'Components/Parallels/parallelsResults.component.html',
    controller: [
        function() {
            var ctrl = this;
            ctrl.filterGroup = null;
            ctrl.setDetail = function(group) {
                ctrl.filterGroup = group.name;
            }
            ctrl.setDetailAll = function() {
                ctrl.filterGroup = null;
            }
            ctrl.totalParallels = function() {
                return ctrl.experiment.groups.reduce((count, group) => group.parallels.length + count, 0);
            }
        }]
}); 