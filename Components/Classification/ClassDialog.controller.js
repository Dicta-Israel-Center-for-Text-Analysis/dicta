jTextMinerApp.controller('ClassDialogController', function ($scope, ngDialog, UserService, ExperimentService, fileUpload, focus, APIService, InProgressService, ClassService) {

    $scope.showInProcess = InProgressService.isReady != 1;
    $scope.$on('isReady_Updated', function () {
        $scope.showInProcess = InProgressService.isReady != 1;
    });

    $scope.ActionMode = ClassService.ExperimentActionMode;
    $scope.$on('ExperimentActionModeValuesUpdated', function () {
        $scope.ActionMode = ClassService.ExperimentActionMode;
    });
    
    $scope.showBibleDialog = true;

    $scope.maxId = ClassService.Corpus_maxId;
    $scope.classes = ClassService.Corpus_classes;

    $scope.inited = true;

});