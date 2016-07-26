jTextMinerApp.controller('FirstTabController', function ($scope, $location, InProgressService, SaveClassInterface, SelectClassService, ExperimentService, ParallelsService) {
   
    $scope.showInProcess = InProgressService.isReady != 1;
    $scope.$on('isReady_Updated', function () {
        $scope.showInProcess = InProgressService.isReady != 1;
    });

    
    $scope.currentGroupIndex = 0;
    $scope.updateGroupIndex = function (indx)
    {
        $scope.currentGroupIndex = indx;
    }
    
    $scope.chunks = ParallelsService.chunks;
    $scope.groupNames = ParallelsService.groupNames;
    $scope.groups = ParallelsService.groups;
    $scope.numOfParallelsInGroups = ParallelsService.numOfParallelsInGroups;
    $scope.numOfParallels = ParallelsService.numOfParallels;
    $scope.$on('ParallelsUpdates', function () {
        $scope.chunks = ParallelsService.chunks;
        $scope.groupNames = ParallelsService.groupNames;
        $scope.groups = ParallelsService.groups;
        $scope.numOfParallelsInGroups = ParallelsService.numOfParallelsInGroups;
        $scope.numOfParallels = ParallelsService.numOfParallels;
    });



    if (ExperimentService.user == 'user')
        $location.path('Login');


    $scope.GoToSecondTab = function () {
        $location.path('SecondTab');
    }

    $scope.GoToThirdTab = function () {
        $location.path('ThirdTab');
    }
});

