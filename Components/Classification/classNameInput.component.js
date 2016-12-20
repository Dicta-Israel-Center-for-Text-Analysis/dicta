jTextMinerApp.component('classNameInput', {
        bindings: { onConfirm: '&' },
        templateUrl: 'Components/Classification/classNameInput.component.html',
        controller: ['$scope', 'ClassService', function ($scope, ClassService) {
            $scope.ClassName = ClassService.ClassName;

            $scope.Next = function (data) {
                onConfirm(data);
            }
        }]
});