jTextMinerApp.component('headerPage',
    {
        templateUrl: 'Components/PageStructure/header.component.html',
        controller: ['$scope', 'UserService', '$location', function ($scope, UserService, $location) {
            this.userLogin = UserService.user == "testuser" ? "Guest User" : UserService.user;;
            $scope.isShow = false;

            // if (!UserService.isLoggedIn())
                //$location.path('Login');
        }]
    }
);