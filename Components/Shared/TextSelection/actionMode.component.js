jTextMinerApp.component('actionMode', {
    bindings: {
        onActionModeChanged: '&'
    },
    templateUrl: 'Components/Shared/TextSelection/actionMode.component.html',
    controller: [function () {
        var ctrl = this;
        ctrl.ExperimentActionMode = 'SelectOnlineCorpus';

        ctrl.changeActionMode = function (mode) {
            ctrl.ExperimentActionMode = mode;
            ctrl.onActionModeChanged({mode: mode});
        };
        //ClassService.ExperimentActionMode;
        //$scope.$watch('ExperimentActionMode', function () {
        //    ClassService.updateExperimentActionMode($scope.ExperimentActionMode);
        //});

        //$scope.$on('ExperimentActionModeValuesUpdated', function () {
        //    if ($scope.ExperimentActionMode != ClassService.ExperimentActionMode)
        //        $scope.ExperimentActionMode = ClassService.ExperimentActionMode;
        //});
    }]
});