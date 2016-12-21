jTextMinerApp.component('trainingClasses', {
    templateUrl: 'Components/Classification/trainingClasses.component.html',
    bindings: {
        showDeleteButton: '<',
        classificationExperiment: '<'
    },
    controller: ['$scope', 'ExperimentService', 'APIService', 'ClassificationService', 'ClassService', 'InProgressService', function ($scope, ExperimentService, APIService, ClassificationService, ClassService, InProgressService) {
        var ctrl = this;
        
        $scope.colors = ['Red', 'Green', 'Blue'];

        $scope.classes = ClassService.Corpus_classes;
        $scope.$on('Corpus_classesValueUpdated', function () {
            $scope.classes = ClassService.Corpus_classes;
        });

        $scope.DeleteClass = function (index) {
            ctrl.classificationExperiment.DeleteClass(index);
        }
    }]
});