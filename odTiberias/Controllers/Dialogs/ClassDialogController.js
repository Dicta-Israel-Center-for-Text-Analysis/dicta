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

    // http://wwwendt.de/tech/dynatree/doc/dynatree-doc.html 
    $("#classTree").dynatree({
        checkbox: false,
        selectMode: 3,
        //children: classTreeData,
        onSelect: function (select, node) {
            // Get a list of all selected TOP nodes
            var selRootNodes = node.tree.getSelectedNodes(true);
            // Get a list of ALL selected nodes
            selRootNodes = node.tree.getSelectedNodes(false);

            // ... and convert to a key array:
            var selRootKeys = $.map(selRootNodes, function (node) {
                return node.data.key;
            });

        },
        onDblClick: function (node, event) {
            node.toggleSelect();
        },
        onKeydown: function (node, event) {
            if (event.which == 32) {
                node.toggleSelect();
                return false;
            }
        },
        initAjax: {
            url: ExperimentService.baseUrl + "/GetStoredClasses",
            data: $scope.data
        },
        autoFocus: true, // Set focus to first child, when expanding or lazy-loading.
        // The following options are only required, if we have more than one tree on one page:
        //initId: "classTreeData",
        cookieId: "dynatree-Cc",
        idPrefix: "dynatree-Cc-"
    });

    $scope.inited = true;

});