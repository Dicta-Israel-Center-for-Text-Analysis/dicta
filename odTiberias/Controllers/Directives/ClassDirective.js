

jTextMinerApp.directive('trainingClasses', function () {
    return {
        restrict: 'AE',
        templateUrl: 'partials/templates/TrainingClassTemplate.html',
        scope: {
            showDeleteButton: '=showDeleteButton'
        },
        controller: ['$scope', 'ExperimentService', 'APIService', 'FeatureService', 'ClassService', 'InProgressService', function ($scope, ExperimentService, APIService, FeatureService, ClassService, InProgressService) {
            $scope.colors = ['Red', 'Green', 'Blue'];

            $scope.classes = ClassService.Corpus_classes;
            $scope.$on('Corpus_classesValueUpdated', function () {
                $scope.classes = ClassService.Corpus_classes;
            });
            
            $scope.DeleteClass = function (index) {
                InProgressService.updateIsReady(0);
                var currentClass = ClassService.Corpus_classes[index];
                var data = {};
                data.title = currentClass.title;
                data.id = currentClass.id;
                data.userLogin = ExperimentService.user;
                data.expType = ExperimentService.ExperimentTypeModel;
                data.expName = ExperimentService.ExperimentName;

                APIService.apiRun({ crud: 'DeleteClass' }, data, function (response) {
                    ClassService.Corpus_classes.splice(index, 1);
                    FeatureService.updateFeaturesData({});
                    ClassService.updateIsAllBibleValue(true);
                    for (var i = 0; i < ClassService.Corpus_classes.length; i++) {
                        var corpusClass = ClassService.Corpus_classes[i];
                        ClassService.updateIsAllBibleValue(ClassService.isAllBible && corpusClass.bible);
                    }
                    InProgressService.updateIsReady(1);
                    var results = response;
                });
            }
        }]
    };
});