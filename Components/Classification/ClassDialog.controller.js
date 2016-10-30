// create the controller and inject Angular's $scope
jTextMinerApp.controller('ClassDialogController', function ($scope, ngDialog, ExperimentService, fileUpload, focus, APIService, InProgressService, ClassService) {
    
    
    $scope.showInProcess = InProgressService.isReady != 1;
    $scope.$on('isReady_Updated', function () {
        $scope.showInProcess = InProgressService.isReady != 1;
    });

    $scope.Select_OnlineCorpus = 'Bible';

    $scope.ActionMode = ClassService.ExperimentActionMode;
    $scope.$on('ExperimentActionModeValuesUpdated', function () {
        $scope.ActionMode = ClassService.ExperimentActionMode;
    });

    
    $scope.showBibleDialog = true;
    $scope.OpenSelectBible = function () {
        $scope.showBibleDialog = true;
        /*
        ngDialog.openConfirm({
            template: 'partials/Dialogs/partial-Bible.html',
            controller: 'BibleDialogController',
            className: 'ngdialog-theme-default',
            scope: $scope
        }).then(function (value) {
            alert("add class");
            console.log('Modal promise resolved. Value: ', value);
        }, function (reason) {
            console.log('Modal promise rejected. Reason: ', reason);
        });
        */
    };
   
    
    

    $scope.Next = function (data) {
        $scope.confirm(data);
    }

    //for first version
    $scope.maxId = ClassService.Corpus_maxId;
    $scope.classes = ClassService.Corpus_classes;
    $scope.selectedClassIndex = ClassService.selectedClassIndex;
    $scope.$watch('selectedClassIndex', function () {
        if (!angular.isUndefined($scope.selectedClassIndex)) {
            ClassService.updateSelectedClassIndex($scope.selectedClassIndex);
        }
    });
    $scope.inited = false;
    
    $scope.data = {};
    $scope.data.userLogin = ExperimentService.user;
    $scope.data.expType = ExperimentService.ExperimentTypeModel;

    $scope.inited = true;

});