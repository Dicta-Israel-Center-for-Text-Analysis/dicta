jTextMinerApp.component('classNameInput', {
        templateUrl: 'Components/Classification/classNameInput.component.html',
        controller: ['$scope', 'ClassService', function ($scope, ClassService) {
            
            $scope.ClassName = ClassService.ClassName;
            $scope.$watch('ClassName', function () {
                ClassService.updateClassName($scope.ClassName);
            });
    
            
            $scope.$on('ClassNameUpdated', function () {
                $scope.ClassName = ClassService.ClassName;
            });
            
            $scope.Next = function (data) {
                $scope.confirm(data);
            }

        }]
});