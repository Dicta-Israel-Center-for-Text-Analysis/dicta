jTextMinerApp.component('parallels',
{
    templateUrl: 'Components/Parallels/parallels.component.html',
    controller: ['$scope', '$location', 'InProgressService', 'SelectClassService', 'ExperimentService', 'ParallelsService', '$sce',
        function ($scope, $location, InProgressService, SelectClassService, ExperimentService, ParallelsService, $sce) {
            var ctrl = this;
            ctrl.experiment = ParallelsService.newInstance();
        }]
});