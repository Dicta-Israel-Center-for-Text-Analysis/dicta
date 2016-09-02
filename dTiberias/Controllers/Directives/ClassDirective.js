

jTextMinerApp.directive('trainingClasses', function () {
    return {
        restrict: 'AE',
        templateUrl: 'partials/templates/TrainingClassTemplate.html',
        scope: {
            showDeleteButton: '=showDeleteButton'
        },
        controller: ['$scope', 'ExperimentService', 'APIService', 'ClassificationService', 'ClassService', 'InProgressService', function ($scope, ExperimentService, APIService, ClassificationService, ClassService, InProgressService) {
            $scope.colors = ['Red', 'Green', 'Blue'];

            $scope.classes = ClassService.Corpus_classes;
            $scope.$on('Corpus_classesValueUpdated', function () {
                $scope.classes = ClassService.Corpus_classes;
            });

            $scope.DeleteClass = function (index) {
                ClassificationService.DeleteClass(index);
            }
        }]
    };
});