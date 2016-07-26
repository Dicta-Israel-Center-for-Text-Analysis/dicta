jTextMinerApp.directive('classNameInput', function ($rootScope) {
    return {
        restrict: 'AE',
        templateUrl: 'partials/templates/ClassNameInputTemplate.html',
        controller: ['$scope', 'ClassService', function ($scope, ClassService) {
            
            $scope.ClassName = ClassService.ClassName;
            $scope.$watch('ClassName', function () {
                ClassService.updateClassName($scope.ClassName);
            });
    
            
            $scope.$on('ClassNameUpdated', function () {
                $scope.ClassName = ClassService.ClassName;
            });
            
            $scope.Next = function (data) {
                /*
                $scope.classData = {};
                $scope.classData.actionMode = ClassService.ActionMode;
                $scope.classData.browse_FileName = BrowseClassService.Browse_FileName;
                $scope.classData.browse_ChunkMode = BrowseClassService.Browse_ChunkMode;
                $scope.classData.browse_MinimumChunkSize = BrowseClassService.Browse_MinimumChunkSize;
                $scope.classData.browse_ClassName = BrowseClassService.Browse_ClassName;
                $scope.classData.select_NumberOfChapters = SelectClassService.Select_NumberOfChapters;
                $scope.classData.select_NumberOfWords = SelectClassService.Select_NumberOfWords;
                $scope.classData.select_ChunkMode = SelectClassService.Select_ChunkMode;
                $scope.classData.select_MinimumChunkSize = SelectClassService.Select_MinimumChunkSize;
                $scope.classData.select_ChunkSize = SelectClassService.Select_ChunkSize;
                $scope.classData.select_ClassName = SelectClassService.Select_ClassName;
                */
                $scope.confirm(data);
            }

        }]
    };
});